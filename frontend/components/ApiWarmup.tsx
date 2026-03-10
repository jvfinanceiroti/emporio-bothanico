"use client";

import { useEffect } from "react";
import { API_URL } from "@/lib/api";

const WARMUP_SESSION_KEY = "api_warmup_done_v1";
const WARMUP_TIMEOUT_MS = 12000;

async function fetchComTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, { signal: controller.signal, cache: "no-store", keepalive: true });
  } catch {
    // Warmup é best-effort: não pode quebrar a navegação.
  } finally {
    clearTimeout(timeoutId);
  }
}

export function ApiWarmup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(WARMUP_SESSION_KEY)) return;
    sessionStorage.setItem(WARMUP_SESSION_KEY, "1");

    // Aquece o processo e também o caminho mais usado do catálogo.
    fetchComTimeout(`${API_URL}/warmup`, WARMUP_TIMEOUT_MS);
    fetchComTimeout(`${API_URL}/catalogo?include=categorias`, WARMUP_TIMEOUT_MS);
  }, []);

  return null;
}
