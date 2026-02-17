"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";

export function WhatsAppButtonExceptAdmin() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return <WhatsAppButton />;
}
