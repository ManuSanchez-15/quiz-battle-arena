import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  currentTurn: 1 | 2;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard = ({
  question,
  currentTurn,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setAnswered(false);
    setTimeLeft(15);
  }, [question.id]);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      onAnswer(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, onAnswer]);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    onAnswer(index === question.correctIndex);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return index === selectedIndex
        ? "border-accent bg-accent/10"
        : "border-border bg-muted/50 hover:border-muted-foreground hover:bg-muted";
    }
    if (index === question.correctIndex) return "border-correct bg-correct/20";
    if (index === selectedIndex) return "border-wrong bg-wrong/20";
    return "border-border bg-muted/30 opacity-50";
  };

  return (
    <motion.div
      className="w-full max-w-xl mx-auto"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-arcade text-[9px] text-muted-foreground">
          {questionNumber}/{totalQuestions}
        </span>
        <span
          className={`font-arcade text-[9px] ${
            currentTurn === 1 ? "text-primary" : "text-secondary"
          }`}
        >
          TURNO: JUGADOR {currentTurn}
        </span>
      </div>

      {/* Timer */}
      <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-timer rounded-full"
          animate={{ width: `${(timeLeft / 15) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Category */}
      <span className="inline-block text-xs font-semibold text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-3">
        {question.category}
      </span>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-bold text-foreground mb-5 leading-tight">
        {question.question}
      </h3>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            whileHover={!answered ? { scale: 1.01 } : {}}
            whileTap={!answered ? { scale: 0.99 } : {}}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 font-body text-base font-semibold transition-all ${getOptionStyle(
              i
            )} ${answered ? "cursor-default" : "cursor-pointer"}`}
          >
            <span className="text-muted-foreground mr-2 font-arcade text-[10px]">
              {String.fromCharCode(65 + i)}.
            </span>
            {option}
          </motion.button>
        ))}
      </div>

      {answered && timeLeft <= 0 && selectedIndex === null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-wrong font-arcade text-xs mt-4"
        >
          ¡TIEMPO AGOTADO!
        </motion.p>
      )}
    </motion.div>
  );
};

export default QuestionCard;
