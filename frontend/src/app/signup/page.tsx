"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

const supabase = createClient();

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!data.session) {
      setMessage(
        "Account created. Please check your email and confirm your account."
      );
      return;
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">

      {/* LEFT */}
      <section className="relative hidden overflow-hidden bg-[#10142d] lg:flex flex-col justify-between px-16 py-14 text-white">

        <div className="absolute -right-40 -top-40 h-500px w-500px rounded-full border border-white/10" />

        {/* Logo */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-400 text-[#10142d]">
            <span className="text-xl font-black">M</span>
          </div>

          <span className="text-xl font-bold">
            MindMesh
          </span>
        </div>

        {/* Content */}
        <div className="relative max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            YOUR SPACE TO THINK TOGETHER
          </div>

          <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Build ideas
            <br />
            <span className="text-indigo-400">
              together.
            </span>
          </h2>

          <p className="mt-8 max-w-lg text-lg leading-8 text-slate-400">
            Create a collaborative workspace for your projects,
            documents, and AI teammates.
          </p>
        </div>

        <p className="relative text-sm text-slate-500">
          A clearer way to move your best work forward.
        </p>
      </section>

      {/* RIGHT */}
      <section className="flex items-center justify-center bg-[#f8f9fc] px-6 py-12 sm:px-12 lg:px-16">

        <div className="w-full max-w-md">

          <div className="mb-8">
            <p className="mb-3 text-sm font-bold tracking-wide text-indigo-600">
              GET STARTED
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Create an account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Join MindMesh and start building better ideas together.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={6}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              <span className="text-xs leading-5 text-slate-500">
                I agree to the{" "}
                <span className="font-semibold text-indigo-600">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-indigo-600">
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </button>
          </p>

        </div>
      </section>
    </main>
  );
}