import type { DesignStatus } from "@/lib/types";

const STATUS: Record<DesignStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "text-mid" },
  SUBMITTED: { label: "Submitted", className: "text-gold" },
  CHANGES_REQUESTED: { label: "Changes needed", className: "text-danger" },
  APPROVED: { label: "Approved", className: "text-success" },
};

export function StatusBadge({ status }: { status: DesignStatus }) {
  const { label, className } = STATUS[status];
  return <span className={`text-sm font-medium ${className}`}>{label}</span>;
}
