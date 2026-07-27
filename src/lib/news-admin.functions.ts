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

// -------- News posts --------

const listSchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    status: z.enum(["all", "draft", "published"]).default("all"),
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
  })
  .default({ status: "all", page: 1, pageSize: 20 });

export const listAllNews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => listSchema.parse(d ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = context.supabase
      .from("news_posts")
      .select("*, news_categories(name,slug)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.search) {
      const s = data.search.replace(/[%_]/g, "\\$&");
      q = q.or(`title.ilike.%${s}%,slug.ilike.%${s}%,excerpt.ilike.%${s}%`);
    }
    const { data: rows, error, count } = await q;
    if (error) throw error;
    return { items: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
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
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
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

// -------- Categories --------

export const listCategoriesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("news_categories")
      .select("*")
      .order("name");
    if (error) throw error;
    return data ?? [];
  });

const catSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional().nullable(),
});

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => catSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("news_categories")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("news_categories")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("news_categories").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listAllTags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data } = await context.supabase.from("news_posts").select("tags");
    const set = new Set<string>();
    (data ?? []).forEach((r: any) => (r.tags ?? []).forEach((t: string) => set.add(t)));
    return Array.from(set).sort();
  });
