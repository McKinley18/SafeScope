"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto max-w-md space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Reset Password</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Enter your email and we will prepare the password reset flow.
        </p>

        <div className="mt-5 space-y-3">
          <input placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]" />

          <button className="block w-full rounded-xl bg-[#102A43] px-5 py-3 text-center text-sm font-black text-white">
            Continue
          </button>

          <Link href="/login" className="block text-center text-sm font-black text-[#1D72B8] hover:underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
