import {
  BadgeDefinition,
  MascotDefinition,
  MissionDefinition,
  NovaCosmeticSlot,
  OrbitCosmeticSlot,
  OrbitShopItem,
  NovaShopItem,
  Operation,
} from "@/lib/types";

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

export const mascots: MascotDefinition[] = [
  {
    id: "nova",
    name: "Nova",
    description: "Your bright unicorn guide from the very start.",
    requiredStars: 0,
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "A tiny star dragon who joins the team after a big milestone.",
    requiredStars: 25,
  },
];

export const mascotMap = Object.fromEntries(mascots.map((mascot) => [mascot.id, mascot])) as Record<
  MascotDefinition["id"],
  MascotDefinition
>;

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

export const orbitSlotLabels: Record<OrbitCosmeticSlot, string> = {
  wings: "Wings",
  horns: "Horns",
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

export const orbitShopItems: OrbitShopItem[] = [
  {
    id: "wings-feather",
    slot: "wings",
    title: "Feather Wings",
    description: "Orbit's default soft star-feather wings.",
    preview: "Feather",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "wings-comet",
    slot: "wings",
    title: "Comet Wings",
    description: "Fast comet-streak wings with bright sky tips.",
    preview: "Comet",
    costCoins: 140,
    requiredStars: 28,
  },
  {
    id: "wings-nebula",
    slot: "wings",
    title: "Nebula Wings",
    description: "Galaxy wings glowing with purple space dust.",
    preview: "Nebula",
    costCoins: 220,
    requiredStars: 34,
  },
  {
    id: "horns-stardust",
    slot: "horns",
    title: "Stardust Horns",
    description: "Orbit's starting pair of twinkly baby horns.",
    preview: "Stardust",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "horns-crystal",
    slot: "horns",
    title: "Crystal Horns",
    description: "Icy crystal horns for a sharper sky-dragon look.",
    preview: "Crystal",
    costCoins: 150,
    requiredStars: 30,
  },
  {
    id: "horns-sunflare",
    slot: "horns",
    title: "Sunflare Horns",
    description: "Golden dragon horns lit with warm firelight.",
    preview: "Sunflare",
    costCoins: 230,
    requiredStars: 36,
  },
  {
    id: "orbit-accessory-none",
    slot: "accessory",
    title: "No Accessory",
    description: "Keep Orbit flying light and simple.",
    preview: "None",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "orbit-accessory-cape",
    slot: "accessory",
    title: "Hero Cape",
    description: "A tiny cape for brave sky-dragon missions.",
    preview: "Cape",
    costCoins: 160,
    requiredStars: 29,
  },
  {
    id: "orbit-accessory-bandana",
    slot: "accessory",
    title: "Comet Bandana",
    description: "A playful bandana for dragon explorer style.",
    preview: "Bandana",
    costCoins: 170,
    requiredStars: 32,
  },
  {
    id: "orbit-trail-none",
    slot: "trail",
    title: "No Trail",
    description: "Let Orbit's natural glow do the talking.",
    preview: "None",
    costCoins: 0,
    requiredStars: 0,
  },
  {
    id: "orbit-trail-embers",
    slot: "trail",
    title: "Ember Trail",
    description: "Warm glowing embers swirl behind Orbit.",
    preview: "Embers",
    costCoins: 145,
    requiredStars: 27,
  },
  {
    id: "orbit-trail-moons",
    slot: "trail",
    title: "Moon Trail",
    description: "Tiny moon sparks follow every dragon swoop.",
    preview: "Moon",
    costCoins: 200,
    requiredStars: 35,
  },
];

export const orbitShopItemMap = Object.fromEntries(
  orbitShopItems.map((item) => [item.id, item]),
) as Record<OrbitShopItem["id"], OrbitShopItem>;
