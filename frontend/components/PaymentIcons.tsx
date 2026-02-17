"use client";

/** Ícones coloridos de métodos de pagamento - marcas oficiais */
const iconWrapper = "flex items-center justify-center w-14 h-10 rounded-lg bg-white/95 p-2 shadow-sm";

export function PaymentIcons() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
      {/* Visa - azul marca */}
      <span className={iconWrapper} title="Visa">
        <img
          src="https://cdn.simpleicons.org/visa/1A1F71"
          alt="Visa"
          className="w-full h-full object-contain"
          width={48}
          height={32}
        />
      </span>
      {/* Mastercard - vermelho marca */}
      <span className={iconWrapper} title="Mastercard">
        <img
          src="https://cdn.simpleicons.org/mastercard/EB001B"
          alt="Mastercard"
          className="w-full h-full object-contain"
          width={48}
          height={32}
        />
      </span>
      {/* Elo - azul marca */}
      <span className={iconWrapper} title="Elo">
        <svg viewBox="0 0 48 32" className="w-full h-full" aria-hidden>
          <rect x="4" y="4" width="40" height="24" rx="3" fill="#00A4E0" />
          <rect x="8" y="10" width="12" height="6" rx="1" fill="white" opacity="0.9" />
          <text x="28" y="18" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ELO</text>
        </svg>
      </span>
      {/* Hipercard - vermelho marca */}
      <span className={iconWrapper} title="Hipercard">
        <svg viewBox="0 0 48 32" className="w-full h-full" aria-hidden>
          <rect x="4" y="4" width="40" height="24" rx="3" fill="#E31837" />
          <rect x="8" y="10" width="14" height="4" rx="1" fill="white" opacity="0.95" />
          <rect x="8" y="17" width="10" height="3" rx="1" fill="white" opacity="0.7" />
        </svg>
      </span>
      {/* PIX - verde/teal marca */}
      <span className={iconWrapper} title="PIX">
        <img
          src="https://cdn.simpleicons.org/pix/32BCAD"
          alt="PIX"
          className="w-full h-full object-contain"
          width={48}
          height={32}
        />
      </span>
      {/* Boleto - documento em âmbar */}
      <span className={iconWrapper} title="Boleto Bancário">
        <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden>
          <rect x="10" y="6" width="28" height="36" rx="3" fill="none" stroke="#D97706" strokeWidth="2" />
          <line x1="10" y1="14" x2="38" y2="14" stroke="#D97706" strokeWidth="1.5" />
          <line x1="10" y1="22" x2="30" y2="22" stroke="#F59E0B" strokeWidth="1" opacity="0.9" />
          <line x1="10" y1="26" x2="26" y2="26" stroke="#F59E0B" strokeWidth="1" opacity="0.7" />
          <line x1="10" y1="30" x2="34" y2="30" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
