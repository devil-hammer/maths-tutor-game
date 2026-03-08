"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { QuestionCard } from "@/components/ui/question-card";
import { ResultsPanel } from "@/components/ui/results-panel";
import { usePlayerStore } from "@/features/profile/player-store";
import { playSoundEffect } from "@/lib/sound-effects";
import { ChoiceQuestion } from "@/lib/types";
import { missionMap } from "@/lib/content";

export function PlayPageClient() {
  const searchParams = useSearchParams();
  const missionId = searchParams.get("mission") ?? "";
  const mission = missionMap[missionId];
  const activeSession = usePlayerStore((state) => state.activeSession);
  const lastSummary = usePlayerStore((state) => state.lastSummary);
  const startMission = usePlayerStore((state) => state.startMission);
  const clearSummary = usePlayerStore((state) => state.clearSummary);
  const setMascotMood = usePlayerStore((state) => state.setMascotMood);
  const soundEnabled = usePlayerStore((state) => state.settings.soundEnabled);

  useEffect(() => {
    if (!mission) {
      return;
    }

    if (lastSummary?.missionId === mission.id) {
      return;
    }

    if (!activeSession || activeSession.missionId !== mission.id) {
      startMission(mission.id);
    }
  }, [activeSession, lastSummary?.missionId, mission, startMission]);

  const currentQuestion = useMemo(() => {
    if (!activeSession) {
      return null;
    }

    return activeSession.questions[activeSession.currentQuestionIndex] ?? null;
  }, [activeSession]);

  if (!mission) {
    return (
      <div className="rounded-[2rem] bg-white/90 p-8 text-center shadow-xl">
        <h2 className="text-3xl font-black text-slate-900">Pick a mission first</h2>
        <p className="mt-3 text-slate-600">Choose one from the home screen to start your practice adventure.</p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-black text-white"
        >
          Back Home
        </Link>
      </div>
    );
  }

  if (!activeSession && lastSummary?.missionId === mission.id) {
    return <ResultsPanel summary={lastSummary} />;
  }

  if (!activeSession || !currentQuestion) {
    return (
      <div className="rounded-[2rem] bg-white/90 p-8 text-center text-lg font-semibold text-slate-600 shadow-xl">
        Loading your mission...
      </div>
    );
  }

  function handleRestartMission() {
    clearSummary();
    startMission(mission.id);
    setMascotMood("encourage");
    void playSoundEffect("missionStart", soundEnabled);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <QuestionRound
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={activeSession.currentQuestionIndex + 1}
        totalQuestions={activeSession.goalCount}
      />

      <aside className="space-y-5">
        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            {mission.theme}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">{mission.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mission.description}</p>
          <div className="mt-4 rounded-[1.5rem] bg-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-600">
              Keep going. Every answer grows your brain power and unlocks more rewards.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-500">Mission Meter</p>
          <div className="mt-4 grid gap-3">
            <MetricTile
              label="Correct so far"
              value={activeSession.answers.filter((answer) => answer.isCorrect).length.toString()}
            />
            <MetricTile label="Questions left" value={(activeSession.goalCount - activeSession.answers.length).toString()} />
            <MetricTile label="Reward goal" value="Earn 2+ stars" />
          </div>
          <button
            type="button"
            onClick={handleRestartMission}
            className="mt-4 w-full rounded-full border-2 border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700"
          >
            Restart Mission
          </button>
        </section>
      </aside>
    </div>
  );
}

function QuestionRound({
  question,
  questionNumber,
  totalQuestions,
}: {
  question: ChoiceQuestion;
  questionNumber: number;
  totalQuestions: number;
}) {
  const submitAnswer = usePlayerStore((state) => state.submitAnswer);
  const setMascotMood = usePlayerStore((state) => state.setMascotMood);
  const soundEnabled = usePlayerStore((state) => state.settings.soundEnabled);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [questionStartedAt] = useState(() => Date.now());
  const responseTimeoutRef = useRef<number | null>(null);
  const moodTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        window.clearTimeout(responseTimeoutRef.current);
      }

      if (moodTimeoutRef.current) {
        window.clearTimeout(moodTimeoutRef.current);
      }
    };
  }, []);

  function handleSelectAnswer(answer: number) {
    if (feedback) {
      return;
    }

    const nextFeedback = answer === question.answer ? "correct" : "wrong";
    setSelectedAnswer(answer);
    setFeedback(nextFeedback);
    void playSoundEffect("tap", soundEnabled);

    moodTimeoutRef.current = window.setTimeout(() => {
      setMascotMood(nextFeedback === "correct" ? "encourage" : "support");
      void playSoundEffect(nextFeedback === "correct" ? "correct" : "wrong", soundEnabled);
    }, 70);

    responseTimeoutRef.current = window.setTimeout(() => {
      submitAnswer(answer, Date.now() - questionStartedAt);
      setMascotMood(null);
    }, 800);
  }

  return (
    <QuestionCard
      question={question}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={handleSelectAnswer}
      feedback={feedback}
    />
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-100 px-4 py-4">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
