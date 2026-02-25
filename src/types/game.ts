import { Avatar } from "@/data/avatars";

export interface Player {
  name: string;
  avatar: Avatar;
  health: number;
  score: number;
}

export type GamePhase = "setup" | "battle" | "result";

export interface GameState {
  phase: GamePhase;
  player1: Player | null;
  player2: Player | null;
  currentQuestion: number;
  currentTurn: 1 | 2;
  totalQuestions: number;
}
