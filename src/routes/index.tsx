import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "SMS Pro Mobile — Plateforme SMS Marketing en Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Envoyez SMS marketing, alertes et campagnes ciblées en Côte d'Ivoire. Paiement Mobile Money, API Gateway, 98% de livraison. Propulsé par NM Technologie.",
      },
      { property: "og:title", content: "SMS Pro Mobile — Plateforme SMS Marketing en Côte d'Ivoire" },
      {
        property: "og:description",
        content:
          "Campagnes SMS, SMS enrichi et API Gateway pour entreprises en Afrique de l'Ouest. Paiement Mobile Money.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function LandingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="px-4 pt-10 pb-14 sm:px-8 sm:pt-16 sm:pb-24 bg-muted">
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-up max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-background border border-border rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/70 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                Services Opérationnels
              </span>
            </div>
            <h1 className="font-display font-extrabold text-[2rem] sm:text-6xl leading-[1.05] tracking-tight text-balance mb-6">
              Propulsez votre business par <span className="text-primary">SMS</span>
            </h1>
            <p className="text-foreground/70 text-base sm:text-xl mb-8 max-w-[42ch] text-pretty">
              La plateforme leader pour vos campagnes marketing et alertes critiques en Côte
              d'Ivoire et Afrique de l'Ouest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:max-w-md">
              <Link
                to="/contact"
                className="flex-1 bg-foreground text-background text-center py-4 px-6 rounded-sm font-semibold shadow-[var(--shadow-hero)] transition-transform active:scale-[0.98] hover:opacity-90"
              >
                Démarrer maintenant
              </Link>
              <Link
                to="/tarifs"
                className="flex-1 bg-background border border-border text-center py-4 px-6 rounded-sm font-semibold hover:border-primary transition-colors"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-fade-up [animation-delay:200ms]">
            {[
              { value: "12.4M+", label: "SMS Envoyés" },
              { value: "98.2%", label: "Taux de livraison" },
              { value: "2 500+", label: "Clients actifs" },
              { value: "< 3s", label: "Temps de réception" },
            ].map((m) => (
              <div key={m.label} className="border-l-2 border-primary pl-4 min-w-0">
                <div className="font-mono text-xl sm:text-3xl font-bold tracking-tighter truncate">
                  {m.value}
                </div>
                <div className="text-[10px] sm:text-xs text-foreground/50 uppercase tracking-wider mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
              Nos Solutions
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Trois canaux, une plateforme
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Marketing Ciblé",
                desc: "Atteignez vos clients directement sur leurs mobiles avec des offres personnalisées et segmentées.",
              },
              {
                n: "02",
                title: "SMS Enrichi",
                desc: "Insérez des liens courts trackables et des visuels pour booster votre taux de conversion.",
              },
              {
                n: "03",
                title: "SMS Gateway API",
                desc: "API REST robuste pour intégrer l'envoi de SMS directement dans vos applications métier.",
              },
            ].map((s) => (
              <Link
                key={s.n}
                to="/solutions"
                className="group p-5 sm:p-6 bg-background border border-border rounded-sm hover:border-primary transition-colors"
              >
                <div className="w-10 h-10 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-4">
                  <span className="font-mono font-bold">{s.n}</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="px-4 py-16 sm:px-8 sm:py-24 bg-foreground text-background">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
              Tarifs
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold mb-3">
              Tarifs Clairs
            </h2>
            <p className="text-background/60 text-sm sm:text-base">
              Sans frais cachés. Paiement Mobile Money (MTN, Orange, Wave).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Starter", price: "7 500", volume: "500 SMS", featured: false },
              { name: "Business", price: "13 000", volume: "1 000 SMS", featured: true },
              { name: "Pro", price: "55 000", volume: "5 000 SMS", featured: false },
              { name: "Enterprise", price: "95 000", volume: "10 000 SMS", featured: false },
            ].map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "bg-primary p-5 sm:p-6 rounded-sm flex flex-col"
                    : "bg-background/5 border border-background/10 p-5 sm:p-6 rounded-sm flex flex-col"
                }
              >
                <div
                  className={
                    p.featured
                      ? "text-xs font-mono uppercase tracking-widest text-background/80 mb-2"
                      : "text-xs font-mono uppercase tracking-widest text-background/50 mb-2"
                  }
                >
                  {p.name}
                </div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold mb-1">
                  {p.price} <span className="text-xs sm:text-sm font-normal opacity-70">FCFA</span>
                </div>
                <div className="text-sm mb-4">{p.volume}</div>
                <Link
                  to="/tarifs"
                  className={
                    p.featured
                      ? "mt-auto w-full py-2.5 bg-background text-primary font-bold text-center text-sm hover:opacity-90 transition-opacity"
                      : "mt-auto w-full py-2.5 border border-background/20 hover:bg-background hover:text-foreground text-center text-sm transition-colors font-semibold"
                  }
                >
                  {p.featured ? "Plus populaire" : "Choisir"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
