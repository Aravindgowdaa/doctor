const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-soft backdrop-blur">
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-600" />
      <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 [animation-delay:120ms]" />
      <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500 [animation-delay:240ms]" />
      <span className="text-sm font-semibold text-white/75">{text}</span>
    </div>
  </div>
);

export default Loader;
