"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { postJson } from "@/lib/post";
import type { Market, Product } from "@/lib/types";

const DEFAULT_CONTENT = { fields: {}, colors: { primary: "#1c1a16", secondary: "#e8d9bc" } };

export function NewDesignForm({ products, markets }: { products: Product[]; markets: Market[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const { name, templateId, marketId } = Object.fromEntries(new FormData(event.currentTarget));
    const result = await postJson<{ design: { id: string } }>("/designs", {
      name,
      templateId,
      marketId,
      content: DEFAULT_CONTENT,
    });
    if (result.ok) {
      router.push(`/designs/${result.data.design.id}`);
      return;
    }
    setError(Object.values(result.fields)[0] ?? result.error);
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="grid max-w-lg gap-4">
      <label className="field">
        Design name
        <input className="input" name="name" required maxLength={160} />
      </label>

      <label className="field">
        Product and packaging
        <select className="input" name="templateId" required>
          {products.map((product) =>
            product.variants.map((variant) => (
              <optgroup key={variant.id} label={`${product.name}, ${variant.name}`}>
                {variant.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </optgroup>
            )),
          )}
        </select>
      </label>

      <label className="field">
        Market
        <select className="input" name="marketId" required>
          {markets.map((market) => (
            <option key={market.id} value={market.id}>
              {market.name}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" className="btn justify-self-start" disabled={busy}>
        Start designing
      </button>
    </form>
  );
}
