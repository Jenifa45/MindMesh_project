
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import type { Project } from "@/lib/api";

const supabase = createClient();

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const { data: { session } } =
          await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setError(
            response.status === 404
              ? "Project not found or you don't have access."
              : "Unable to load project."
          );
          return;
        }

        setProject(await response.json());
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    if (id) void loadProject();
  }, [id, router]);

  if (loading) return <main className="p-8">Loading project...</main>;
  if (error) return <main className="p-8 text-red-600">{error}</main>;
  if (!project) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <button
          onClick={() => router.push("/projects")}
          className="mb-6 text-sm text-indigo-600"
        >
          ← Back to Projects
        </button>

        <h1 className="text-3xl font-bold">{project.title}</h1>

        <p className="mt-4 whitespace-pre-wrap text-slate-600">
          {project.description || "No description added."}
        </p>

        <div className="mt-8 border-t pt-5">
          <h2 className="mb-3 text-lg font-semibold">Project Metadata</h2>
          <p className="text-sm">Project ID: {project.id}</p>
          <p className="mt-2 text-sm">
            Created:{" "}
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
