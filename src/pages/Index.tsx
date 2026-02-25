import { useState } from "react";
import { Player, GamePhase } from "@/types/game";
import { Question } from "@/data/questions";
import SetupScreen from "@/components/game/SetupScreen";
import BattleScreen from "@/components/game/BattleScreen";
import ResultScreen from "@/components/game/ResultScreen";

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [customQuestions, setCustomQuestions] = useState<Question[] | undefined>();

  const handleStartGame = (p1: Player, p2: Player, questions?: Question[]) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setCustomQuestions(questions);
    setPhase("battle");
  };

  const handleGameEnd = (p1: Player, p2: Player) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setPhase("result");
  };

  const handlePlayAgain = () => {
    setPlayer1(null);
    setPlayer2(null);
    setPhase("setup");
  };

  return (
    <>
      {phase === "setup" && <SetupScreen onStartGame={handleStartGame} />}
      {phase === "battle" && player1 && player2 && (
        <BattleScreen player1={player1} player2={player2} onGameEnd={handleGameEnd} customQuestions={customQuestions} />
      )}
      {phase === "result" && player1 && player2 && (
        <ResultScreen player1={player1} player2={player2} onPlayAgain={handlePlayAgain} />
      )}
    </>
  );
};

export default Index;
