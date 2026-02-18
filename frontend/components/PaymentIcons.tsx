"use client";

/** Ícones de métodos de pagamento - cores oficiais das bandeiras */
const iconBox = "flex items-center justify-center w-14 h-10 rounded-xl p-2 shadow-sm transition-transform hover:scale-105";

export function PaymentIcons() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
      {/* Visa - azul oficial */}
      <span className={`${iconBox} bg-white`} title="Visa">
        <img
          src="https://cdn.simpleicons.org/visa/1A1F71"
          alt="Visa"
          className="w-full h-full object-contain"
          width={48}
          height={32}
        />
      </span>

      {/* Mastercard - vermelho e laranja */}
      <span className={`${iconBox} bg-white`} title="Mastercard">
        <img
          src="https://cdn.simpleicons.org/mastercard/EB001B"
          alt="Mastercard"
          className="w-full h-full object-contain"
          width={48}
          height={32}
        />
      </span>

      {/* Elo - verde e amarelo oficiais */}
      <span className={`${iconBox} bg-white`} title="Elo">
        <svg viewBox="0 0 48 32" className="w-full h-full" aria-hidden>
          <rect width="48" height="32" rx="4" fill="#003933" />
          <circle cx="16" cy="16" r="7" fill="#3AD566" />
          <circle cx="32" cy="16" r="7" fill="#ffd033" />
          <path d="M24 8v16M16 16h16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        </svg>
      </span>

      {/* Hipercard - laranja oficial */}
      <span className={`${iconBox} bg-white`} title="Hipercard">
        <svg viewBox="0 0 48 32" className="w-full h-full" aria-hidden>
          <rect width="48" height="32" rx="4" fill="none" stroke="#F37021" strokeWidth="2" />
          <rect x="10" y="10" width="14" height="4" rx="2" fill="#F37021" />
          <rect x="10" y="18" width="22" height="3" rx="1.5" fill="#F37021" opacity="0.85" />
          <circle cx="38" cy="16" r="5" fill="#F37021" opacity="0.4" />
          <circle cx="38" cy="16" r="2.5" fill="#F37021" />
        </svg>
      </span>

      {/* PIX - verde oficial */}
      <span className={`${iconBox} bg-[#32BCAD]`} title="PIX">
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="white" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7v-2h4V7h2v6h4v2h-4v4h-2z" />
        </svg>
      </span>

      {/* Boleto - verde bancário */}
      <span className={`${iconBox} bg-white`} title="Boleto Bancário">
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
