import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-chrome";
import { listOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/dashboard/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Commandes — SMS Pro Mobile" }, { name: "robots", content: "noindex" }] }),
});

function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => listOrders() });
  return (
    <DashboardLayout title="Mes commandes">
      <div className="bg-background border border-border rounded-sm overflow-hidden">
        {isLoading && <div className="p-6 text-sm text-center text-foreground/50">Chargement…</div>}
        {!isLoading && orders.length === 0 && <div className="p-6 text-sm text-center text-foreground/50">Aucune commande.</div>}
        {orders.map((o: any) => (
          <div key={o.id} className="p-4 border-b border-border last:border-b-0 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold">{o.packages?.name ?? "—"} · <span className="text-foreground/60 font-normal">{o.sms_volume} SMS</span></div>
              <div className="text-xs text-foreground/50 mt-1">{new Date(o.created_at).toLocaleString("fr-FR")} · {o.provider ?? "—"}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{o.amount_fcfa.toLocaleString("fr-FR")} FCFA</div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                o.status === "paid" ? "bg-green-100 text-green-800" :
                o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
