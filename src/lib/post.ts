export type PostResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fields: Record<string, string> };

/** Sends a change to the API from the browser. */
export async function postJson<T = unknown>(path: string, body?: unknown): Promise<PostResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, data };
    return { ok: false, error: data.error ?? "Something went wrong. Please try again.", fields: data.fields ?? {} };
  } catch {
    return { ok: false, error: "We could not reach the studio. Check your connection and try again.", fields: {} };
  }
}
