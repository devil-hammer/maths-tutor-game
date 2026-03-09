import { BadgeDefinition, MissionDefinition, NovaCosmeticSlot, NovaShopItem, Operation } from "@/lib/types";

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

export const novaSlotLabels: Record<NovaCosmeticSlot, string> = {
  mane: "Mane",
  horn: "Horn",
  accessory: "Accessory",
  trail: "Trail",
};

export const novaShopItems: NovaShopItem[] = [
  {
    id: "mane-classic",
    slot: "mane",
    title: "Classic Mane",
    description: "Nova's original soft lilac swirl.",
    preview: "Classic",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "mane-rainbow",
    slot: "mane",
    title: "Rainbow Mane",
    description: "A bright rainbow streak for extra confidence.",
    preview: "Rainbow",
    costCoins: 120,
    requiredStars: 6,
  },
  {
    id: "mane-comet",
    slot: "mane",
    title: "Comet Mane",
    description: "A night-sky mane with comet glow highlights.",
    preview: "Comet",
    costCoins: 180,
    requiredStars: 12,
  },
  {
    id: "horn-moonbeam",
    slot: "horn",
    title: "Moonbeam Horn",
    description: "Nova's default shimmering moonbeam horn.",
    preview: "Moonbeam",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "horn-crystal",
    slot: "horn",
    title: "Crystal Horn",
    description: "A cool crystal horn with icy shine.",
    preview: "Crystal",
    costCoins: 140,
    requiredStars: 8,
  },
  {
    id: "horn-sunbeam",
    slot: "horn",
    title: "Sunbeam Horn",
    description: "A golden horn for your brightest missions.",
    preview: "Sunbeam",
    costCoins: 220,
    requiredStars: 15,
  },
  {
    id: "accessory-none",
    slot: "accessory",
    title: "No Accessory",
    description: "Keep Nova's look simple and clean.",
    preview: "None",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "accessory-crown",
    slot: "accessory",
    title: "Moon Crown",
    description: "A tiny crown fit for a maths champion.",
    preview: "Crown",
    costCoins: 160,
    requiredStars: 10,
  },
  {
    id: "accessory-glasses",
    slot: "accessory",
    title: "Star Glasses",
    description: "Playful star-shaped glasses for study style.",
    preview: "Glasses",
    costCoins: 150,
    requiredStars: 9,
  },
  {
    id: "trail-none",
    slot: "trail",
    title: "No Trail",
    description: "Float along with Nova's natural glow only.",
    preview: "None",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "trail-stardust",
    slot: "trail",
    title: "Stardust Trail",
    description: "A sparkly trail that swirls behind Nova.",
    preview: "Stardust",
    costCoins: 130,
    requiredStars: 7,
  },
  {
    id: "trail-cloud",
    slot: "trail",
    title: "Cloud Puff Trail",
    description: "Little dreamy clouds float along with Nova.",
    preview: "Cloud",
    costCoins: 170,
    requiredStars: 11,
  },
];

export const novaShopItemMap = Object.fromEntries(
  novaShopItems.map((item) => [item.id, item]),
) as Record<NovaShopItem["id"], NovaShopItem>;
