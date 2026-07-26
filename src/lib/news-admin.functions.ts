import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const listAllNews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().default(""),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.string().optional().nullable(),
});

export const upsertNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload: any = { ...data, author_id: context.userId };
    if (payload.status === "published" && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }
    if (payload.id) {
      const { data: row, error } = await context.supabase
        .from("news_posts")
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("news_posts")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("news_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
