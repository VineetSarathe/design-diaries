import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { SOURCE_LABELS, type Lead } from "@/lib/admin-api";

export function formatLeadDate(iso: string) {
  return format(new Date(iso), "d MMM yyyy");
}

function dash() {
  return "—";
}

function projectField(lead: Lead, value: string) {
  if (lead.source !== "project") return dash();
  return value.trim() || dash();
}

function isImageFile(lead: Lead) {
  const haystack = `${lead.fileUrl} ${lead.fileName}`.toLowerCase();
  return /\.(jpe?g|png|webp|gif)(\?|$)/.test(haystack) || haystack.includes("/image/upload/");
}

function isPdfFile(lead: Lead) {
  return /\.pdf(\?|$)/i.test(`${lead.fileUrl} ${lead.fileName}`);
}

function FileCell({ lead, onView }: { lead: Lead; onView: (lead: Lead) => void }) {
  if (lead.source !== "project") return dash();
  if (!lead.fileUrl && !lead.fileName) return dash();

  if (lead.fileUrl) {
    if (isImageFile(lead)) {
      return (
        <button type="button" onClick={() => onView(lead)} className="group flex cursor-pointer items-center gap-3 text-left">
          <img src={lead.fileUrl} alt="" className="h-12 w-12 shrink-0 object-cover" />
          <span className="underline-offset-4 group-hover:text-primary group-hover:underline">
            {lead.fileName || "View file"}
          </span>
        </button>
      );
    }

    return (
      <button type="button" onClick={() => onView(lead)} className="cursor-pointer text-left underline-offset-4 hover:text-primary hover:underline">
        {lead.fileName || "View file"}
      </button>
    );
  }

  return projectField(lead, lead.fileName);
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [viewer, setViewer] = useState<Lead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="border border-border px-6 py-16 text-center">
        <p className="label-caps text-primary">No leads yet</p>
        <p className="mt-3 text-muted-foreground">New form submissions will appear here automatically.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[72rem] text-left text-sm">
          <thead className="border-b border-border bg-secondary/60">
            <tr>
              {["Name", "Email", "Phone", "City", "Date", "Planning", "File", "Details", "Source"].map((heading) => (
                <th key={heading} className="label-caps px-4 py-3 font-medium text-muted-foreground">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-4 font-medium">{lead.name}</td>
                <td className="px-4 py-4">
                  <a href={`mailto:${lead.email}`} className="transition-colors hover:text-primary">
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{lead.phone || dash()}</td>
                <td className="px-4 py-4">{lead.city || dash()}</td>
                <td className="px-4 py-4 whitespace-nowrap">{formatLeadDate(lead.createdAt)}</td>
                <td className="px-4 py-4">{projectField(lead, lead.planning)}</td>
                <td className="px-4 py-4">
                  <FileCell lead={lead} onView={setViewer} />
                </td>
                <td className="max-w-[18rem] px-4 py-4">
                  <span className="line-clamp-3">{projectField(lead, lead.message)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="label-caps text-[0.65rem] text-primary">{SOURCE_LABELS[lead.source]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewer?.fileUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-5"
          onClick={() => setViewer(null)}
        >
          <button
            type="button"
            aria-label="Close file"
            className="absolute top-5 right-5 p-2 text-background transition-colors hover:text-primary"
            onClick={() => setViewer(null)}
          >
            <X size={22} />
          </button>
          <figure className="max-h-[90svh] max-w-[90vw] bg-background p-8" onClick={(event) => event.stopPropagation()}>
            {isImageFile(viewer) ? (
              <img src={viewer.fileUrl} alt={viewer.fileName || "Attached file"} className="max-h-[70svh] max-w-full object-contain" />
            ) : isPdfFile(viewer) ? (
              <iframe title={viewer.fileName || "Attached file"} src={viewer.fileUrl} className="h-[70svh] w-[min(70vw,48rem)] bg-background" />
            ) : (
              <a href={viewer.fileUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                Open {viewer.fileName || "file"}
              </a>
            )}
            <figcaption className="label-caps mt-4 text-center">{viewer.fileName || "Attached file"}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
