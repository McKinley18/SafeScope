import Link from "next/link";

export default function AboutPage() {
  return (
    <section>
      <div className="mb-6 border-l-[5px] border-[#0369A1] pl-4">
        <h1 className="mb-2.5 text-[30px] font-black text-slate-900">
          About Sentinel Safety
        </h1>
        <p className="text-base font-bold leading-6 text-slate-600">
          Sentinel Safety is an intelligent safety platform built from real-world operational experience, safety leadership, and business strategy.
        </p>
      </div>

      <div className="mb-1.5 border-b border-slate-200 py-[18px]">
        <h2 className="mb-2 text-xl font-black text-slate-900">The Mission</h2>
        <p className="text-[15px] leading-[23px] text-slate-500">
          Our mission is to help serious operations identify hazards earlier, create stronger inspection records, and convert findings into accountable corrective action.
        </p>
      </div>

      <div className="mb-1.5 border-b border-slate-200 py-[18px]">
        <h2 className="mb-2 text-xl font-black text-slate-900">The Result</h2>
        <p className="text-[15px] leading-[23px] text-slate-500">
          Sentinel Safety gives teams a structured way to document risk, support professional judgment, and build defensible safety intelligence over time.
        </p>
      </div>

      <Link href="/login" className="mt-[18px] block text-center text-sm font-black text-[#0369A1]">
        Return to Sign In
      </Link>
    </section>
  );
}
