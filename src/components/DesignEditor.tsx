"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LabelPreview } from "@/components/LabelPreview";
import { postJson } from "@/lib/post";
import type { DesignContent, DesignDetail } from "@/lib/types";

const CHECK_INTERVAL_MS = 3000;

export function DesignEditor({ design }: { design: DesignDetail }) {
  const router = useRouter();
  const version = design.versions[0];
  const [content, setContent] = useState<DesignContent>(
    version?.content ?? { fields: {}, colors: { primary: "#1c1a16", secondary: "#e8d9bc" } },
  );
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const requiredFields = design.market.ruleSets[0]?.rules.requiredFields ?? [];
  const validation = version?.validationResults[0];
  const issues = validation?.issues ?? [];
  const review = version?.approvals[0];
  const editable = design.status === "DRAFT" || design.status === "CHANGES_REQUESTED";
  const checking = design.status === "SUBMITTED" && !validation;

  // The market check runs in the background, so reload until its result arrives.
  useEffect(() => {
    if (!checking) return;
    const timer = setInterval(() => router.refresh(), CHECK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [checking, router]);

  function change(next: DesignContent) {
    setContent(next);
    setDirty(true);
    setMessage("");
  }

  async function save() {
    const result = await postJson(`/designs/${design.id}/versions`, { content });
    if (!result.ok) {
      setMessage(result.error);
      return false;
    }
    setDirty(false);
    return true;
  }

  async function run(action: "save" | "submit") {
    setBusy(true);
    const saved = !dirty || (await save());
    if (saved && action === "submit") {
      const result = await postJson(`/designs/${design.id}/submit`);
      if (!result.ok) setMessage(result.error);
    } else if (saved) {
      setMessage("Saved.");
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-4">
        {requiredFields.map(({ key, label }) => {
          const issue = issues.find((i) => i.field === key);
          return (
            <label key={key} className="field">
              {label}
              <input
                className="input"
                value={content.fields[key] ?? ""}
                disabled={!editable}
                maxLength={2000}
                onChange={(e) => change({ ...content, fields: { ...content.fields, [key]: e.target.value } })}
              />
              {issue && <span className="font-normal text-danger">{issue.message}</span>}
            </label>
          );
        })}

        <div className="grid grid-cols-2 gap-4">
          {(["primary", "secondary"] as const).map((key) => (
            <label key={key} className="field capitalize">
              {key} colour
              <input
                type="color"
                className="input cursor-pointer p-1"
                value={content.colors[key]}
                disabled={!editable}
                onChange={(e) => change({ ...content, colors: { ...content.colors, [key]: e.target.value } })}
              />
            </label>
          ))}
        </div>

        {design.status === "CHANGES_REQUESTED" && review && (
          <p role="status" className="text-sm text-danger">
            The OLIVED team asked for changes{review.comment ? `: ${review.comment}` : "."}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm text-mid">
            {message}
          </p>
        )}
        {checking && (
          <p role="status" className="text-sm text-mid">
            Checking this design against the market rules…
          </p>
        )}
        {design.status === "SUBMITTED" && validation?.passed && (
          <p role="status" className="text-sm text-success">
            Passed the market checks. Waiting for review by the OLIVED team.
          </p>
        )}

        {editable && (
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn" disabled={busy} onClick={() => run("submit")}>
              Submit for review
            </button>
            <button type="button" className="btn btn-outline" disabled={busy || !dirty} onClick={() => run("save")}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid content-start gap-2">
        <LabelPreview
          content={content}
          requiredFields={requiredFields}
          widthMm={Number(design.template.widthMm)}
          heightMm={Number(design.template.heightMm)}
        />
        <p className="text-sm text-mid">
          Preview only, not a print file. {design.template.widthMm} × {design.template.heightMm} mm
        </p>
      </div>
    </div>
  );
}
