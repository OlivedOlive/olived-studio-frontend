import type { Metadata } from "next";
import { DesignEditor } from "@/components/DesignEditor";
import { StatusBadge } from "@/components/StatusBadge";
import { apiGet } from "@/lib/api";
import type { DesignDetail } from "@/lib/types";

export const metadata: Metadata = { title: "Design" };

export default async function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { design } = await apiGet<{ design: DesignDetail }>(`/designs/${encodeURIComponent(id)}`);

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-4xl">{design.name}</h1>
          <StatusBadge status={design.status} />
        </div>
        <p className="mt-1 text-sm text-mid">
          {design.template.variant.product.name}, {design.template.variant.name}, {design.template.name},{" "}
          {design.market.name}
        </p>
      </div>
      <DesignEditor design={design} />
    </div>
  );
}
