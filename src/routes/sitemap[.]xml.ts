import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "https://smsmobilepro.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL!;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!;
        const sb = createClient<Database>(url, key);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/solutions", changefreq: "monthly", priority: "0.8" },
          { path: "/tarifs", changefreq: "monthly", priority: "0.8" },
          { path: "/actualites", changefreq: "daily", priority: "0.9" },
          { path: "/a-propos", changefreq: "yearly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/confidentialite", changefreq: "yearly", priority: "0.3" },
          { path: "/conditions", changefreq: "yearly", priority: "0.3" },
        ];

        // Fetch Dynamic News
        const { data: posts } = await sb
          .from("news_posts")
          .select("slug")
          .eq("status", "published")
          .lte("published_at", new Date().toISOString());
        
        if (posts) {
          posts.forEach(p => entries.push({ 
            path: `/actualites/${p.slug}`, 
            changefreq: "monthly", 
            priority: "0.7" 
          }));
        }

        // Fetch Categories
        const { data: cats } = await sb.from("news_categories").select("slug");
        if (cats) {
          cats.forEach(c => entries.push({ 
            path: `/actualites/categorie/${c.slug}`, 
            changefreq: "weekly", 
            priority: "0.6" 
          }));
        }

        // Unique Tags
        const { data: tagsData } = await sb.from("news_posts").select("tags").eq("status", "published");
        const tags = new Set<string>();
        tagsData?.forEach(r => r.tags?.forEach(t => tags.add(t)));
        tags.forEach(t => entries.push({ 
          path: `/actualites/tag/${t}`, 
          changefreq: "weekly", 
          priority: "0.5" 
        }));

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
