"use client";

/** Ícones/bandeiras de métodos de pagamento para footer (fundo escuro) */
const iconBox = "flex items-center justify-center w-12 h-8 rounded bg-white/10 p-1.5";
const iconSize = "w-full h-full object-contain opacity-90";

export function PaymentIcons() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
      {/* Visa - Simple Icons CDN */}
      <span className={iconBox} title="Visa">
        <img src="https://cdn.simpleicons.org/visa/FFFFFF" alt="Visa" className={iconSize} width={40} height={28} />
      </span>
      {/* Mastercard - Simple Icons CDN */}
      <span className={iconBox} title="Mastercard">
        <img src="https://cdn.simpleicons.org/mastercard/FFFFFF" alt="Mastercard" className={iconSize} width={40} height={28} />
      </span>
      {/* Elo - cartão simplificado */}
      <span className={iconBox} title="Elo">
        <svg viewBox="0 0 48 48" fill="#fff" className={iconSize} aria-hidden>
          <rect x="8" y="12" width="32" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="12" y="18" width="12" height="6" rx="1" fill="currentColor" opacity="0.7" />
        </svg>
      </span>
      {/* Hipercard - cartão */}
      <span className={iconBox} title="Hipercard">
        <svg viewBox="0 0 48 48" fill="#fff" className={iconSize} aria-hidden>
          <rect x="6" y="10" width="36" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="10" y="16" width="24" height="3" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="10" y="24" width="14" height="3" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
      {/* PIX - logo verde destaque */}
      <span className="flex items-center justify-center w-12 h-8 rounded bg-[#32bcad]/30 border border-[#32bcad]/50 p-1.5" title="PIX">
        <svg viewBox="0 0 24 24" fill="#32BCAD" className={iconSize} aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7v-2h4V7h2v6h4v2h-4v4h-2z" />
        </svg>
      </span>
      {/* Boleto - documento com barras */}
      <span className={iconBox} title="Boleto Bancário">
        <svg viewBox="0 0 48 48" fill="#fff" className={iconSize} aria-hidden>
          <rect x="10" y="6" width="28" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="14" x2="38" y2="14" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          <line x1="10" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="10" y1="30" x2="34" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
