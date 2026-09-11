"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { processScoresheet } from "../../app/admin/actions";

type Status = "idle" | "uploading" | "scanning" | "error";

export function ScoresheetUploadForm({ fixtureId }: { fixtureId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("photo") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    setError(null);
    setStatus("uploading");

    // Uploaded straight from the browser to Storage — a phone photo can
    // easily be several MB, which silently failed when it had to pass
    // through a Server Action's request body instead (platform limit).
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${fixtureId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("scoresheets")
      .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setStatus("error");
      return;
    }

    setStatus("scanning");
    try {
      await processScoresheet(fixtureId, path);
      form.reset();
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
      setStatus("error");
    }
  }

  const busy = status === "uploading" || status === "scanning";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <input
        type="file"
        name="photo"
        accept="image/*"
        capture="environment"
        required
        disabled={busy}
        className="text-sm"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-felt-dark px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading…" : status === "scanning" ? "Scanning…" : "Upload & scan"}
      </button>
      {error && <span className="text-sm text-loss">{error}</span>}
    </form>
  );
}
