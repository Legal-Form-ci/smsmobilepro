import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site-chrome";
import { listPublishedNews } from "@/lib/news.functions";

export const Route = createFileRoute("/actualites")({
  component: NewsIndex,
  loader: () => listPublishedNews(),
  head: () => ({
    meta: [
      { title: "Actualités — SMS Pro Mobile" },
      {
        name: "description",
        content:
          "Toutes les actualités SMS Pro Mobile : nouveautés produit, retours clients et tendances du marketing SMS en Afrique de l'Ouest.",
      },
      { property: "og:title", content: "Actualités — SMS Pro Mobile" },
      { property: "og:description", content: "Nouveautés, cas clients et tendances marketing SMS UEMOA." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/actualites" }],
  }),
});

function NewsIndex() {
  const initial = Route.useLoaderData();
  const { data: items = initial } = useQuery({
    queryKey: ["public-news"],
    queryFn: () => listPublishedNews(),
    initialData: initial,
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Blog"
        title="Actualités & ressources"
        description="Nouveautés produit, cas d'usage clients et bonnes pratiques SMS en Afrique de l'Ouest."
      />
      <section className="px-4 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n: any) => (
            <Link
              key={n.id}
              to="/actualites/$slug"
              params={{ slug: n.slug }}
              className="group bg-background border border-border rounded-sm overflow-hidden hover:border-primary transition-colors"
            >
              {n.cover_image_url && (
                <img
                  src={n.cover_image_url}
                  alt={n.title}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover"
                />
              )}
              <div className="p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                  {n.published_at && new Date(n.published_at).toLocaleDateString("fr-FR")}
                </div>
                <h2 className="mt-1 font-display font-bold text-lg leading-snug group-hover:text-primary">
                  {n.title}
                </h2>
                {n.excerpt && (
                  <p className="text-sm text-foreground/70 mt-2 line-clamp-3">{n.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <div className="col-span-full p-10 text-center text-foreground/50">
              Aucune actualité pour le moment.
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
