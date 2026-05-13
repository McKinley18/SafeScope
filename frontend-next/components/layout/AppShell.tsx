"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const publicRoutes = [
  "/",
  "/login",
  "/create-account",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/legal",
  "/security",
  "/safescope",
  "/pricing",
];

const navItems = [
  { href: "/command-center", label: "Dashboard", activeRoots: ["/command-center", "/dashboard"] },
  { href: "/inspections", label: "Inspection", activeRoots: ["/inspections", "/inspection", "/inspection-cover", "/inspection-walkthrough"] },
  { href: "/reports", label: "Reports", activeRoots: ["/reports"] },
  { href: "/analytics", label: "Analytics", activeRoots: ["/analytics"] },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const isPublicPage = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="w-full border-b border-slate-800 bg-[#0B1320] px-5 py-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center">
          <Link href="/command-center" className="block">
            <img
              src="/logo.png"
              alt="Sentinel Safety"
              className="h-[90px] w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {!isPublicPage && (
        <nav className="w-full border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
            <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const active = item.activeRoots.some(
                  (root) => pathname === root || pathname.startsWith(root + "/")
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "relative rounded-full px-4 py-2 text-sm font-black transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-[#0B1320] to-[#1D72B8] text-white shadow-md shadow-blue-900/20 ring-1 ring-blue-200/40"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F4FF] text-sm font-black text-[#1D72B8] ring-1 ring-blue-100"
                aria-label="Open profile menu"
              >
                CM
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    User Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      window.localStorage.removeItem("token");
                      window.localStorage.removeItem("sentinel_auth_token");
                      window.location.href = "/login";
                    }}
                    className="block w-full px-4 py-3 text-left text-sm font-black text-red-700 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className="mx-auto flex-1 w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mt-auto w-full border-t border-slate-800 bg-[#0F172A]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-5 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about" className="text-sm font-semibold text-slate-400 hover:text-white">
              About
            </Link>

            <span className="h-4 w-px bg-slate-700" />

            <Link href="/legal" className="text-sm font-semibold text-slate-400 hover:text-white">
              Legal
            </Link>

            <span className="h-4 w-px bg-slate-700" />

            <Link href="/safescope" className="text-sm font-semibold text-slate-400 hover:text-white">
              SafeScope<span className="ml-[1px] align-super text-[9px]">TM</span>
            </Link>
          </div>

          <div className="h-px w-full max-w-[400px] bg-slate-800" />

          <p className="m-0 text-center text-[13px] text-slate-500">
            © {new Date().getFullYear()} Sentinel Safety. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
