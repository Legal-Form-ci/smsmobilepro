import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listPublishedNews = createServerFn({ method: "GET" })
  .inputValidator((d: { category?: string; tag?: string; limit?: number } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb
      .from("news_posts")
      .select("id, title, slug, excerpt, cover_image_url, published_at, tags, category_id, news_categories(name,slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(data.limit ?? 30);
    if (data.category) q = q.eq("news_categories.slug", data.category);
    if (data.tag) q = q.contains("tags", [data.tag]);
    const { data: rows, error } = await q;
    if (error) return [];
    if (data.category) return (rows ?? []).filter((r: any) => r.news_categories?.slug === data.category);
    return rows ?? [];
  });

export const getNewsBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row } = await sb
      .from("news_posts")
      .select("*, news_categories(name,slug)")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb.from("news_categories").select("*").order("name");
  return data ?? [];
});

export const listActiveHeroSlides = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return data ?? [];
});
