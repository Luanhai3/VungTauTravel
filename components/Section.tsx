"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  parallax?: boolean;
};

export default function Section({ title, subtitle, children }: Props) {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
