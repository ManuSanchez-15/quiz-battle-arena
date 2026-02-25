import { motion } from "framer-motion";
import { Player } from "@/types/game";

interface ResultScreenProps {
  player1: Player;
  player2: Player;
  onPlayAgain: () => void;
}

const ResultScreen = ({ player1, player2, onPlayAgain }: ResultScreenProps) => {
  const isDraw = player1.health === player2.health && player1.score === player2.score;
  const winner =
    player1.health > player2.health
      ? player1
      : player2.health > player1.health
      ? player2
      : player1.score >= player2.score
      ? player1
      : player2;
  const loser = winner === player1 ? player2 : player1;
  const winnerNum = winner === player1 ? 1 : 2;

  return (
    <div className="min-h-screen bg-arena flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center"
      >
        {isDraw ? (
          <h1 className="font-arcade text-2xl md:text-4xl text-accent text-shadow-neon-gold mb-4">
            ¡EMPATE!
          </h1>
        ) : (
          <>
            <h1 className="font-arcade text-xl md:text-3xl text-accent text-shadow-neon-gold mb-2">
              ¡VICTORIA!
            </h1>
            <motion.img
              src={winner.avatar.image}
              alt={winner.name}
              className="w-36 h-36 md:w-48 md:h-48 object-contain mx-auto mb-4 drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <h2
              className={`font-arcade text-lg md:text-2xl mb-6 ${
                winnerNum === 1
                  ? "text-primary text-shadow-neon-red"
                  : "text-secondary text-shadow-neon-blue"
              }`}
            >
              {winner.name}
            </h2>
          </>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 gap-6 w-full max-w-md mb-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[player1, player2].map((p, i) => (
          <div
            key={i}
            className={`bg-card/80 border rounded-xl p-4 text-center ${
              p === winner && !isDraw
                ? i === 0
                  ? "border-primary shadow-neon-red"
                  : "border-secondary shadow-neon-blue"
                : "border-border"
            }`}
          >
            <img
              src={p.avatar.image}
              alt={p.name}
              className="w-16 h-16 object-contain mx-auto mb-2"
            />
            <p
              className={`font-arcade text-[10px] mb-2 ${
                i === 0 ? "text-primary" : "text-secondary"
              }`}
            >
              {p.name}
            </p>
            <div className="space-y-1 text-sm text-muted-foreground font-body">
              <p>
                Vida: <span className="text-foreground font-semibold">{Math.max(0, Math.round(p.health))}%</span>
              </p>
              <p>
                Aciertos: <span className="text-foreground font-semibold">{p.score}</span>
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.button
        onClick={onPlayAgain}
        className="font-arcade text-sm bg-accent text-accent-foreground px-8 py-3 rounded-lg shadow-neon-gold hover:scale-105 transition-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        JUGAR DE NUEVO
      </motion.button>
    </div>
  );
};

export default ResultScreen;
