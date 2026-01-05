export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  user_id: string;
  date: string;
  category: string;
  difficulty: string;
  prompt: string;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
};

export type Stats = {
  user_id: string;
  xp: number;
  streak: number;
  best_streak: number;
  updated_at: string;
};
