"use client";

import { useLenis } from "@/hooks/useLenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis({ duration: 1.2, enabled: true });
  return <>{children}</>;
}
