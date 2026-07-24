import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Verify admin via RLS-safe RPC
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ count: usersCount }, { count: campaignsCount }, paid, recentOrders, recentCampaigns] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("campaigns").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("amount_fcfa").eq("status", "paid"),
      supabaseAdmin.from("orders").select("*, profiles!inner(email)").order("created_at", { ascending: false }).limit(10),
      supabaseAdmin.from("campaigns").select("*, profiles!inner(email)").order("created_at", { ascending: false }).limit(10),
    ]);

    const revenue = (paid.data ?? []).reduce((s, o) => s + (o.amount_fcfa ?? 0), 0);
    const paidOrders = paid.data?.length ?? 0;

    return {
      usersCount: usersCount ?? 0,
      campaignsCount: campaignsCount ?? 0,
      paidOrders,
      revenue,
      recentOrders: recentOrders.data ?? [],
      recentCampaigns: recentCampaigns.data ?? [],
    };
  });
