"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const supabase = createClient();

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
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? "Opening Google..." : "Continue with Google"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}