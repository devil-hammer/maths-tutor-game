import { missionMap, missions, operations } from "@/lib/content";
import {
  ActiveSession,
  BadgeId,
  ChoiceQuestion,
  Operation,
  PlayerProfile,
  SessionAnswer,
  SessionSummary,
  SkillMap,
  SkillProgress,
} from "@/lib/types";
import { clamp, getTodayStamp } from "@/lib/utils";

function createEmptySkill(operation: Operation): SkillProgress {
  return {
    operation,
    totalAnswered: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    highestDifficulty: 1,
    lastPlayedAt: null,
  };
}

export function createDefaultSkills(): SkillMap {
  return {
    addition: createEmptySkill("addition"),
    subtraction: createEmptySkill("subtraction"),
    multiplication: createEmptySkill("multiplication"),
    division: createEmptySkill("division"),
  };
}

export function createDefaultProfile(playerName = "Maths Explorer"): PlayerProfile {
  return {
    playerName,
    level: 1,
    xp: 0,
    coins: 0,
    stars: 0,
    streakDays: 0,
    bestStreakDays: 0,
    sessionsCompleted: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    badges: [],
    lastPlayedDate: null,
    ownedMascots: ["nova"],
    activeMascotId: "nova",
    ownedNovaItems: ["mane-classic", "horn-moonbeam", "accessory-none", "trail-none"],
    equippedNovaItems: {
      mane: "mane-classic",
      horn: "horn-moonbeam",
      accessory: "accessory-none",
      trail: "trail-none",
    },
    ownedOrbitItems: [
      "wings-feather",
      "horns-stardust",
      "orbit-accessory-none",
      "orbit-trail-none",
    ],
    equippedOrbitItems: {
      wings: "wings-feather",
      horns: "horns-stardust",
      accessory: "orbit-accessory-none",
      trail: "orbit-trail-none",
    },
  };
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildChoices(answer: number, difficulty: number) {
  const offsetBase = difficulty === 1 ? 2 : difficulty === 2 ? 5 : 9;
  const choiceSet = new Set<number>([answer]);

  while (choiceSet.size < 4) {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const offset = offsetBase + Math.floor(Math.random() * (offsetBase + 2));
    const candidate = Math.max(0, answer + direction * offset);

    if (candidate !== answer) {
      choiceSet.add(candidate);
    }
  }

  return shuffle([...choiceSet]);
}

function getBaseDifficulty(operation: Operation, skills: SkillMap) {
  const skill = skills[operation];

  if (skill.totalAnswered < 8) {
    return 1;
  }

  const accuracy = skill.totalCorrect / Math.max(skill.totalAnswered, 1);

  if (accuracy > 0.84 && skill.highestDifficulty >= 2) {
    return 3;
  }

  if (accuracy > 0.64) {
    return 2;
  }

  return 1;
}

function getAdaptiveDifficulty(
  operation: Operation,
  skills: SkillMap,
  answers: SessionAnswer[],
) {
  const baseDifficulty = getBaseDifficulty(operation, skills);
  const recentAnswers = answers.slice(-3);

  if (
    recentAnswers.length === 3 &&
    recentAnswers.every((answer) => answer.isCorrect) &&
    recentAnswers.every((answer) => answer.responseTimeMs < 5500)
  ) {
    return clamp(baseDifficulty + 1, 1, 3);
  }

  const recentWrongAnswers = answers.slice(-2).filter((answer) => !answer.isCorrect).length;

  if (recentWrongAnswers >= 2) {
    return clamp(baseDifficulty - 1, 1, 3);
  }

  return baseDifficulty;
}

function generateAdditionQuestion(difficulty: number): ChoiceQuestion {
  const max = difficulty === 1 ? 20 : difficulty === 2 ? 60 : 150;
  const a = 1 + Math.floor(Math.random() * max);
  const b = 1 + Math.floor(Math.random() * max);
  const answer = a + b;

  return {
    id: crypto.randomUUID(),
    operation: "addition",
    difficulty,
    prompt: `${a} + ${b} = ?`,
    answer,
    choices: buildChoices(answer, difficulty),
  };
}

function generateSubtractionQuestion(difficulty: number): ChoiceQuestion {
  const max = difficulty === 1 ? 20 : difficulty === 2 ? 60 : 150;
  const a = Math.floor(Math.random() * max) + max;
  const b = Math.floor(Math.random() * max);
  const answer = a - b;

  return {
    id: crypto.randomUUID(),
    operation: "subtraction",
    difficulty,
    prompt: `${a} - ${b} = ?`,
    answer,
    choices: buildChoices(answer, difficulty),
  };
}

function generateMultiplicationQuestion(difficulty: number): ChoiceQuestion {
  const max = difficulty === 1 ? 5 : difficulty === 2 ? 9 : 12;
  const a = 2 + Math.floor(Math.random() * (max - 1));
  const b = 2 + Math.floor(Math.random() * (max - 1));
  const answer = a * b;

  return {
    id: crypto.randomUUID(),
    operation: "multiplication",
    difficulty,
    prompt: `${a} x ${b} = ?`,
    answer,
    choices: buildChoices(answer, difficulty),
  };
}

function generateDivisionQuestion(difficulty: number): ChoiceQuestion {
  const max = difficulty === 1 ? 5 : difficulty === 2 ? 9 : 12;
  const divisor = 2 + Math.floor(Math.random() * (max - 1));
  const quotient = 2 + Math.floor(Math.random() * (max - 1));
  const dividend = divisor * quotient;

  return {
    id: crypto.randomUUID(),
    operation: "division",
    difficulty,
    prompt: `${dividend} ÷ ${divisor} = ?`,
    answer: quotient,
    choices: buildChoices(quotient, difficulty),
  };
}

function generateQuestion(operation: Operation, difficulty: number) {
  switch (operation) {
    case "addition":
      return generateAdditionQuestion(difficulty);
    case "subtraction":
      return generateSubtractionQuestion(difficulty);
    case "multiplication":
      return generateMultiplicationQuestion(difficulty);
    case "division":
      return generateDivisionQuestion(difficulty);
    default:
      return generateAdditionQuestion(difficulty);
  }
}

function pickOperation(missionId: string, skills: SkillMap) {
  const mission = missionMap[missionId];

  if (!mission) {
    return "addition" as Operation;
  }

  if (mission.operations.length === 1) {
    return mission.operations[0];
  }

  const weakestOperation = [...mission.operations].sort((left, right) => {
    const leftSkill = skills[left];
    const rightSkill = skills[right];
    const leftAccuracy = leftSkill.totalCorrect / Math.max(leftSkill.totalAnswered, 1);
    const rightAccuracy = rightSkill.totalCorrect / Math.max(rightSkill.totalAnswered, 1);

    return leftAccuracy - rightAccuracy;
  })[0];

  return Math.random() > 0.45 ? weakestOperation : randomFrom(mission.operations);
}

function generateQuestionForMission(missionId: string, skills: SkillMap, answers: SessionAnswer[]) {
  const operation = pickOperation(missionId, skills);
  const difficulty = getAdaptiveDifficulty(operation, skills, answers);

  return generateQuestion(operation, difficulty);
}

export function startMissionSession(missionId: string, skills: SkillMap): ActiveSession {
  const mission = missionMap[missionId];
  const firstQuestion = generateQuestionForMission(missionId, skills, []);

  return {
    missionId,
    goalCount: mission.questionCount,
    startedAt: Date.now(),
    currentQuestionIndex: 0,
    questions: [firstQuestion],
    answers: [],
  };
}

export function applyAnswerToSession(
  session: ActiveSession,
  selectedAnswer: number,
  responseTimeMs: number,
  skills: SkillMap,
) {
  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCorrect = currentQuestion.answer === selectedAnswer;
  const answer: SessionAnswer = {
    questionId: currentQuestion.id,
    selectedAnswer,
    isCorrect,
    responseTimeMs,
    operation: currentQuestion.operation,
    difficulty: currentQuestion.difficulty,
  };
  const nextAnswers = [...session.answers, answer];

  if (nextAnswers.length >= session.goalCount) {
    return {
      session: {
        ...session,
        answers: nextAnswers,
      },
      completed: true,
    };
  }

  const nextQuestion = generateQuestionForMission(session.missionId, skills, nextAnswers);

  return {
    session: {
      ...session,
      answers: nextAnswers,
      currentQuestionIndex: session.currentQuestionIndex + 1,
      questions: [...session.questions, nextQuestion],
    },
    completed: false,
  };
}

function getStars(accuracy: number) {
  if (accuracy >= 95) {
    return 3;
  }

  if (accuracy >= 75) {
    return 2;
  }

  return 1;
}

function getMissionRecommendation(missionId: string, accuracy: number) {
  const currentIndex = missions.findIndex((mission) => mission.id === missionId);

  if (accuracy >= 85 && currentIndex >= 0 && currentIndex < missions.length - 1) {
    return missions[currentIndex + 1].id;
  }

  return missionId === "mixed-challenge" ? "times-table-quest" : "mixed-challenge";
}

function updateSkills(skills: SkillMap, answers: SessionAnswer[]) {
  const nextSkills: SkillMap = {
    addition: { ...skills.addition },
    subtraction: { ...skills.subtraction },
    multiplication: { ...skills.multiplication },
    division: { ...skills.division },
  };

  for (const answer of answers) {
    const nextSkill = { ...nextSkills[answer.operation] };
    nextSkill.totalAnswered += 1;
    nextSkill.totalCorrect += answer.isCorrect ? 1 : 0;
    nextSkill.currentStreak = answer.isCorrect ? nextSkill.currentStreak + 1 : 0;
    nextSkill.bestStreak = Math.max(nextSkill.bestStreak, nextSkill.currentStreak);
    nextSkill.highestDifficulty = Math.max(nextSkill.highestDifficulty, answer.difficulty);
    nextSkill.lastPlayedAt = new Date().toISOString();
    nextSkills[answer.operation] = nextSkill;
  }

  return nextSkills;
}

function getLevelFromXp(xp: number) {
  return Math.floor(xp / 120) + 1;
}

function addBadges(profile: PlayerProfile, summary: SessionSummary, lastPlayedDate: string | null) {
  const earned = new Set<BadgeId>(profile.badges);

  if (profile.sessionsCompleted + 1 >= 1) {
    earned.add("first-flight");
  }

  if (summary.correctCount === summary.totalQuestions) {
    earned.add("perfect-pilot");
  }

  const mission = missionMap[summary.missionId];
  if (summary.averageResponseTimeMs * summary.totalQuestions <= mission.targetTimeMs) {
    earned.add("speedy-solver");
  }

  const today = getTodayStamp();
  const yesterday = new Date(`${today}T00:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStamp = yesterday.toISOString().slice(0, 10);

  const nextStreak =
    lastPlayedDate === today
      ? profile.streakDays
      : lastPlayedDate === yesterdayStamp
        ? profile.streakDays + 1
        : 1;

  if (nextStreak >= 3) {
    earned.add("streak-starter");
  }

  if (getLevelFromXp(profile.xp + summary.xpEarned) >= 5) {
    earned.add("number-ninja");
  }

  return [...earned];
}

export function finalizeSession(
  session: ActiveSession,
  profile: PlayerProfile,
  skills: SkillMap,
) {
  const correctCount = session.answers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = session.answers.length;
  const accuracy = (correctCount / Math.max(totalQuestions, 1)) * 100;
  const averageResponseTimeMs =
    session.answers.reduce((total, answer) => total + answer.responseTimeMs, 0) /
    Math.max(totalQuestions, 1);
  const starsEarned = getStars(accuracy);
  const speedBonus = averageResponseTimeMs < 5000 ? 20 : averageResponseTimeMs < 7500 ? 10 : 0;
  const xpEarned = correctCount * 15 + starsEarned * 10 + speedBonus;
  const coinsEarned = starsEarned * 20 + correctCount * 2;
  const completedAt = new Date().toISOString();
  const todayStamp = completedAt.slice(0, 10);
  const previousDay = new Date(`${todayStamp}T00:00:00`);
  previousDay.setDate(previousDay.getDate() - 1);
  const previousDayStamp = previousDay.toISOString().slice(0, 10);
  const nextStreakDays =
    profile.lastPlayedDate === todayStamp
      ? profile.streakDays
      : profile.lastPlayedDate === previousDayStamp
        ? profile.streakDays + 1
        : 1;

  const summary: SessionSummary = {
    missionId: session.missionId,
    correctCount,
    totalQuestions,
    accuracy,
    averageResponseTimeMs,
    starsEarned,
    coinsEarned,
    xpEarned,
    badgesUnlocked: [],
    recommendedMissionId: getMissionRecommendation(session.missionId, accuracy),
    completedAt,
  };

  const nextSkills = updateSkills(skills, session.answers);
  const nextProfile: PlayerProfile = {
    ...profile,
    xp: profile.xp + xpEarned,
    level: getLevelFromXp(profile.xp + xpEarned),
    coins: profile.coins + coinsEarned,
    stars: profile.stars + starsEarned,
    sessionsCompleted: profile.sessionsCompleted + 1,
    totalQuestions: profile.totalQuestions + totalQuestions,
    totalCorrect: profile.totalCorrect + correctCount,
    streakDays: nextStreakDays,
    bestStreakDays: Math.max(profile.bestStreakDays, nextStreakDays),
    lastPlayedDate: todayStamp,
    badges: profile.badges,
    ownedMascots: profile.ownedMascots,
    activeMascotId: profile.activeMascotId,
    ownedOrbitItems: profile.ownedOrbitItems,
    equippedOrbitItems: profile.equippedOrbitItems,
  };
  if (nextProfile.stars >= 25 && !nextProfile.ownedMascots.includes("orbit")) {
    nextProfile.ownedMascots = [...nextProfile.ownedMascots, "orbit"];
  }
  const nextBadges = addBadges(profile, summary, profile.lastPlayedDate);
  const badgesUnlocked = nextBadges.filter((badgeId) => !profile.badges.includes(badgeId));

  nextProfile.badges = nextBadges;
  summary.badgesUnlocked = badgesUnlocked;

  return {
    profile: nextProfile,
    skills: nextSkills,
    summary,
  };
}

export function getOverallAccuracy(profile: PlayerProfile) {
  if (profile.totalQuestions === 0) {
    return 0;
  }

  return (profile.totalCorrect / profile.totalQuestions) * 100;
}

export function getLevelProgress(profile: PlayerProfile) {
  const currentLevelXp = (profile.level - 1) * 120;
  const nextLevelXp = profile.level * 120;
  const progress = ((profile.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return clamp(progress, 0, 100);
}

export function getMastery(skill: SkillProgress) {
  if (skill.totalAnswered === 0) {
    return 0;
  }

  return (skill.totalCorrect / skill.totalAnswered) * 100;
}

export function getSkillOrder() {
  return operations;
}
