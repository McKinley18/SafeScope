"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  getAutoLockMinutes,
  hasPinSet,
  setPin,
  unlockSession,
  verifyPin,
} from "@/lib/pinSecurity";

export default function UnlockPage() {
  const router = useRouter();
  const [pin, setPinValue] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [status, setStatus] = useState("");

  const pinExists = typeof window !== "undefined" ? hasPinSet() : false;

  async function submit() {
    setStatus("");

    if (!/^\d{4,6}$/.test(pin)) {
      setStatus("Enter a 4 to 6 digit PIN.");
      return;
    }

    if (!pinExists) {
      if (pin !== confirmPin) {
        setStatus("PIN entries do not match.");
        return;
      }

      await setPin(pin);
      unlockSession(getAutoLockMinutes());
      router.push("/command-center");
      return;
    }

    const valid = await verifyPin(pin);

    if (!valid) {
      setStatus("Incorrect PIN.");
      return;
    }

    unlockSession(getAutoLockMinutes());
    router.push("/command-center");
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <PageHeader
        eyebrow="Protected Mode"
        title={pinExists ? "Unlock Sentinel Safety" : "Create Local PIN"}
        description={
          pinExists
            ? "Enter your PIN to unlock encrypted local inspection reports on this device."
            : "Create a PIN to protect encrypted local inspection reports on this device."
        }
      />

      <div className="rounded-[24px] bg-[#0B1320] p-5">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-[#F97316]">
          Local Security
        </p>

        <label className="block">
          <span className="text-sm font-black text-white">PIN</span>
          <input
            value={pin}
            onChange={(event) => setPinValue(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            type="password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-center text-xl font-black tracking-[8px] text-slate-900 outline-none"
          />
        </label>

        {!pinExists && (
          <label className="mt-4 block">
            <span className="text-sm font-black text-white">Confirm PIN</span>
            <input
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              type="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-center text-xl font-black tracking-[8px] text-slate-900 outline-none"
            />
          </label>
        )}

        <button
          type="button"
          onClick={submit}
          className="mt-5 w-full rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white"
        >
          {pinExists ? "Unlock" : "Create PIN"}
        </button>

        {status && (
          <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
