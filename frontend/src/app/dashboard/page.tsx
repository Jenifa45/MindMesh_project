"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { apiFetch } from "@/lib/api";

const supabase = createClient();

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");

      // Get JWT access token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("JWT TOKEN:", session?.access_token);

      // Send JWT token to FastAPI
      const response = await apiFetch("/me");

      if (!response.ok) {
        console.error("FastAPI authentication failed:", response.status);
        return;
      }

      const data = await response.json();

      console.log("FastAPI response:", data);
    }

    getUser();
  }, [router]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc]">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <span className="font-bold">M</span>
            </div>

            <span className="text-xl font-bold text-slate-900">
              MindMesh
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Welcome back
              </p>

              <p className="text-xs text-slate-500">
                {email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Workspace
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Good to see you again.
          </h1>

          <p className="mt-3 text-slate-500">
            Everything you need to move your best work forward.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
              🧠
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Projects
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Organize and manage your collaborative projects.
            </p>

            <button 
              onClick={() => router.push('/projects')}
              className="mt-5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View projects →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
              📄
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Documents
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your important workspace documents together.
            </p>

            <button className="mt-5 text-sm font-bold text-indigo-600 hover:text-indigo-700">
              View documents →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✨
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              AI Teammates
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Work smarter with AI teammates inside your workspace.
            </p>

            <button className="mt-5 text-sm font-bold text-indigo-600 hover:text-indigo-700">
              Explore AI →
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="mt-8 rounded-2xl bg-[#10142d] p-8 text-white shadow-xl">
          <p className="text-sm font-semibold text-indigo-300">
            YOUR SPACE TO THINK TOGETHER
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Big ideas work better together.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Start a project, upload a document, or invite your teammates to
            begin collaborating.
          </p>

          <button 
            onClick={() => router.push('/projects')}
            className="mt-6 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
          >
            Create your first project
          </button>
        </div>
      </section>
    </main>
  );
}