const StatsCard = ({ title, value, helper }) => (
  <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101a31]">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{title}</p>
    <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
    {helper && <p className="mt-2 text-sm text-white/50">{helper}</p>}
  </div>
);

export default StatsCard;
