import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-chrome";
import { listCampaigns, createCampaign, sendCampaign } from "@/lib/campaigns.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/campaigns")({
  component: CampaignsPage,
  head: () => ({ meta: [{ title: "Campagnes SMS — SMS Pro Mobile" }, { name: "robots", content: "noindex" }] }),
});

function CampaignsPage() {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const { data: campaigns = [], isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: () => listCampaigns() });

  const send = useMutation({
    mutationFn: (id: string) => sendCampaign({ data: { id } }),
    onSuccess: (r) => { toast.success(`Envoyés: ${r.sent}, échoués: ${r.failed}`); qc.invalidateQueries({ queryKey: ["campaigns"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DashboardLayout title="Campagnes SMS">
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary-dark">
          + Nouvelle campagne
        </button>
      </div>

      {showNew && <NewCampaignForm onDone={() => { setShowNew(false); qc.invalidateQueries({ queryKey: ["campaigns"] }); }} onCancel={() => setShowNew(false)} />}

      <div className="bg-background border border-border rounded-sm overflow-hidden">
        {isLoading && <div className="p-6 text-sm text-center text-foreground/50">Chargement…</div>}
        {!isLoading && campaigns.length === 0 && <div className="p-6 text-sm text-center text-foreground/50">Aucune campagne. Créez-en une pour démarrer.</div>}
        {campaigns.map((c: any) => (
          <div key={c.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-foreground/50 mt-1">De <span className="font-mono">{c.sender_id}</span> · {(c.recipients as string[])?.length ?? 0} destinataires · {new Date(c.created_at).toLocaleString("fr-FR")}</div>
                <div className="text-sm text-foreground/70 mt-2 line-clamp-2">{c.message}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-xs">
                  <div className="font-mono">✓ {c.delivered_count}/{c.sent_count}</div>
                  <span className="text-[10px] font-mono uppercase text-foreground/50">{c.status}</span>
                </div>
                {(c.status === "draft" || c.status === "scheduled") && (
                  <button onClick={() => send.mutate(c.id)} disabled={send.isPending} className="bg-foreground text-background px-3 py-1.5 text-xs font-semibold rounded-sm hover:opacity-90 disabled:opacity-50">
                    Envoyer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

function NewCampaignForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [sender, setSender] = useState("SMSPRO");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      const list = recipients.split(/[\s,;\n]+/).map((s) => s.trim()).filter(Boolean);
      return createCampaign({ data: { name, sender_id: sender, message, recipients: list } });
    },
    onSuccess: () => { toast.success("Campagne créée"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="bg-background border border-border rounded-sm p-5 mb-4 space-y-3">
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la campagne" className="w-full px-3 py-2 border border-border rounded-sm text-sm" />
      <input required value={sender} onChange={(e) => setSender(e.target.value)} maxLength={11} placeholder="Expéditeur (max 11 car.)" className="w-full px-3 py-2 border border-border rounded-sm text-sm font-mono" />
      <textarea required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3} placeholder="Message" className="w-full px-3 py-2 border border-border rounded-sm text-sm" />
      <textarea required value={recipients} onChange={(e) => setRecipients(e.target.value)} rows={4} placeholder="Numéros (séparés par virgule, espace ou saut de ligne)" className="w-full px-3 py-2 border border-border rounded-sm text-sm font-mono" />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-border rounded-sm">Annuler</button>
        <button type="submit" disabled={create.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-sm font-semibold hover:bg-primary-dark disabled:opacity-50">
          {create.isPending ? "…" : "Créer"}
        </button>
      </div>
    </form>
  );
}
