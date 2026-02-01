"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Button } from "@base-ui/react/button";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/places", label: "Check-in" },
  { href: "/food", label: "Ăn & Uống" },
  { href: "/checkin", label: "Hẹn Hò" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const dynamicShadow = useTransform(
    scrollY,
    [0, 300],
    ["0 0 0 rgba(0,0,0,0)", "0 25px 60px rgba(2,6,23,0.55)"]
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    setIsScrolled(latest > 40);

    if (latest > previous && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, x: "-50%", opacity: 1 },
        hidden: { y: -80, x: "-50%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-8 left-1/2 z-50 pointer-events-none"
    >
      <nav
        style={{ boxShadow: dynamicShadow.get() }}
        className={`pointer-events-auto
        relative flex items-center justify-between
        w-[820px] max-w-[92vw]
        rounded-full border transition-all duration-700
        px-6
        ${
          isScrolled
            ? `py-3 bg-[#020617]/60 backdrop-blur-xl border-white/20`
            : `py-4 bg-[#020617]/60 border-transparent`
        }`}
      >
        {/* Left spacer */}
        <div className="w-[140px] shrink-0" />

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center justify-center gap-1 flex-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link href={href} className="relative px-4 py-2">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#38BDF8]/20 backdrop-blur-md"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <span
                    className={`relative text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "text-[#38BDF8]"
                          : "text-white/70 hover:text-white"
                      }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right spacer / Mobile */}
        <div className="w-[140px] shrink-0 flex justify-end">
          <Link href="/places" className="lg:hidden">
            <Button className="text-sm text-white/90">Menu</Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
