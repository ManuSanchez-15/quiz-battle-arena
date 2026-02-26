import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types/game";
import { questions, Question } from "@/data/questions";
import HealthBar from "./HealthBar";
import Fighter from "./Fighter";
import SimultaneousQuestion from "./SimultaneousQuestion";

interface BattleScreenProps {
  player1: Player;
  player2: Player;
  onGameEnd: (p1: Player, p2: Player) => void;
  customQuestions?: Question[];
}

const TOTAL_QUESTIONS = 10;
const DAMAGE = 20;

const BattleScreen = ({ player1: initP1, player2: initP2, onGameEnd, customQuestions }: BattleScreenProps) => {
  const [p1, setP1] = useState<Player>({ ...initP1 });
  const [p2, setP2] = useState<Player>({ ...initP2 });
  const [currentQ, setCurrentQ] = useState(0);
  const [attackingPlayer, setAttackingPlayer] = useState<1 | 2 | null>(null);
  const [hurtPlayer, setHurtPlayer] = useState<1 | 2 | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [roundMessage, setRoundMessage] = useState("");
  const [blocked, setBlocked] = useState(false);
  const p1Ref = useRef(p1);
  const p2Ref = useRef(p2);
  p1Ref.current = p1;
  p2Ref.current = p2;

  const sourceQuestions = customQuestions && customQuestions.length > 0 ? customQuestions : questions;
  const shuffledQuestions = useMemo(() => {
    return [...sourceQuestions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
  }, [sourceQuestions]);

  const advanceOrEnd = useCallback(
    (nextP1: Player, nextP2: Player) => {
      if (nextP1.health <= 0 || nextP2.health <= 0 || currentQ >= TOTAL_QUESTIONS - 1) {
        setTimeout(() => onGameEnd(nextP1, nextP2), 600);
      } else {
        setShowTransition(true);
        setTimeout(() => {
          setShowTransition(false);
          setRoundMessage("");
          setBlocked(false);
          setCurrentQ((q) => q + 1);
        }, 1200);
      }
    },
    [currentQ, onGameEnd]
  );

  const handleResult = useCallback(
    (result: { winner: 1 | 2 | "draw" | "timeout" }) => {
      setTimeout(() => {
        if (result.winner === "timeout") {
          setRoundMessage("¡TIEMPO AGOTADO!");
          setTimeout(() => {
            advanceOrEnd(p1Ref.current, p2Ref.current);
          }, 800);
          return;
        }

        if (result.winner === "draw") {
          setBlocked(true);
          setRoundMessage("¡BLOQUEADO!");
          setTimeout(() => {
            advanceOrEnd(p1Ref.current, p2Ref.current);
          }, 800);
          return;
        }

        const attacker = result.winner;
        const defender = attacker === 1 ? 2 : 1;

        setAttackingPlayer(attacker);
        setHurtPlayer(defender);
        setRoundMessage(`¡${attacker === 1 ? p1Ref.current.name : p2Ref.current.name} ataca!`);

        let nextP1 = { ...p1Ref.current };
        let nextP2 = { ...p2Ref.current };

        if (attacker === 1) {
          nextP2 = { ...nextP2, health: Math.max(0, nextP2.health - DAMAGE) };
          nextP1 = { ...nextP1, score: nextP1.score + 1 };
        } else {
          nextP1 = { ...nextP1, health: Math.max(0, nextP1.health - DAMAGE) };
          nextP2 = { ...nextP2, score: nextP2.score + 1 };
        }

        setP1(nextP1);
        setP2(nextP2);

        setTimeout(() => {
          setAttackingPlayer(null);
          setHurtPlayer(null);
          advanceOrEnd(nextP1, nextP2);
        }, 2200);
      }, 300);
    },
    [advanceOrEnd]
  );

  return (
    <div className="min-h-screen bg-arena flex flex-col">
      {/* Health bars */}
      <div className="flex items-start justify-between p-4 md:p-6">
        <HealthBar health={p1.health} playerName={p1.name} player={1} />
        <div className="font-arcade text-accent text-shadow-neon-gold text-sm md:text-base mt-2">VS</div>
        <HealthBar health={p2.health} playerName={p2.name} player={2} flipped />
      </div>

      {/* Fighters */}
      <div className="flex items-center justify-between px-6 md:px-16 py-2">
        <Fighter
          avatar={p1.avatar}
          player={1}
          isAttacking={attackingPlayer === 1}
          isHurt={hurtPlayer === 1}
          isIdle={!attackingPlayer && !hurtPlayer && !blocked}
        />

        <AnimatePresence>
          {roundMessage && (
            <motion.div
              className={`font-arcade text-xs md:text-sm text-center ${
                blocked
                  ? "text-secondary text-shadow-neon-blue"
                  : "text-accent text-shadow-neon-gold"
              }`}
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
          isIdle={!attackingPlayer && !hurtPlayer && !blocked}
        />
      </div>

      {/* Question area */}
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
              <span className="font-arcade text-lg text-accent text-shadow-neon-gold">
                RONDA {Math.min(currentQ + 2, TOTAL_QUESTIONS)}
              </span>
            </motion.div>
          ) : (
            shuffledQuestions[currentQ] && (
              <SimultaneousQuestion
                key={currentQ}
                question={shuffledQuestions[currentQ]}
                p1Name={p1.name}
                p2Name={p2.name}
                questionNumber={currentQ + 1}
                totalQuestions={TOTAL_QUESTIONS}
                onResult={handleResult}
              />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BattleScreen;
