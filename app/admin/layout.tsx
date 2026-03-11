"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/residents", label: "Residents" },
  { href: "/admin/reports", label: "Reports" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur" role="banner">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Internal</p>
            <p className="text-xl font-bold text-slate-900">Crossroads Admin</p>
          </div>

          <nav aria-label="Admin navigation" className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              aria-label="Log out of admin"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
