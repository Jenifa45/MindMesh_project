"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

   return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">

      {/* LEFT SIDE */}
      <section className="relative hidden overflow-hidden bg-[#10142d] lg:flex flex-col justify-between px-16 py-14 text-white">

        {/* Decorative circles */}
        <div className="absolute -right-40 -top-40 h-500px w-500px rounded-full border border-white/10" />
        <div className="absolute right-20 -top-20 h-350px w-350px rounded-full border border-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-400 text-[#10142d]">
            <span className="text-xl font-black">M</span>
          </div>

          <span className="text-xl font-bold tracking-tight">
            MindMesh
          </span>
        </div>

        {/* Hero */}
        <div className="relative max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            YOUR SPACE TO THINK TOGETHER
          </div>

          <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Big ideas work
            <br />
            better{" "}
            <span className="text-indigo-400">
              together.
            </span>
          </h2>

          <p className="mt-8 max-w-lg text-lg leading-8 text-slate-400">
            Bring your projects, documents, and AI teammates
            into one collaborative workspace.
          </p>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between">
          <p className="text-sm text-slate-500">
           A clearer way to move your best work forward.
          </p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-xs">
            N
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex items-center justify-center bg-[#f8f9fc] px-6 py-12 sm:px-12 lg:px-16">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-10">
            <p className="mb-3 text-sm font-bold tracking-wide text-indigo-600">
              WELCOME BACK
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to pick up where you left off.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              <span className="text-sm text-slate-600">
                Remember me
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Signup */}
          <p className="mt-10 text-center text-sm text-slate-500">
            New to MindMesh?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </button>
          </p>
            
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="group flex w-full items-center justify-center gap-3
                rounded-xl border border-slate-200 bg-white px-5 py-3.5
                text-sm font-semibold text-slate-700
                shadow-sm transition-all duration-200
                hover:-translate-y-0.5 hover:border-slate-300
                hover:bg-slate-50 hover:shadow-md
                focus:outline-none focus:ring-4 focus:ring-blue-100
                active:translate-y-0"
            >
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.73 13.72 17.9 9.5 24 9.5Z" transform="translate(0 4)"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.86 46.98 24.55Z" transform="translate(0 0)"/>
                <path fill="#FBBC05" d="M10.03 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 4)"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.1 0-11.27-4.22-12.97-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -4)"/>
              </svg>

              <span>Continue with Google</span>

              <svg
                className="ml-auto h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


// 'use client'
// import { createClient } from '@/utils/supabase/client'
// export default function LoginPage() {
//   const supabase = createClient()
//   const signIn = () => supabase.auth.signInWithOAuth({
//     provider: 'github',
//     options: { redirectTo: `${window.location.origin}/auth/callback` },
//   })
//   return (
//     <main className="grid min-h-screen place-items-center">
//       <button onClick={signIn} className="rounded-lg bg-slate-900 px-5 py-3 text-white">
//         Continue with GitHub
//       </button>
//     </main>
//   )
// }

