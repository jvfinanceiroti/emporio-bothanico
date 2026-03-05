"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { SiteFooter } from "@/components/SiteFooter";

export default function PromocoesPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [showCta, setShowCta] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    fetch(`${API_URL}/promo/visita`, { method: "POST" }).catch(() => {});
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > lastTimeRef.current + 0.4) {
      video.currentTime = lastTimeRef.current;
    }
    lastTimeRef.current = video.currentTime;
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > lastTimeRef.current) {
      video.currentTime = lastTimeRef.current;
    }
  };

  const handleEnded = () => setShowCta(true);

  const handleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    setMuted(false);
  };

  const handleCta = () => {
    setRedirecting(true);
    fetch(`${API_URL}/promo/visita`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "resgate" }),
    }).catch(() => {});
    setTimeout(() => {
      window.location.href =
        "https://wa.me/5531995503794?text=Quero%20meu%20brinde";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header simplificado para landing page */}
      <header className="bg-[#2d5a4a] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline text-white hover:opacity-90"
          >
            <img
              src="/logo.png"
              alt="Empório Bothânico"
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain brightness-0 invert"
            />
            <div>
              <h1
                className="text-base sm:text-lg font-semibold tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-logo)" }}
              >
                Empório Bothânico
              </h1>
              <p
                className="text-[9px] sm:text-[10px] font-light uppercase tracking-[0.2em] text-white/80"
                style={{ fontFamily: "var(--font-tagline)" }}
              >
                Delicadezas e Banho
              </p>
            </div>
          </Link>
          <Link
            href="/produtos"
            className="text-xs sm:text-sm font-semibold uppercase text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-white/10"
          >
            Ver Produtos
          </Link>
        </div>
      </header>

      {/* Barra animada topo */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-2.5">
        <div className="marquee-container">
          <div className="marquee-content">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 mx-8 text-xs sm:text-sm font-bold text-white"
                style={{ fontFamily: "var(--font-tagline)" }}
              >
                <span className="text-yellow-200">&#10024;</span>
                <span className="uppercase tracking-wider">
                  Oferta Especial Para Você
                </span>
                <span className="text-yellow-200">&#10024;</span>
                <span className="mx-2">—</span>
                <span>Acesso liberado após o vídeo</span>
                <span className="mx-2">—</span>
                <span className="uppercase tracking-wider">
                  Brinde Exclusivo
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#e8f0ed] to-[var(--background)] py-8 sm:py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-[var(--accent)] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4 tracking-wide">
            ACESSO BLOQUEADO
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] leading-tight mb-3"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            O botão para ganhar seu{" "}
            <span className="text-[var(--accent)]">brinde gratuito</span> só
            aparece no final
          </h2>
          <p className="text-[var(--muted)] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Assista o vídeo completo para liberar o acesso.{" "}
            <strong className="text-red-600">
              Se sair agora, você perde.
            </strong>
          </p>
        </div>
      </section>

      {/* Vídeo */}
      <section className="px-4 sm:px-6 pb-6 flex justify-center">
        <div className="w-full max-w-xl bg-[var(--accent)] rounded-2xl p-3 sm:p-4 relative shadow-[var(--shadow-xl)]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onEnded={handleEnded}
            className="w-full rounded-xl block"
          >
            <source src="/promo-video.mov" type="video/quicktime" />
            <source src="/promo-video.mov" type="video/mp4" />
          </video>

          {muted && (
            <button
              onClick={handleSound}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-5 py-3 rounded-full text-sm font-bold cursor-pointer z-10 animate-pulse hover:bg-black/90 transition-colors"
            >
              🔊 ATIVAR SOM
            </button>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 pb-12 pt-4">
        {showCta && !redirecting && (
          <button
            onClick={handleCta}
            className="w-full max-w-sm mx-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none px-8 py-4 text-base sm:text-lg rounded-full font-bold cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-bounce"
          >
            QUERO GANHAR MEU BRINDE!
          </button>
        )}

        {redirecting && (
          <p className="text-[var(--success)] font-bold text-sm sm:text-base mt-4">
            Redirecionando para a oferta...
          </p>
        )}

        {!showCta && !redirecting && (
          <p className="text-[var(--muted)] text-xs sm:text-sm italic">
            O botão aparecerá quando o vídeo terminar
          </p>
        )}
      </section>

      {/* Benefícios rápidos */}
      <section className="bg-[var(--accent-light)] py-10 sm:py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center text-2xl">
              🎁
            </div>
            <h3 className="font-bold text-[var(--foreground)] mb-1">
              Brinde Exclusivo
            </h3>
            <p className="text-[var(--muted)] text-sm">
              Presente especial para quem assistir até o final
            </p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center text-2xl">
              🌿
            </div>
            <h3 className="font-bold text-[var(--foreground)] mb-1">
              Produtos Naturais
            </h3>
            <p className="text-[var(--muted)] text-sm">
              Fragrâncias e aromas que transformam seu dia
            </p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center text-2xl">
              📍
            </div>
            <h3 className="font-bold text-[var(--foreground)] mb-1">
              Visite Nossa Loja
            </h3>
            <p className="text-[var(--muted)] text-sm">
              R. Irmãos D&apos;Caux, 47 – Lj 09 – Centro, Itabira
            </p>
          </div>
        </div>
      </section>

      {/* CTA secundário - ver produtos */}
      <section className="py-12 sm:py-16 px-4 text-center bg-gradient-to-b from-[var(--background)] to-white">
        <div className="max-w-2xl mx-auto">
          <p
            className="text-[var(--accent)] font-semibold text-xs uppercase tracking-[0.25em] mb-3"
            style={{ fontFamily: "var(--font-tagline)" }}
          >
            Há 25 anos criando memórias
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            Conheça Nossos Produtos
          </h2>
          <p className="text-[var(--muted)] mb-6 text-sm sm:text-base">
            Perfumes, difusores, sabonetes artesanais, velas aromáticas e muito
            mais. A loja mais cheirosa da região!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/produtos"
              className="btn-primary text-sm sm:text-base"
            >
              Explorar Produtos
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="https://wa.me/5531995503794"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm sm:text-base"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
