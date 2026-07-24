import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

const createSchema = z.object({
  name: z.string().min(1).max(200),
  sender_id: z.string().min(1).max(11),
  message: z.string().min(1).max(1000),
  recipients: z.array(z.string().min(6).max(20)).min(1).max(100000),
  scheduled_at: z.string().optional().nullable(),
});

export const createCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => createSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles").select("sms_credits").eq("id", context.userId).maybeSingle();
    const credits = profile?.sms_credits ?? 0;
    if (credits < data.recipients.length) {
      throw new Error(`Crédits insuffisants (${credits} disponibles, ${data.recipients.length} requis).`);
    }
    const { data: camp, error } = await context.supabase
      .from("campaigns")
      .insert({
        user_id: context.userId,
        name: data.name,
        sender_id: data.sender_id,
        message: data.message,
        recipients: data.recipients,
        status: data.scheduled_at ? "scheduled" : "draft",
        scheduled_at: data.scheduled_at ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return camp;
  });

export const sendCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: camp, error } = await context.supabase
      .from("campaigns").select("*").eq("id", data.id).eq("user_id", context.userId).single();
    if (error || !camp) throw new Error("Campagne introuvable");
    if (camp.status === "sent" || camp.status === "sending") throw new Error("Campagne déjà envoyée");

    const { sendCampaignViaNMGroupe } = await import("./nmgroupe.server");
    const result = await sendCampaignViaNMGroupe(camp.id, context.userId);
    return result;
  });
