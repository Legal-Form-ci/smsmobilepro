import { useMemo, useState } from "react";
import { exportCSV, exportPDF } from "@/lib/export-csv";

interface Props<T> {
  title: string;
  rows: T[];
  mapRow: (r: T) => Record<string, any>;
  searchKeys?: (keyof T | string)[];
  pageSize?: number;
  children: (view: { rows: T[]; page: number; totalPages: number; setPage: (n: number) => void }) => React.ReactNode;
}

export function AdminToolbar<T extends Record<string, any>>({ title, rows, mapRow, searchKeys, pageSize = 25, children }: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => {
      const keys = searchKeys ?? Object.keys(r);
      return keys.some((k) => {
        const v = (r as any)[k];
        return v != null && String(typeof v === "object" ? JSON.stringify(v) : v).toLowerCase().includes(needle);
      });
    });
  }, [rows, q, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const doExport = (fmt: "csv" | "pdf") => {
    const mapped = filtered.map(mapRow);
    const fname = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`;
    if (fmt === "csv") exportCSV(`${fname}.csv`, mapped);
    else exportPDF(title, mapped);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Rechercher…"
          className="text-sm px-3 py-2 border border-border rounded-sm bg-background min-w-[220px]"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-foreground/60">{filtered.length} résultat(s)</span>
          <button onClick={() => doExport("csv")} className="text-xs font-semibold px-3 py-2 border border-border rounded-sm hover:bg-muted">
            Exporter CSV
          </button>
          <button onClick={() => doExport("pdf")} className="text-xs font-semibold px-3 py-2 border border-border rounded-sm hover:bg-muted">
            Exporter PDF
          </button>
        </div>
      </div>
      {children({ rows: pageRows, page: safePage, totalPages, setPage })}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="px-3 py-1 border border-border rounded-sm disabled:opacity-40">←</button>
          <span className="font-mono">Page {safePage} / {totalPages}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="px-3 py-1 border border-border rounded-sm disabled:opacity-40">→</button>
        </div>
      )}
    </div>
  );
}
