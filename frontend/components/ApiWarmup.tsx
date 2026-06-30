"use client";

import { useEffect } from "react";

const WARMUP_SESSION_KEY = "api_warmup_done_v2";

async function fetchComTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, { signal: controller.signal, cache: "no-store", keepalive: true });
  } catch {
    // Warmup é best-effort
  } finally {
    clearTimeout(timeoutId);
  }
}

export function ApiWarmup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(WARMUP_SESSION_KEY)) return;
    sessionStorage.setItem(WARMUP_SESSION_KEY, "1");

    // Aquece a rota interna com cache + retry (evita cold start direto no Render)
    fetchComTimeout("/api/catalogo?include=categorias", 25_000);
  }, []);

  return null;
}
