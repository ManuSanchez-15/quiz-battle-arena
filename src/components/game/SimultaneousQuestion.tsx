import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Question } from "@/data/questions";

interface SimultaneousQuestionProps {
  question: Question;
  p1Name: string;
  p2Name: string;
  questionNumber: number;
  totalQuestions: number;
  onResult: (result: { winner: 1 | 2 | "draw" | "timeout" }) => void;
}

const P1_KEYS = ["1", "2", "3", "4"];
const P2_KEYS = ["7", "8", "9", "0"];

const SimultaneousQuestion = ({
  question,
  p1Name,
  p2Name,
  questionNumber,
  totalQuestions,
  onResult,
}: SimultaneousQuestionProps) => {
  const [p1Answer, setP1Answer] = useState<number | null>(null);
  const [p2Answer, setP2Answer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [resolved, setResolved] = useState(false);
  const resolvedRef = useRef(false);
  const p1AnswerRef = useRef<number | null>(null);
  const p2AnswerRef = useRef<number | null>(null);

  // Resolve the round
  const resolve = useCallback(
    (p1: number | null, p2: number | null) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      setResolved(true);

      const p1Correct = p1 !== null && p1 === question.correctIndex;
      const p2Correct = p2 !== null && p2 === question.correctIndex;

      if (p1 === null && p2 === null) {
        onResult({ winner: "timeout" });
      } else if (p1Correct && p2Correct) {
        onResult({ winner: "draw" });
      } else if (p1Correct) {
        onResult({ winner: 1 });
      } else if (p2Correct) {
        onResult({ winner: 2 });
      } else {
        // Both answered wrong
        onResult({ winner: "timeout" });
      }
    },
    [question.correctIndex, onResult]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (resolvedRef.current) return;

      const p1Index = P1_KEYS.indexOf(e.key);
      const p2Index = P2_KEYS.indexOf(e.key);

      if (p1Index !== -1 && p1AnswerRef.current === null) {
        p1AnswerRef.current = p1Index;
        setP1Answer(p1Index);
        // If P2 already answered, resolve
        if (p2AnswerRef.current !== null) {
          resolve(p1Index, p2AnswerRef.current);
        }
      }

      if (p2Index !== -1 && p2AnswerRef.current === null) {
        p2AnswerRef.current = p2Index;
        setP2Answer(p2Index);
        // If P1 already answered, resolve
        if (p1AnswerRef.current !== null) {
          resolve(p1AnswerRef.current, p2Index);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [resolve]);

  // Auto-resolve if only one player answered after a short delay
  useEffect(() => {
    if (resolved) return;
    const hasP1 = p1Answer !== null;
    const hasP2 = p2Answer !== null;
    if ((hasP1 && !hasP2) || (!hasP1 && hasP2)) {
      // If the first answerer got it right → 1s grace; wrong → 2s grace
      const firstAnswer = hasP1 ? p1AnswerRef.current : p2AnswerRef.current;
      const isCorrect = firstAnswer === question.correctIndex;
      const grace = isCorrect ? 1000 : 2000;
      const timer = setTimeout(() => {
        if (!resolvedRef.current) {
          resolve(p1AnswerRef.current, p2AnswerRef.current);
        }
      }, grace);
      return () => clearTimeout(timer);
    }
  }, [p1Answer, p2Answer, resolved, resolve, question.correctIndex]);

  // Timer
  useEffect(() => {
    if (resolved) return;
    if (timeLeft <= 0) {
      resolve(p1AnswerRef.current, p2AnswerRef.current);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, resolved, resolve]);

  // Touch/click handler for mobile
  const handleClick = (player: 1 | 2, index: number) => {
    if (resolvedRef.current) return;
    if (player === 1 && p1AnswerRef.current === null) {
      p1AnswerRef.current = index;
      setP1Answer(index);
      if (p2AnswerRef.current !== null) resolve(index, p2AnswerRef.current);
    }
    if (player === 2 && p2AnswerRef.current === null) {
      p2AnswerRef.current = index;
      setP2Answer(index);
      if (p1AnswerRef.current !== null) resolve(p1AnswerRef.current, index);
    }
  };

  const getOptionStyle = (playerAnswer: number | null, index: number) => {
    if (!resolved) {
      return playerAnswer === index
        ? "border-accent bg-accent/20"
        : "border-border bg-muted/50 hover:bg-muted";
    }
    if (index === question.correctIndex) return "border-correct bg-correct/20";
    if (playerAnswer === index) return "border-wrong bg-wrong/20";
    return "border-border bg-muted/30 opacity-40";
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-arcade text-[9px] text-muted-foreground">
          RONDA {questionNumber}/{totalQuestions}
        </span>
        <span className="font-arcade text-[9px] text-accent">
          ¡AMBOS A LA VEZ!
        </span>
      </div>

      {/* Timer */}
      <div className="w-full h-2 bg-muted rounded-full mb-3 overflow-hidden">
        <motion.div
          className="h-full bg-timer rounded-full"
          animate={{ width: `${(timeLeft / 10) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Category + Question */}
      <div className="text-center mb-4">
        <span className="inline-block text-xs font-semibold text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-2">
          {question.category}
        </span>
        <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
          {question.question}
        </h3>
      </div>

      {/* Split answer panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* P1 Panel */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-arcade text-[9px] text-primary text-shadow-neon-red">
              {p1Name}
            </span>
            <span className="text-[8px] text-muted-foreground font-arcade">
              (1-2-3-4)
            </span>
            {p1Answer !== null && !resolved && (
              <span className="text-[8px] text-accent font-arcade">✓ LISTO</span>
            )}
          </div>
          <div className="grid gap-2">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleClick(1, i)}
                disabled={resolved || p1Answer !== null}
                whileTap={!resolved && p1Answer === null ? { scale: 0.97 } : {}}
                className={`w-full text-left px-3 py-2 rounded-lg border-2 font-body text-sm font-semibold transition-all ${getOptionStyle(
                  p1Answer, i
                )} ${resolved || p1Answer !== null ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="text-muted-foreground mr-1.5 font-arcade text-[9px]">
                  {P1_KEYS[i]}.
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>

        {/* P2 Panel */}
        <div>
          <div className="flex items-center gap-2 mb-2 justify-end">
            {p2Answer !== null && !resolved && (
              <span className="text-[8px] text-accent font-arcade">✓ LISTO</span>
            )}
            <span className="text-[8px] text-muted-foreground font-arcade">
              (7-8-9-0)
            </span>
            <span className="font-arcade text-[9px] text-secondary text-shadow-neon-blue">
              {p2Name}
            </span>
          </div>
          <div className="grid gap-2">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleClick(2, i)}
                disabled={resolved || p2Answer !== null}
                whileTap={!resolved && p2Answer === null ? { scale: 0.97 } : {}}
                className={`w-full text-left px-3 py-2 rounded-lg border-2 font-body text-sm font-semibold transition-all ${getOptionStyle(
                  p2Answer, i
                )} ${resolved || p2Answer !== null ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="text-muted-foreground mr-1.5 font-arcade text-[9px]">
                  {P2_KEYS[i]}.
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SimultaneousQuestion;
