import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/solutions", label: "Solutions" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex flex-col leading-none shrink-0" onClick={() => setOpen(false)}>
          <span className="font-display font-black text-primary tracking-tighter text-lg sm:text-xl">
            SMS PRO
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-foreground/50 uppercase">
            Mobile CI
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5 min-w-0">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="hover:text-primary transition-colors">
                {n.label}
              </Link>
            ))}
          </div>

          {signedIn ? (
            <Link
              to="/dashboard"
              className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-95 shrink-0"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                onClick={() => track("cta_login_click", { location: "header" })}
                className="hidden sm:inline text-xs sm:text-sm font-semibold hover:text-primary shrink-0"
              >
                Se connecter
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                onClick={() => track("cta_signup_click", { location: "header" })}
                className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-95 shrink-0"
              >
                S'inscrire
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden -mr-1 p-2 rounded-sm border border-border"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-sm font-semibold hover:text-primary border-b border-border/60"
              >
                {n.label}
              </Link>
            ))}
            {!signedIn && (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-sm font-semibold hover:text-primary"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-4 sm:px-8 py-12 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
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
            <li>
              <Link to="/solutions" className="hover:text-primary">
                Solutions
              </Link>
            </li>
            <li>
              <Link to="/tarifs" className="hover:text-primary">
                Tarifs
              </Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-primary">
                À propos
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
              Contact
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Nous contacter
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("cta_whatsapp_click", { location: "footer" })}
                className="hover:text-primary"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
              Légal
            </li>
            <li>
              <Link to="/confidentialite" className="hover:text-primary">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/conditions" className="hover:text-primary">
                Conditions d'utilisation
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-[10px] text-foreground/30 font-mono border-t border-border pt-6">
          © 2026 SMS PRO MOBILE. TOUS DROITS RÉSERVÉS.
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="px-4 pt-12 pb-14 sm:px-8 sm:pt-20 sm:pb-20 bg-muted border-b border-border">
      <div className="mx-auto max-w-6xl animate-fade-up">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
          {eyebrow}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-balance mb-4 max-w-3xl">
          {title}
        </h1>
        <p className="text-foreground/70 text-base sm:text-lg max-w-2xl text-pretty">
          {description}
        </p>
      </div>
    </section>
  );
}
