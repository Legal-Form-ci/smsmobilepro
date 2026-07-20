import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="px-4 pt-10 pb-16 bg-muted sm:px-8 sm:pt-16 sm:pb-24">
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
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-balance mb-6">
                Propulsez votre business par <span className="text-primary">SMS</span>
              </h1>
              <p className="text-foreground/70 text-lg sm:text-xl mb-8 max-w-[42ch] text-pretty">
                La plateforme leader pour vos campagnes marketing et alertes critiques en Côte
                d'Ivoire et Afrique de l'Ouest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:max-w-md">
                <Link
                  to="/"
                  className="flex-1 bg-foreground text-background text-center py-4 px-6 rounded-sm font-semibold shadow-[var(--shadow-hero)] transition-transform active:scale-[0.98] hover:opacity-90"
                >
                  Démarrer maintenant
                </Link>
                <Link
                  to="/"
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
                <div key={m.label} className="border-l-2 border-primary pl-4">
                  <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                    {m.value}
                  </div>
                  <div className="text-xs text-foreground/50 uppercase tracking-wider mt-1">
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
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Trois canaux, une plateforme
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
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
                <div
                  key={s.n}
                  className="group p-6 bg-background border border-border rounded-sm hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-4">
                    <span className="font-mono font-bold">{s.n}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 py-16 sm:px-8 sm:py-24 bg-foreground text-background">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                Tarifs
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">
                Tarifs Clairs
              </h2>
              <p className="text-background/60">
                Sans frais cachés. Paiement Mobile Money (MTN, Orange, Wave).
              </p>
            </div>

            <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 pb-4 md:pb-0 snap-x scroll-px-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { name: "Starter", price: "7 500", volume: "500 SMS", features: ["Support 24/7", "Dashboard mobile"], featured: false },
                { name: "Business", price: "13 000", volume: "1 000 SMS", features: ["Sender ID personnalisé", "API Gateway inclus"], featured: true },
                { name: "Pro", price: "55 000", volume: "5 000 SMS", features: ["Gestion de groupes", "Rapports avancés"], featured: false },
                { name: "Enterprise", price: "95 000", volume: "10 000 SMS", features: ["Priorité d'envoi", "Manager dédié"], featured: false },
              ].map((p) => (
                <div
                  key={p.name}
                  className={
                    p.featured
                      ? "min-w-[280px] md:min-w-0 snap-start bg-primary p-6 rounded-sm flex flex-col"
                      : "min-w-[280px] md:min-w-0 snap-start bg-background/5 border border-background/10 p-6 rounded-sm flex flex-col"
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
                  <div className="text-3xl font-display font-extrabold mb-1">
                    {p.price} <span className="text-sm font-normal opacity-70">FCFA</span>
                  </div>
                  <div
                    className={
                      p.featured
                        ? "text-sm mb-6 pb-6 border-b border-background/20"
                        : "text-sm mb-6 pb-6 border-b border-background/10"
                    }
                  >
                    {p.volume}
                  </div>
                  <ul className="text-sm space-y-3 mb-8 flex-grow">
                    {p.features.map((f) => (
                      <li key={f} className={p.featured ? "" : "opacity-80"}>
                        • {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={
                      p.featured
                        ? "w-full py-3 bg-background text-primary font-bold hover:opacity-90 transition-opacity"
                        : "w-full py-3 border border-background/20 hover:bg-background hover:text-foreground transition-colors font-semibold"
                    }
                  >
                    {p.featured ? "Plus populaire" : "Choisir"}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-background/40 mt-8 font-mono">
              Volumes personnalisés disponibles sur devis.
            </p>
          </div>
        </section>

        {/* About */}
        <section className="px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                À propos
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
                Propulsé par NM Technologie
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                SMS Pro Mobile s'appuie sur l'infrastructure télécom de NM Technologie, opérateur
                reconnu de solutions de communication en Afrique de l'Ouest.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Nous fournissons une plateforme autonome — vitrine, espace client et outils
                d'envoi — pour que les entreprises ivoiriennes déploient leurs campagnes SMS en
                toute autonomie.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "Zone", v: "Afrique de l'Ouest" },
                { k: "Devise", v: "FCFA" },
                { k: "Paiement", v: "Mobile Money" },
                { k: "Langue", v: "Français" },
              ].map((it) => (
                <div key={it.k} className="p-5 bg-muted rounded-sm">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                    {it.k}
                  </div>
                  <div className="font-display font-bold text-lg mt-1">{it.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-4 py-16 sm:px-8 sm:py-24 bg-muted">
          <div className="mx-auto max-w-3xl">
            <div className="bg-background p-8 sm:p-10 border border-border shadow-sm rounded-sm">
              <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                Contact
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-6">
                Une question ? Parlons-en.
              </h2>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <div className="w-12 h-12 bg-success/10 text-success flex items-center justify-center rounded-full font-bold">
                  W
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold opacity-50 font-mono tracking-wider">
                    Support Rapide
                  </p>
                  <p className="font-semibold">+225 07 00 00 00 00</p>
                </div>
              </div>

              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-whatsapp text-background py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Discuter sur WhatsApp
              </a>

              <form className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  Envoyer la demande
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display font-black text-primary tracking-tighter text-xl">
            SMS PRO
          </span>
          <span className="text-[10px] font-mono tracking-widest text-foreground/50 uppercase">
            Mobile CI
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <Link
            to="/"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-95"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="px-4 sm:px-8 py-12 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="font-display font-black text-primary tracking-tighter text-xl">
              SMS PRO
            </span>
            <p className="text-xs text-foreground/50 mt-2 max-w-xs">
              Plateforme SMS professionnelle propulsée par NM Technologie. Solutions de
              communication pour l'Afrique de l'Ouest.
            </p>
          </div>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
              Plateforme
            </li>
            <li><a href="#solutions" className="hover:text-primary">Solutions</a></li>
            <li><a href="#tarifs" className="hover:text-primary">Tarifs</a></li>
            <li><a href="#" className="hover:text-primary">API Docs</a></li>
          </ul>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
              Légal
            </li>
            <li><a href="#" className="hover:text-primary">CGU</a></li>
            <li><a href="#" className="hover:text-primary">Confidentialité</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div className="text-[10px] text-foreground/30 font-mono border-t border-border pt-6">
          © 2026 SMS PRO MOBILE. TOUS DROITS RÉSERVÉS.
        </div>
      </div>
    </footer>
  );
}
