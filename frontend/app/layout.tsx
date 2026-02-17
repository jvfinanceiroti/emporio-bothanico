import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { JsonLdHome } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Empório Bothânico - Perfumes, Aromas e Produtos de Banho | Itabira MG",
    template: "%s | Empório Bothânico",
  },
  description: "Loja de perfumes, aromas exclusivos e produtos de banho em Itabira. Fragrâncias que transformam seu dia a dia. Sabonetes artesanais, difusores, velas e mais. Entrega para todo Brasil.",
  keywords: ["perfumaria Itabira", "aromas ambiente", "sabonetes artesanais", "difusor de ambiente", "velas aromáticas", "Empório Bothânico", "perfumes Itabira MG"],
  authors: [{ name: "Empório Bothânico", url: SITE_URL }],
  creator: "Empório Bothânico",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Empório Bothânico",
    title: "Empório Bothânico - Perfumes, Aromas e Produtos de Banho",
    description: "Fragrâncias exclusivas e produtos de banho que transformam seu dia a dia. Loja em Itabira, entrega para todo Brasil.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Empório Bothânico" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empório Bothânico - Perfumes e Aromas",
    description: "Fragrâncias exclusivas e produtos de banho. Itabira - MG",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <JsonLdHome />
        <main>{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
