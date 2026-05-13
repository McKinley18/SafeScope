"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/safescope";

function friendlyAuthError() {
  return "Sign in failed. Please check your email and password.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("mckinley.christopherd@gmail.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  async function handleLogin() {
    try {
      setStatusType("idle");
      setStatus("Signing in...");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("login_failed");
      }

      const data = await response.json();

      window.localStorage.setItem("sentinel_auth_token", data.token);
      window.localStorage.setItem("token", data.token);

      setStatusType("success");
      setStatus("Signed in successfully.");
      router.push("/command-center");
    } catch {
      setStatusType("error");
      setStatus(friendlyAuthError());
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Access your Sentinel Safety workspace.
        </p>

        <div className="mt-5 space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          />

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          />

          <button
            onClick={handleLogin}
            className="block w-full rounded-xl bg-[#102A43] px-5 py-3 text-center text-sm font-black text-white"
          >
            Sign In
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Link href="/register" className="text-sm font-black text-[#1D72B8] hover:underline">
              Create an Account
            </Link>

            <Link href="/forgot-password" className="text-sm font-black text-slate-500 hover:text-[#1D72B8] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {status && (
            <p
              className={`rounded-xl p-3 text-sm font-bold ${
                statusType === "error"
                  ? "bg-red-50 text-red-700"
                  : statusType === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-50 text-slate-600"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
