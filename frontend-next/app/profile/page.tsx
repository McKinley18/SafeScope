"use client";

import PageHeader from "@/components/ui/PageHeader";
export default function ProfilePage() {
  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Account"
        title="User Profile"
        description="Manage your Sentinel Safety profile and workspace identity."
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-black text-slate-700">Name</span>
            <input
              defaultValue="Christopher McKinley"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-slate-700">Email</span>
            <input
              defaultValue="mckinley.christopherd@gmail.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Password Reset
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Update your Sentinel Safety account password.
              </p>
            </div>

            <button className="rounded-xl bg-[#0B1320] px-4 py-2 text-sm font-black text-white transition hover:bg-[#1D72B8]">
              Reset Password
            </button>
          </div>
        </div>

        <button className="mt-5 rounded-xl bg-gradient-to-r from-[#0B1320] to-[#1D72B8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20">
          Save Profile
        </button>
      </div>
    </section>
  );
}
