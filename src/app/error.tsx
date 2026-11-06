"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center gap-4 px-4">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="text-mid">The studio could not load this page. Please try again in a moment.</p>
      <button type="button" className="btn justify-self-start" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
