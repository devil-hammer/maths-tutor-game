"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface AuthPageProps {
  mode: "login" | "signup";
  configured: boolean;
}

export function AuthPage({ mode, configured }: AuthPageProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Authentication failed.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ede9fe,_#ddd6fe_30%,_#dbeafe_68%,_#ffffff)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2.5rem] border-4 border-white bg-white/90 p-8 shadow-[0_18px_60px_rgba(124,58,237,0.16)]">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-500">Maths Tutor Quest</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">
          {isSignup ? "Create a player login" : "Log in to play"}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {isSignup
            ? "Create a separate username and password for each child so their progress stays private."
            : "Choose your username and password to load your saved progress."}
        </p>

        {!configured ? (
          <div className="mt-6 rounded-[1.75rem] border-2 border-violet-200 bg-violet-50 p-5 text-sm leading-7 text-violet-900">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your environment before using accounts.
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-[1.25rem] border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-400"
              placeholder="e.g. daisy_math"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-[1.25rem] border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-400"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />
          </label>

          {isSignup ? (
            <label className="block">
              <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Confirm Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-[1.25rem] border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                autoComplete="new-password"
                required
              />
            </label>
          ) : null}

          {errorMessage ? (
            <div className="rounded-[1.25rem] border-2 border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !configured}
            className="w-full rounded-full bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? isSignup
                ? "Creating Account..."
                : "Logging In..."
              : isSignup
                ? "Create Account"
                : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-sm font-semibold text-slate-600">
          {isSignup ? "Already have an account?" : "Need a new account?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} className="text-sky-600 underline decoration-2 underline-offset-4">
            {isSignup ? "Log in" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
