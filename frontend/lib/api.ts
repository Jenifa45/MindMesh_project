
import { createClient } from "@/lib/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// General API request with Supabase authentication
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const supabase = createClient();

  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session?.access_token) {
    throw new Error("Please log in again.");
  }

  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${session.access_token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    if (response.status === 401) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    if (response.status === 403) {
      throw new Error("You don't have permission to access this resource.");
    }


    return response;
  } catch (error) {
    if (error instanceof Error && error.message !== "Failed to fetch") {
      throw error;
    }

    throw new Error(
      "Unable to connect to the server. Please check your connection."
    );
  }
}

// Check whether the backend is running
export async function pingBackend() {
  const response = await fetch(`${API_URL}/ping`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}

// Get the currently authenticated API user
export async function getCurrentApiUser() {
  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Project types
export type Project = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  user_id: string;
};

export type ProjectInput = {
  title: string;
  description?: string | null;
};

// Reusable helper for project API requests
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(path, options);

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail ?? `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Get all projects belonging to the authenticated user
export function getProjects() {
  return request<Project[]>("/projects/");
}

// Create a project
export function createProject(data: ProjectInput) {
  return request<Project>("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update a project
export function updateProject(
  id: string,
  data: Partial<ProjectInput>
) {
  return request<Project>(
    `/projects/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

// Delete a project
export function deleteProject(id: string) {
  return request<void>(
    `/projects/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}
