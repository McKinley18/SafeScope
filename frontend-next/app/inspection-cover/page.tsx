"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function InspectionCoverPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [leadInspector, setLeadInspector] = useState("");
  const [additionalInspectors, setAdditionalInspectors] = useState([""]);
  const [isConfidential, setIsConfidential] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("sentinel_cover_page");
    if (!existing) return;

    const parsed = JSON.parse(existing);
    setOrganizationName(parsed.organizationName || "");
    setSiteLocation(parsed.siteLocation || "");
    setInspectionDate(parsed.inspectionDate || "");
    setLeadInspector(parsed.leadInspector || "");
    setAdditionalInspectors(parsed.additionalInspectors?.length ? parsed.additionalInspectors : [""]);
    setIsConfidential(!!parsed.isConfidential);
  }, []);

  function saveCoverPage() {
    localStorage.setItem(
      "sentinel_cover_page",
      JSON.stringify({
        organizationName,
        siteLocation,
        inspectionDate,
        leadInspector,
        additionalInspectors: additionalInspectors.filter(Boolean),
        isConfidential,
      })
    );
  }

  return (
    <section>
      <div className="mb-[18px] border-l-4 border-[#1D72B8] pl-4">
        <h1 className="text-[28px] font-black text-slate-900">
          Inspection Cover Page
        </h1>
        <p className="mt-1.5 text-sm font-medium leading-[21px] text-slate-500">
          Enter the administrative information that will appear on the final inspection report cover page.
        </p>
      </div>

      <div className="mb-4">
        <h2 className="mb-2.5 text-xl font-black text-slate-900">
          Administrative Information
        </h2>

        <label className="mb-1.5 mt-3 block text-sm font-extrabold text-slate-700">
          Organization Name
        </label>
        <input
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Company / organization"
          className="h-[50px] w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3.5 text-slate-900 outline-none focus:border-[#1D72B8]"
        />

        <label className="mb-1.5 mt-3 block text-sm font-extrabold text-slate-700">
          Site Location
        </label>
        <input
          value={siteLocation}
          onChange={(e) => setSiteLocation(e.target.value)}
          placeholder="Warehouse North, Plant East, etc."
          className="h-[50px] w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3.5 text-slate-900 outline-none focus:border-[#1D72B8]"
        />

        <label className="mb-1.5 mt-3 block text-sm font-extrabold text-slate-700">
          Inspection Date
        </label>
        <input
          value={inspectionDate}
          onChange={(e) => setInspectionDate(e.target.value)}
          placeholder="MM/DD/YYYY"
          className="h-[50px] w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3.5 text-slate-900 outline-none focus:border-[#1D72B8]"
        />

        <label className="mb-1.5 mt-3 block text-sm font-extrabold text-slate-700">
          Lead Inspector
        </label>
        <input
          value={leadInspector}
          onChange={(e) => setLeadInspector(e.target.value)}
          placeholder="Inspector name"
          className="h-[50px] w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3.5 text-slate-900 outline-none focus:border-[#1D72B8]"
        />

        <label className="mb-1.5 mt-3 block text-sm font-extrabold text-slate-700">
          Additional Inspectors
        </label>

        {additionalInspectors.map((inspector, index) => (
          <div key={index} className="mb-3 space-y-2">
            <input
              value={inspector}
              onChange={(e) => {
                const next = [...additionalInspectors];
                next[index] = e.target.value;
                setAdditionalInspectors(next);
              }}
              placeholder={`Additional inspector ${index + 1}`}
              className="h-[50px] w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3.5 text-slate-900 outline-none focus:border-[#1D72B8]"
            />

            <button
              type="button"
              onClick={() =>
                setAdditionalInspectors(
                  additionalInspectors.filter((_, i) => i !== index)
                )
              }
              className="rounded-full bg-red-100 px-3.5 py-2 text-xs font-black text-red-800"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setAdditionalInspectors([...additionalInspectors, ""])}
            className="mt-3 rounded-full bg-slate-200 px-4 py-2.5 text-[13px] font-black text-slate-900"
          >
            + Add Inspector
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsConfidential(!isConfidential)}
        className="mb-3.5 flex w-full gap-2.5 rounded-[14px] border border-red-300 bg-red-50 px-3.5 py-3 text-left"
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-red-600 text-[13px] font-black text-white ${
            isConfidential ? "bg-red-600" : "bg-white"
          }`}
        >
          {isConfidential ? "✓" : ""}
        </span>

        <span className="flex-1">
          <span className="block text-sm font-black text-red-800">
            Privileged & Confidential
          </span>
          <span className="mt-1 block text-xs leading-[17px] text-red-900">
            Select this option to add a privileged and confidential marking to the generated report.
          </span>
        </span>
      </button>

      <div className="flex justify-center">
        <Link
          href="/inspection"
          onClick={saveCoverPage}
          className="rounded-full bg-[#1D72B8] px-[18px] py-[13px] text-sm font-black text-white"
        >
          Continue to Inspection
        </Link>
      </div>
    </section>
  );
}
