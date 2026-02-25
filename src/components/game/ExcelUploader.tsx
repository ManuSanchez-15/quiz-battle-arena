import { useRef, useState } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { Question } from "@/data/questions";

interface ExcelUploaderProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  loadedCount: number;
}

const ExcelUploader = ({ onQuestionsLoaded, loadedCount }: ExcelUploaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const parseFile = (file: File) => {
    setError("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (rows.length === 0) {
          setError("El archivo está vacío");
          return;
        }

        const parsed: Question[] = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const question = String(row["pregunta"] ?? row["Pregunta"] ?? row["question"] ?? row["Question"] ?? "").trim();
          const a = String(row["a"] ?? row["A"] ?? row["opcion1"] ?? row["Opcion1"] ?? "").trim();
          const b = String(row["b"] ?? row["B"] ?? row["opcion2"] ?? row["Opcion2"] ?? "").trim();
          const c = String(row["c"] ?? row["C"] ?? row["opcion3"] ?? row["Opcion3"] ?? "").trim();
          const d = String(row["d"] ?? row["D"] ?? row["opcion4"] ?? row["Opcion4"] ?? "").trim();
          const correctRaw = String(row["correcta"] ?? row["Correcta"] ?? row["correct"] ?? row["Correct"] ?? "").trim().toUpperCase();
          const category = String(row["categoria"] ?? row["Categoria"] ?? row["category"] ?? row["Category"] ?? "General").trim();

          if (!question || !a || !b || !c || !d) continue;

          const correctMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
          const correctIndex = correctMap[correctRaw] ?? 0;

          parsed.push({
            id: i + 1,
            question,
            options: [a, b, c, d],
            correctIndex,
            category,
          });
        }

        if (parsed.length === 0) {
          setError("No se encontraron preguntas válidas. Usa columnas: pregunta, a, b, c, d, correcta, categoria");
          return;
        }

        onQuestionsLoaded(parsed);
      } catch {
        setError("Error al leer el archivo. Asegúrate de que es un Excel válido.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) parseFile(file);
        }}
      />

      <motion.button
        type="button"
        onClick={() => fileRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg border-2 border-dashed border-accent/40 bg-accent/5 hover:bg-accent/10 text-accent font-body text-sm font-semibold transition-all"
      >
        📂 {loadedCount > 0 ? "CAMBIAR ARCHIVO" : "CARGAR PREGUNTAS (.xlsx)"}
      </motion.button>

      {fileName && !error && (
        <p className="text-xs text-accent font-body text-center">
          ✅ {fileName} — {loadedCount} preguntas cargadas
        </p>
      )}

      {error && (
        <p className="text-xs text-wrong font-body text-center">{error}</p>
      )}

      <p className="text-[10px] text-muted-foreground text-center font-body leading-relaxed">
        Columnas: <span className="text-foreground/70">pregunta, a, b, c, d, correcta (A/B/C/D), categoria</span>
      </p>
    </div>
  );
};

export default ExcelUploader;
