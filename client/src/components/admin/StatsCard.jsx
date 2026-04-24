const StatsCard = ({ title, value, helper }) => (
  <div className="card">
    <p className="text-sm font-semibold text-slate-500">{title}</p>
    <h3 className="mt-3 text-3xl font-bold text-slate-900">{value}</h3>
    {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
  </div>
);

export default StatsCard;
