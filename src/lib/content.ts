import { BadgeDefinition, MissionDefinition, Operation } from "@/lib/types";

export const operations: Operation[] = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];

export const missions: MissionDefinition[] = [
  {
    id: "addition-sprint",
    title: "Addition Sprint",
    description: "Zoom through fast sums and build confidence with every answer.",
    theme: "Rainbow Rockets",
    emoji: "🚀",
    operations: ["addition"],
    questionCount: 8,
    targetTimeMs: 45000,
  },
  {
    id: "subtraction-safari",
    title: "Subtraction Safari",
    description: "Track down missing numbers on a jungle adventure.",
    theme: "Jungle Safari",
    emoji: "🦁",
    operations: ["subtraction"],
    questionCount: 8,
    targetTimeMs: 50000,
  },
  {
    id: "times-table-quest",
    title: "Times Table Quest",
    description: "Power up with tables practice and level up your multiplication.",
    theme: "Castle Quest",
    emoji: "🏰",
    operations: ["multiplication", "division"],
    questionCount: 8,
    targetTimeMs: 55000,
  },
  {
    id: "mixed-challenge",
    title: "Mixed Challenge",
    description: "Mix all four skills into one brave brain-training mission.",
    theme: "Treasure Trail",
    emoji: "🧭",
    operations,
    questionCount: 10,
    targetTimeMs: 65000,
  },
];

export const badges: BadgeDefinition[] = [
  {
    id: "first-flight",
    title: "First Flight",
    description: "Finish your very first mission.",
  },
  {
    id: "perfect-pilot",
    title: "Perfect Pilot",
    description: "Get every question right in one mission.",
  },
  {
    id: "speedy-solver",
    title: "Speedy Solver",
    description: "Finish a mission faster than the target time.",
  },
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Play on three different days in a row.",
  },
  {
    id: "number-ninja",
    title: "Number Ninja",
    description: "Reach level 5 and show your maths mastery.",
  },
];

export const missionMap = Object.fromEntries(
  missions.map((mission) => [mission.id, mission]),
) as Record<string, MissionDefinition>;

export const operationLabels: Record<Operation, string> = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
};
