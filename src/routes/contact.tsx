import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-chrome";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Support & Devis SMS Pro Mobile" },
      {
        name: "description",
        content:
          "Contactez l'équipe SMS Pro Mobile par WhatsApp, téléphone ou formulaire. Support commercial et technique en Côte d'Ivoire.",
      },
      { property: "og:title", content: "Contact — SMS Pro Mobile" },
      {
        property: "og:description",
        content:
          "Une question, un devis, un accès API ? Notre équipe basée en Côte d'Ivoire vous répond rapidement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons de <span className="text-primary">votre projet</span>
          </>
        }
        description="Une question technique, un besoin de devis sur mesure ou un accès API ? Nous vous répondons rapidement."
      />

      <section className="px-4 sm:px-8 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-[1fr_1.3fr]">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="p-5 bg-muted rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
                WhatsApp
              </div>
              <p className="font-display font-bold text-lg mb-3">+225 07 00 00 00 00</p>
              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-whatsapp text-background py-2.5 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Discuter maintenant
              </a>
            </div>

            <div className="p-5 bg-muted rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
                Téléphone
              </div>
              <p className="font-display font-bold text-lg">+225 07 00 00 00 00</p>
              <p className="text-xs text-foreground/60 mt-1">Lun-Ven, 8h-18h GMT</p>
            </div>

            <div className="p-5 bg-muted rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
                Email
              </div>
              <p className="font-display font-bold text-base sm:text-lg break-all">
                contact@smspromobile.ci
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 bg-background border border-border rounded-sm">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold mb-6">
              Envoyez-nous un message
            </h2>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                  Entreprise
                </label>
                <input
                  type="text"
                  className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                  Sujet
                </label>
                <select className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm focus:border-primary focus:outline-none">
                  <option>Demande d'information</option>
                  <option>Devis sur mesure</option>
                  <option>Accès API Gateway</option>
                  <option>Support technique</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60 font-mono">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
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
    </SiteLayout>
  );
}
