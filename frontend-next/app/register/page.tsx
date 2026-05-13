"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/safescope";

function validatePassword(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Christopher McKinley");
  const [email, setEmail] = useState("mckinley.christopherd@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  const checks = validatePassword(password);
  const passwordValid = Object.values(checks).every(Boolean);
  const passwordsMatch = password && password === confirmPassword;

  async function handleRegister() {
    try {
      if (!passwordValid) {
        setStatusType("error");
        setStatus("Password does not meet all requirements.");
        return;
      }

      if (!passwordsMatch) {
        setStatusType("error");
        setStatus("Passwords do not match.");
        return;
      }

      setStatusType("idle");
      setStatus("Creating account...");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          type: "company",
        }),
      });

      if (!response.ok) {
        throw new Error("register_failed");
      }

      setStatusType("success");
      setStatus("Account created successfully. You can now sign in.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      setStatusType("error");
      setStatus("Account creation failed. This email may already be registered or the server may be unavailable.");
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Create an Account</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Create your Sentinel Safety workspace account.
        </p>

        <div className="mt-5 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]" />
          <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]" />

          <div className="rounded-xl bg-slate-50 p-4 text-xs font-bold text-slate-600">
            <p className="mb-2 font-black text-slate-800">Password Requirements</p>
            <p>{checks.length ? "✓" : "○"} At least 8 characters</p>
            <p>{checks.uppercase ? "✓" : "○"} One uppercase letter</p>
            <p>{checks.lowercase ? "✓" : "○"} One lowercase letter</p>
            <p>{checks.number ? "✓" : "○"} One number</p>
            <p>{checks.special ? "✓" : "○"} One special character</p>
            <p>{passwordsMatch ? "✓" : "○"} Passwords match</p>
          </div>

          <button onClick={handleRegister} className="block w-full rounded-xl bg-[#102A43] px-5 py-3 text-center text-sm font-black text-white">
            Create Account
          </button>

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

          <Link href="/login" className="block text-center text-sm font-black text-[#1D72B8] hover:underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
