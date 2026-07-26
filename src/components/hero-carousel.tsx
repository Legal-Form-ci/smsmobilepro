import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listPublishedNews } from "@/lib/news.functions";
import heroSms from "@/assets/hero-sms-1.jpg";
import heroEmail from "@/assets/hero-email-1.jpg";
import heroUemoa from "@/assets/hero-uemoa.jpg";
import heroMoney from "@/assets/hero-mobile-money.jpg";

type Slide = {
  key: string;
  src: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    key: "sms",
    src: heroSms,
    eyebrow: "SMS Marketing",
    title: "Vos promos livrées en 3 secondes",
    subtitle: "98,2% de délivrabilité sur les 8 pays UEMOA.",
    href: "/solutions",
    cta: "Découvrir",
  },
  {
    key: "money",
    src: heroMoney,
    eyebrow: "Mobile Money",
    title: "Alertes de paiement instantanées",
    subtitle: "Orange Money, MTN MoMo, Wave, Moov.",
    href: "/solutions",
    cta: "Voir les cas d'usage",
  },
  {
    key: "uemoa",
    src: heroUemoa,
    eyebrow: "Zone UEMOA",
    title: "8 pays. Une seule plateforme.",
    subtitle: "Côte d'Ivoire, Sénégal, Mali, Burkina, Bénin, Togo, Niger, Guinée-Bissau.",
    href: "/tarifs",
    cta: "Voir les tarifs",
  },
  {
    key: "email",
    src: heroEmail,
    eyebrow: "Omnicanal",
    title: "SMS + Email + WhatsApp",
    subtitle: "Pilotez toutes vos campagnes depuis un seul dashboard.",
    href: "/solutions",
    cta: "Explorer",
  },
];

export function HeroCarousel() {
  const { data: news = [] } = useQuery({
    queryKey: ["public-news-hero"],
    queryFn: () => listPublishedNews(),
    staleTime: 60_000,
  });

  const newsSlides: Slide[] = news.slice(0, 3).map((n: any) => ({
    key: `news-${n.id}`,
    src: n.cover_image_url || heroSms,
    eyebrow: "Actualité",
    title: n.title,
    subtitle: n.excerpt || undefined,
    href: `/actualites/${n.slug}`,
    cta: "Lire l'article",
  }));

  const slides = [...newsSlides, ...DEFAULT_SLIDES];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[idx];

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm bg-background border border-border shadow-[var(--shadow-hero)]">
      {slides.map((s, i) => (
        <img
          key={s.key}
          src={s.src}
          alt={s.title}
          loading={i === 0 ? "eager" : "lazy"}
          width={1024}
          height={1024}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/90 rounded-full mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            {current.eyebrow}
          </span>
        </div>
        <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl leading-tight text-balance">
          {current.title}
        </h3>
        {current.subtitle && (
          <p className="mt-2 text-sm sm:text-base text-white/80 max-w-md">{current.subtitle}</p>
        )}
        {current.href && current.cta && (
          <Link
            to={current.href as any}
            className="inline-flex items-center gap-1 mt-4 text-sm font-semibold border-b-2 border-white/70 hover:border-white pb-0.5"
          >
            {current.cta} →
          </Link>
        )}
      </div>

      {/* dots */}
      <div className="absolute top-4 right-4 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la diapo ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
