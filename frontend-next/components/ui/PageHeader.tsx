type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
};

export default function PageHeader({ title, eyebrow, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="border-l-4 border-[#F97316] pl-4">
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-wide text-[#F97316]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 text-3xl font-black text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5 h-[3px] w-full max-w-[520px] rounded-full bg-gradient-to-r from-[#F97316] via-slate-300 to-transparent" />
    </div>
  );
}
