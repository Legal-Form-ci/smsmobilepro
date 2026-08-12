import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-chrome";
import { supabase } from "@/integrations/supabase/client";
import { fetchRoles } from "@/lib/auth";
import { getMockMode, setMockMode } from "@/lib/settings.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const roles = await fetchRoles(data.user.id);
    if (!roles.includes("admin")) throw redirect({ to: "/dashboard" });
  },
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Admin · Paramètres système" }, { name: "robots", content: "noindex" }] }),
});

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["mock-mode"], queryFn: () => getMockMode() });
  const save = useMutation({
    mutationFn: (v: { sms: boolean; payments: boolean }) => setMockMode({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mock-mode"] });
      toast.success("Paramètres enregistrés");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sms = data?.sms ?? false;
  const payments = data?.payments ?? false;
  const anyMock = sms || payments;

  return (
    <DashboardLayout title="Paramètres système">
      <div
        className={`mb-6 p-4 rounded-sm border text-sm ${
          anyMock ? "bg-primary/10 border-primary text-foreground" : "bg-background border-border"
        }`}
      >
        <div className="font-display font-bold">
          {anyMock ? "⚠ Mode simulation ACTIF — données non réelles" : "✔ Mode production — envois et paiements réels"}
        </div>
        <p className="text-foreground/60 mt-1">
          En production, aucun SMS ni paiement n'est simulé. Le mode simulation ne doit servir
          qu'aux tests internes.
        </p>
      </div>

      <div className="bg-background border border-border rounded-sm divide-y divide-border">
        <Toggle
          label="Mode simulation SMS (API NM Groupe)"
          description="Les envois de campagnes sont simulés, aucun SMS réel n'est expédié."
          checked={sms}
          onChange={(v) => save.mutate({ sms: v, payments })}
        />
        <Toggle
          label="Mode simulation paiements (Mobile Money)"
          description="Les commandes sont confirmées sans débit réel."
          checked={payments}
          onChange={(v) => save.mutate({ sms, payments: v })}
        />
      </div>
    </DashboardLayout>
  );
}

function Toggle({
  label, description, checked, onChange,
}: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 p-5 cursor-pointer">
      <span>
        <span className="font-semibold block">{label}</span>
        <span className="text-sm text-foreground/60">{description}</span>
      </span>
      <span className="shrink-0 pt-1">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="block h-6 w-11 rounded-full bg-muted border border-border relative transition-colors peer-checked:bg-primary">
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${
              checked ? "left-6" : "left-0.5"
            }`}
          />
        </span>
      </span>
    </label>
  );
}
