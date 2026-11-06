"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/post";

export function ReviewActions({ designId }: { designId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(decision: "APPROVED" | "CHANGES_REQUESTED") {
    setBusy(true);
    const result = await postJson(`/review/designs/${designId}/decision`, { decision, comment: comment || undefined });
    if (!result.ok) setError(result.error);
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="grid gap-3">
      <label className="field">
        Comment for the client
        <textarea className="input py-2" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn" disabled={busy} onClick={() => decide("APPROVED")}>
          Approve
        </button>
        <button type="button" className="btn btn-outline" disabled={busy} onClick={() => decide("CHANGES_REQUESTED")}>
          Request changes
        </button>
      </div>
    </div>
  );
}
