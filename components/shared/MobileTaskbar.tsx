"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Settings,
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
      className="
        fixed
        bottom-[calc(1.1rem+env(safe-area-inset-bottom))]
        left-4
        right-4
        z-50
        md:hidden
      "
    >
      <div
        className="
          relative
          flex
          items-center
          justify-around
          gap-1
          rounded-[28px]
          bg-[#0B0F14]/95
          px-2
          py-2
          shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]
          backdrop-blur-xl
          ring-1
          ring-white/[0.06]
        "
      >
        {/* Indicateur liquide */}
        <span
          className="
            absolute
            top-1.5
            bottom-1.5
            rounded-2xl
            bg-gradient-to-br
            from-emerald-400
            to-teal-500
            shadow-[0_6px_18px_-4px_rgba(16,185,129,0.55)]
            transition-all
            duration-300
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
          "
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
              className={`
                relative
                z-10
                flex
                items-center
                gap-1.5
                rounded-2xl
                px-3
                py-2.5
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-[#0B0F14]"
                    : "text-white/50 hover:text-white/80"
                }
              `}
            >
              <Icon
                className="
                  h-[19px]
                  w-[19px]
                  shrink-0
                  transition-transform
                  duration-300
                "
                strokeWidth={isActive ? 2.4 : 1.8}
              />

              <span
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  text-[12px]
                  font-medium
                  tracking-tight
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "max-w-[100px] opacity-100"
                      : "max-w-0 opacity-0"
                  }
                `}
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