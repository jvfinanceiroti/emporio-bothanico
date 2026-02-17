import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";
// Usar variável para override: NEXT_PUBLIC_ASSET_PREFIX (ex: https://www.emporiobothanico.com.br)
const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;

const nextConfig: NextConfig = {
  // Chunks 404 no painel - se NEXT_PUBLIC_ASSET_PREFIX estiver definido, carrega do domínio indicado
  assetPrefix: process.env.NODE_ENV === "production" && ASSET_PREFIX ? ASSET_PREFIX : undefined,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
