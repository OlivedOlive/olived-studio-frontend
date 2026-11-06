"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import groves from "@/assets/images/groves.jpg";
import { postJson } from "@/lib/post";

const INPUTS = {
  login: [
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
  ],
  register: [
    { name: "name", label: "Your name", type: "text", autoComplete: "name" },
    { name: "company", label: "Company", type: "text", autoComplete: "organization" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "password", label: "Password (at least 10 characters)", type: "password", autoComplete: "new-password" },
  ],
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const result = await postJson(`/auth/${mode}`, Object.fromEntries(new FormData(event.currentTarget)));
    if (result.ok) {
      router.push("/designs");
      router.refresh();
      return;
    }
    setError(result.error);
    setFields(result.fields);
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src={groves}
          alt="Rows of olive trees on red earth under a blue sky"
          fill
          priority
          sizes="50vw"
          className="object-cover"
          placeholder="blur"
        />
      </div>

      <div className="mx-auto grid w-full max-w-md content-center gap-6 px-4 py-12">
        <div>
          <p className="text-sm font-medium tracking-widest text-gold">OLIVED STUDIO</p>
          <h1 className="mt-2 text-4xl">{isLogin ? "Log in" : "Create an account"}</h1>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          {INPUTS[mode].map(({ name, label, type, autoComplete }) => (
            <label key={name} className="field">
              {label}
              <input className="input" name={name} type={type} autoComplete={autoComplete} required />
              {fields[name] && <span className="font-normal text-danger">{fields[name]}</span>}
            </label>
          ))}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <button type="submit" className="btn" disabled={busy}>
            {isLogin ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-mid">
          {isLogin ? "New to the studio? " : "Already have an account? "}
          <Link href={isLogin ? "/register" : "/login"} className="text-ink underline">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
