export type Operation = "addition" | "subtraction" | "multiplication" | "division";
export type MascotMood = "idle" | "encourage" | "support" | "celebrate";

export type BadgeId =
  | "first-flight"
  | "perfect-pilot"
  | "speedy-solver"
  | "streak-starter"
  | "number-ninja";

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  theme: string;
  emoji: string;
  operations: Operation[];
  questionCount: number;
  targetTimeMs: number;
}

export interface BadgeDefinition {
  id: BadgeId;
  title: string;
  description: string;
}

export interface ChoiceQuestion {
  id: string;
  operation: Operation;
  difficulty: number;
  prompt: string;
  answer: number;
  choices: number[];
}

export interface SessionAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTimeMs: number;
  operation: Operation;
  difficulty: number;
}

export interface ActiveSession {
  missionId: string;
  goalCount: number;
  startedAt: number;
  currentQuestionIndex: number;
  questions: ChoiceQuestion[];
  answers: SessionAnswer[];
}

export interface SessionSummary {
  missionId: string;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  averageResponseTimeMs: number;
  starsEarned: number;
  coinsEarned: number;
  xpEarned: number;
  badgesUnlocked: BadgeId[];
  recommendedMissionId: string;
  completedAt: string;
}

export interface SkillProgress {
  operation: Operation;
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  highestDifficulty: number;
  lastPlayedAt: string | null;
}

export interface PlayerProfile {
  playerName: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  streakDays: number;
  bestStreakDays: number;
  sessionsCompleted: number;
  totalQuestions: number;
  totalCorrect: number;
  badges: BadgeId[];
  lastPlayedDate: string | null;
}

export interface AppSettings {
  soundEnabled: boolean;
}

export type SkillMap = Record<Operation, SkillProgress>;
