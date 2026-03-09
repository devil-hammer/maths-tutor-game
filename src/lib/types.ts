export type Operation = "addition" | "subtraction" | "multiplication" | "division";
export type MascotMood = "idle" | "encourage" | "support" | "celebrate";

export type BadgeId =
  | "first-flight"
  | "perfect-pilot"
  | "speedy-solver"
  | "streak-starter"
  | "number-ninja";

export type MascotId = "nova" | "orbit";

export interface MascotDefinition {
  id: MascotId;
  name: string;
  description: string;
  requiredStars: number;
}

export type NovaCosmeticSlot = "mane" | "horn" | "accessory" | "trail";

export type NovaItemId =
  | "mane-classic"
  | "mane-rainbow"
  | "mane-comet"
  | "horn-moonbeam"
  | "horn-crystal"
  | "horn-sunbeam"
  | "accessory-none"
  | "accessory-crown"
  | "accessory-glasses"
  | "trail-none"
  | "trail-stardust"
  | "trail-cloud";

export interface NovaLoadout {
  mane: NovaItemId;
  horn: NovaItemId;
  accessory: NovaItemId;
  trail: NovaItemId;
}

export interface NovaShopItem {
  id: NovaItemId;
  slot: NovaCosmeticSlot;
  title: string;
  description: string;
  preview: string;
  costCoins: number;
  requiredStars: number;
}

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
  ownedMascots: MascotId[];
  activeMascotId: MascotId;
  ownedNovaItems: NovaItemId[];
  equippedNovaItems: NovaLoadout;
}

export interface AppSettings {
  soundEnabled: boolean;
}

export type SkillMap = Record<Operation, SkillProgress>;

export interface PersistedPlayerState {
  profile: PlayerProfile;
  skills: SkillMap;
  settings: AppSettings;
  activeSession: ActiveSession | null;
}

export interface AuthUser {
  id: string;
  username: string;
  createdAt: string;
}
