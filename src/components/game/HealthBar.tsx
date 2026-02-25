import { motion } from "framer-motion";

interface HealthBarProps {
  health: number;
  playerName: string;
  player: 1 | 2;
  flipped?: boolean;
}

const HealthBar = ({ health, playerName, player, flipped }: HealthBarProps) => {
  const isLow = health <= 30;

  return (
    <div className={`flex flex-col gap-1 ${flipped ? "items-end" : "items-start"}`}>
      <span
        className={`font-arcade text-[10px] md:text-xs ${
          player === 1 ? "text-primary" : "text-secondary"
        }`}
      >
        {playerName}
      </span>
      <div
        className={`w-36 md:w-52 h-4 md:h-5 bg-muted rounded-full overflow-hidden border border-border ${
          flipped ? "flex justify-end" : ""
        }`}
      >
        <motion.div
          className={`h-full rounded-full ${
            isLow ? "bg-health-bar-low" : "bg-health-bar"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${Math.max(0, health)}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>
      <span className="font-body text-xs text-muted-foreground">{Math.max(0, Math.round(health))}%</span>
    </div>
  );
};

export default HealthBar;
