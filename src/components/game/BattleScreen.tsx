import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types/game";
import { questions } from "@/data/questions";
import HealthBar from "./HealthBar";
import Fighter from "./Fighter";
import QuestionCard from "./QuestionCard";

interface BattleScreenProps {
  player1: Player;
  player2: Player;
  onGameEnd: (p1: Player, p2: Player) => void;
}

const TOTAL_QUESTIONS = 10;
const DAMAGE = 20;

const BattleScreen = ({ player1: initP1, player2: initP2, onGameEnd }: BattleScreenProps) => {
  const [p1, setP1] = useState<Player>({ ...initP1 });
  const [p2, setP2] = useState<Player>({ ...initP2 });
  const [currentQ, setCurrentQ] = useState(0);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [attackingPlayer, setAttackingPlayer] = useState<1 | 2 | null>(null);
  const [hurtPlayer, setHurtPlayer] = useState<1 | 2 | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [roundMessage, setRoundMessage] = useState("");

  const shuffledQuestions = useMemo(() => {
    return [...questions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
  }, []);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const attacker = turn;
      const defender = turn === 1 ? 2 : 1;

      setTimeout(() => {
        if (isCorrect) {
          setAttackingPlayer(attacker);
          setHurtPlayer(defender);
          setRoundMessage(
            `¡${attacker === 1 ? p1.name : p2.name} ataca!`
          );

          if (defender === 2) {
            setP2((prev) => ({
              ...prev,
              health: Math.max(0, prev.health - DAMAGE),
            }));
            setP1((prev) => ({ ...prev, score: prev.score + 1 }));
          } else {
            setP1((prev) => ({
              ...prev,
              health: Math.max(0, prev.health - DAMAGE),
            }));
            setP2((prev) => ({ ...prev, score: prev.score + 1 }));
          }
        } else {
          setRoundMessage(
            `¡${attacker === 1 ? p1.name : p2.name} falla!`
          );
        }

        setTimeout(() => {
          setAttackingPlayer(null);
          setHurtPlayer(null);

          // Check end conditions
          const nextP1Health = isCorrect && defender === 1 ? Math.max(0, p1.health - DAMAGE) : p1.health;
          const nextP2Health = isCorrect && defender === 2 ? Math.max(0, p2.health - DAMAGE) : p2.health;

          if (nextP1Health <= 0 || nextP2Health <= 0 || currentQ >= TOTAL_QUESTIONS - 1) {
            setTimeout(() => {
              onGameEnd(
                { ...p1, health: nextP1Health, score: p1.score + (isCorrect && attacker === 1 ? 1 : 0) },
                { ...p2, health: nextP2Health, score: p2.score + (isCorrect && attacker === 2 ? 1 : 0) }
              );
            }, 500);
            return;
          }

          setShowTransition(true);
          setTimeout(() => {
            setShowTransition(false);
            setRoundMessage("");
            if (turn === 2) {
              setCurrentQ((q) => q + 1);
            }
            setTurn(turn === 1 ? 2 : 1);
          }, 1200);
        }, 800);
      }, 500);
    },
    [turn, p1, p2, currentQ, onGameEnd]
  );

  return (
    <div className="min-h-screen bg-arena flex flex-col">
      {/* Top: Health bars */}
      <div className="flex items-start justify-between p-4 md:p-6">
        <HealthBar health={p1.health} playerName={p1.name} player={1} />
        <div className="font-arcade text-accent text-shadow-neon-gold text-sm md:text-base mt-2">VS</div>
        <HealthBar health={p2.health} playerName={p2.name} player={2} flipped />
      </div>

      {/* Middle: Fighters */}
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        <Fighter
          avatar={p1.avatar}
          player={1}
          isAttacking={attackingPlayer === 1}
          isHurt={hurtPlayer === 1}
          isIdle={!attackingPlayer && !hurtPlayer}
        />

        <AnimatePresence>
          {roundMessage && (
            <motion.div
              className="font-arcade text-xs md:text-sm text-accent text-shadow-neon-gold text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {roundMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <Fighter
          avatar={p2.avatar}
          player={2}
          isAttacking={attackingPlayer === 2}
          isHurt={hurtPlayer === 2}
          isIdle={!attackingPlayer && !hurtPlayer}
        />
      </div>

      {/* Bottom: Question */}
      <div className="flex-1 px-4 pb-6">
        <AnimatePresence mode="wait">
          {showTransition ? (
            <motion.div
              key="transition"
              className="flex items-center justify-center h-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span
                className={`font-arcade text-lg ${
                  turn === 2 ? "text-primary text-shadow-neon-red" : "text-secondary text-shadow-neon-blue"
                }`}
              >
                TURNO JUGADOR {turn === 1 ? 2 : 1}
              </span>
            </motion.div>
          ) : (
            shuffledQuestions[currentQ] && (
              <QuestionCard
                key={`${currentQ}-${turn}`}
                question={shuffledQuestions[currentQ]}
                currentTurn={turn}
                onAnswer={handleAnswer}
                questionNumber={Math.floor(currentQ * 2 + (turn === 2 ? 2 : 1))}
                totalQuestions={TOTAL_QUESTIONS * 2}
              />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BattleScreen;
