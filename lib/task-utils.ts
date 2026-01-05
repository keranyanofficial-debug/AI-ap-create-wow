import type { Difficulty } from "@/lib/task-generator";

export function xpForDifficulty(difficulty: Difficulty) {
  switch (difficulty) {
    case "EASY":
      return 10;
    case "NORMAL":
      return 20;
    case "HARD":
      return 35;
    default:
      return 10;
  }
}
