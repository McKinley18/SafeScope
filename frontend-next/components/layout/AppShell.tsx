"use client";

import Link from "next/link";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getAutoLockMinutes,
  getProtectedModeLabel,
  hasPinSet,
  isPinRequired,
  isSessionUnlocked,
  lockSession,
} from "@/lib/pinSecurity";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/create-account",
  "/forgot-password",
  "/reset-password",
  "/unlock",
  "/about",
  "/legal",
  "/security",
  "/safescope",
  "/pricing",
];

const navItems = [
  { href: "/command-center", label: "Home", icon: "🏠", activeRoots: ["/command-center", "/dashboard"] },
  { href: "/inspections", label: "Inspect", icon: "📋", activeRoots: ["/inspections", "/inspection", "/inspection-cover", "/inspection-walkthrough"] },
  { href: "/reports", label: "Reports", icon: "🗂", activeRoots: ["/reports"] },
  { href: "/analytics", label: "Insights", icon: "📈", activeRoots: ["/analytics"] },
  { href: "/settings", label: "Settings", icon: "⚙️", activeRoots: ["/settings"] },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const [securityLabel, setSecurityLabel] = useState("Standard Mode");

  const isPublicPage = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );


  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!profileOpen) return;

      const target = event.target as Node;

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSecurityLabel(getProtectedModeLabel());

    if (isPublicPage || pathname === "/unlock") return;

    if (isPinRequired() && (!hasPinSet() || !isSessionUnlocked())) {
      router.push("/unlock");
    }
  }, [isPublicPage, pathname, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPublicPage || pathname === "/unlock") return;
    if (!isPinRequired()) return;

    const autoLockMinutes = getAutoLockMinutes();
    if (!autoLockMinutes) return;

    let timer: number | undefined;

    const resetTimer = () => {
      if (timer) window.clearTimeout(timer);

      timer = window.setTimeout(() => {
        lockSession();
        setSecurityLabel(getProtectedModeLabel());
        router.push("/unlock");
      }, autoLockMinutes * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isPublicPage, pathname, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F8FB] text-slate-900">
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1320] px-4 py-5">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
          <Link href={isPublicPage ? "/" : "/command-center"} className="flex min-w-0 items-center gap-3">
            <img
              src="/logo.png"
              alt="Sentinel Safety"
              className="h-20 w-auto object-contain sm:h-24"
            />
          </Link>

          {!isPublicPage && (
            <>
              <nav className="hidden items-center gap-2 lg:flex">
                {navItems.map((item) => {
                  const active = item.activeRoots.some(
                    (root) => pathname === root || pathname.startsWith(root + "/")
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-black transition",
                        active
                          ? "bg-[#1D72B8] text-white shadow-md shadow-blue-900/20"
                          : "text-slate-300 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex shrink-0 items-center gap-2">
                <button ref={profileButtonRef}
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-white ring-1 ring-white/10"
                  aria-label="Notifications"
                >
                  🔔
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B1320]" />
                </button>

                <div className="relative">
                  <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F4FF] text-xs font-black text-[#1D72B8] ring-1 ring-blue-100"
                  aria-label="Open profile menu"
                >
                  CM
                </button>

                {profileOpen && (
                  <div ref={profileMenuRef} className="absolute right-0 top-13 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-black text-slate-500">{securityLabel}</p>
                  </div>

                  {isPinRequired() && (
                    <button
                      type="button"
                      onClick={() => {
                        lockSession();
                        setProfileOpen(false);
                        router.push("/unlock");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      Lock App
                    </button>
                  )}

                  <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      User Profile
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        window.localStorage.removeItem("token");
                        window.localStorage.removeItem("sentinel_auth_token");
                        window.location.href = "/login";
                      }}
                      className="block w-full px-4 py-4 text-left text-sm font-black text-red-700 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className={`mx-auto w-full max-w-[1200px] flex-1 px-4 pt-4 sm:px-6 md:pt-6 ${isPublicPage ? "pb-8" : "pb-36 lg:pb-8"}`}>
        {children}
      </main>

      {!isPublicPage && <MobileTabBar />}

      {isPublicPage && (
      <footer className="mt-auto w-full border-t border-slate-800 bg-[#0F172A] ">
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

            <p className="m-0 text-center text-[13px] text-slate-500">
              © {new Date().getFullYear()} Sentinel Safety. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
