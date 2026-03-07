"use client";

/** Ícones de métodos de pagamento organizados para desktop/mobile */
const iconBox = "flex items-center justify-center h-11 rounded-xl p-2 shadow-sm transition-transform hover:scale-105 bg-white";

export function PaymentIcons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-4xl mx-auto">
      {/* Visa - azul oficial */}
      <span className={`${iconBox} w-full`} title="Visa">
        <img
          src="https://cdn.simpleicons.org/visa/1A1F71"
          alt="Visa"
          className="w-full h-full object-contain max-w-[52px]"
          width={48}
          height={32}
        />
      </span>

      {/* Mastercard - vermelho e laranja */}
      <span className={`${iconBox} w-full`} title="Mastercard">
        <img
          src="https://cdn.simpleicons.org/mastercard/EB001B"
          alt="Mastercard"
          className="w-full h-full object-contain max-w-[52px]"
          width={48}
          height={32}
        />
      </span>

      {/* PIX - verde oficial */}
      <span className={`${iconBox} w-full`} title="Pix">
        <img
          src="https://cdn.simpleicons.org/pix/32BCAD"
          alt="Pix"
          className="w-full h-full object-contain max-w-[52px]"
          width={48}
          height={32}
        />
      </span>

      {/* Boleto - verde bancário */}
      <span className={`${iconBox} w-full`} title="Boleto">
        <svg viewBox="0 0 48 32" className="w-full h-full" aria-hidden>
          <rect x="4" y="4" width="40" height="24" rx="2" fill="none" stroke="#00A651" strokeWidth="2" />
          <line x1="4" y1="10" x2="44" y2="10" stroke="#00A651" strokeWidth="1" />
          <line x1="8" y1="16" x2="36" y2="16" stroke="#00A651" strokeWidth="0.8" opacity="0.9" />
          <line x1="8" y1="20" x2="28" y2="20" stroke="#00A651" strokeWidth="0.8" opacity="0.7" />
          <line x1="8" y1="24" x2="32" y2="24" stroke="#00A651" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </span>

    </div>
  );
}
