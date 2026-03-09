"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { ChoiceQuestion } from "@/lib/types";

interface QuestionCardProps {
  question: ChoiceQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answer: number) => void;
  feedback: "correct" | "wrong" | null;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  feedback,
}: QuestionCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(59,130,246,0.18)]"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700">
          Level {question.difficulty}
        </span>
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { scale: 0.98, opacity: 0.9 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-violet-100 px-6 py-10 text-center"
      >
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Solve The Puzzle
        </p>
        <p className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
          {question.prompt}
        </p>
      </motion.div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.choices.map((choice) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectChoice = question.answer === choice;
          const isWrongSelected = feedback === "wrong" && isSelected;
          const isCorrectSelected = feedback === "correct" && isSelected;
          const highlightClass = isCorrectSelected
            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
            : isWrongSelected
              ? "border-rose-300 bg-rose-100 text-rose-700"
              : feedback && isCorrectChoice
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : isSelected
                  ? "border-sky-300 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-800 hover:border-violet-200 hover:bg-violet-50";

          return (
            <motion.button
              key={choice}
              type="button"
              onClick={() => onSelectAnswer(choice)}
              disabled={feedback !== null}
              whileHover={
                feedback || prefersReducedMotion ? undefined : { y: -4, scale: 1.02 }
              }
              whileTap={
                feedback || prefersReducedMotion ? undefined : { scale: 0.96 }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : isWrongSelected
                    ? { x: [0, -10, 10, -8, 8, 0] }
                    : isCorrectSelected
                      ? { scale: [1, 1.08, 0.98, 1], y: [0, -6, 0] }
                      : isSelected
                        ? { scale: [1, 1.03, 1] }
                        : undefined
              }
              transition={{ duration: isWrongSelected ? 0.4 : 0.25 }}
              className={`rounded-[1.5rem] border-4 px-4 py-5 text-2xl font-black transition ${highlightClass}`}
            >
              {choice}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={`mt-5 rounded-[1.5rem] px-4 py-3 text-center text-lg font-black ${
              feedback === "correct"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {feedback === "correct"
              ? "Brilliant! You got it right!"
              : `Nice try! The answer is ${question.answer}.`}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
