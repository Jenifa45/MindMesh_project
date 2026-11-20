
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
} from "@/lib/api";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await getProjects();
      setProjects(result);
     } catch (err) {
    const message = err instanceof Error ? err.message : "";

    if (
      message.toLowerCase().includes("failed to fetch") ||
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("networkerror")
    ) {
      setError(
        "Unable to connect to the server. Please check your connection and try again."
      );
    } else {
      setError(
        message || "Unable to load projects. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
  let active = true;

  async function initialize() {
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (!active) return;

      if (authError || !session) {
        router.replace("/login");
        return;
      }

      await loadProjects();
    } catch {
      if (active) {
        setError(
          "Unable to verify your session. Please refresh the page and try again."
        );
        setLoading(false);
      }
    }
  }

  void initialize();

  return () => {
    active = false;
  };
}, [loadProjects, router]);
  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const cleanTitle = title.trim();

    if (!cleanTitle || cleanTitle.length > 150) {
      setError("Title must contain 1–150 characters.");
      return;
    }

    if (description.length > 2000) {
      setError("Description must not exceed 2000 characters.");
      return;
    }

    setSaving(true);

    try {
      const data = {
        title: cleanTitle,
        description: description.trim() || null,
      };

      if (editingId) {
        await updateProject(editingId, data);
      } else {
        await createProject(data);
      }

      resetForm();
      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save project"
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setDeletingId(id);
    setError("");

    try {
      await deleteProject(id);
      await loadProjects();

      if (editingId === id) resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete project"
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                M
              </div>
              <span className="text-lg font-bold tracking-tight">
                MindMesh
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Page Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              My Projects
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Organize your ideas and manage your work in one place.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-medium text-slate-500">
              Total Projects
            </p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {loading ? "—" : projects.length}
            </p>
          </div>
        </div>

        {/* Form */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update your project details below."
                : "Start something new by adding your project details."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label
                htmlFor="project-title"
                className="mb-2 block text-sm font-medium"
              >
                Project Title
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Awesome Project"
                maxLength={150}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between gap-3">
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium"
                >
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <span className="text-xs text-slate-400">
                  {description.length}/2000
                </span>
              </div>

              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your project..."
                maxLength={2000}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "+ Create Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Projects */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Your Projects
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {projects.length} Projects
            </span>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-200/60"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                ✦
              </div>
              <h3 className="text-lg font-semibold">
                No projects yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                Your workspace is ready. Create your first project to
                get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                      {project.title.charAt(0).toUpperCase()}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Project
                    </span>
                  </div>

                  <h3 className="wrap-break-word text-base font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 min-h-15 whitespace-pre-wrap wrap-break-word text-sm leading-5 text-slate-500">
                    {project.description || "No description added."}
                  </p>

                  <div className="mt-auto pt-6">
                    <p className="mb-4 text-xs text-slate-400">
                      Created{" "}
                      {new Date(project.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <div className="flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        onClick={() => startEditing(project)}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => void handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="flex-1 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === project.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                      <button
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                        >
                          View Details
                        </button>

                      
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          MindMesh Workspace · Project Management
        </footer>
      </div>
    </main>
  );
}
