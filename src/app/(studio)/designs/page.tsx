import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { apiGet } from "@/lib/api";
import type { DesignSummary } from "@/lib/types";

export const metadata: Metadata = { title: "Designs" };

export default async function DesignsPage() {
  const { designs } = await apiGet<{ designs: DesignSummary[] }>("/designs");

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl">Your designs</h1>
        <Link href="/designs/new" className="btn">
          New design
        </Link>
      </div>

      {designs.length === 0 ? (
        <p className="text-mid">You have no designs yet. Start with a product and a market.</p>
      ) : (
        <ul className="grid gap-3">
          {designs.map((design) => (
            <li key={design.id}>
              <Link href={`/designs/${design.id}`} className="card flex flex-wrap items-center justify-between gap-3">
                <span>
                  <span className="block font-medium">{design.name}</span>
                  <span className="text-sm text-mid">
                    {design.template.variant.product.name}, {design.template.name}, {design.market.name}
                  </span>
                </span>
                <StatusBadge status={design.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
