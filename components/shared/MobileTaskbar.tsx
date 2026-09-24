"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const links = [
  {
    name: "Accueil",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: PieChart,
  },
  {
    name: "Objectifs",
    href: "/objectifs",
    icon: Target,
  },
];

export function MobileTaskbar() {
  const pathname = usePathname();

  const activeIndex = Math.max(
    links.findIndex((link) => pathname === link.href),
    0
  );

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];

    if (!el) return;

    const update = () => {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeIndex]);

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 md:hidden"
    >
      <div className="relative flex items-center justify-around gap-1 rounded-[1.35rem] border border-white/80 bg-white/95 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
        {/* Indicateur glissant animé */}
        <span
          className="absolute bottom-1.5 top-1.5 rounded-xl bg-violet-100 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
          aria-hidden="true"
        />

        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = index === activeIndex;

          return (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "font-bold text-violet-800"
                  : "font-medium text-slate-400 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                  isActive                                     ? "scale-110 text-violet-600" : "text-slate-400"
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
              />

              <span
                className={`overflow-hidden whitespace-nowrap text-xs tracking-tight transition-all duration-300 ${
                  isActive
                    ? "max-w-[100px] opacity-100 ml-0.5"
                    : "max-w-0 opacity-0"
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}