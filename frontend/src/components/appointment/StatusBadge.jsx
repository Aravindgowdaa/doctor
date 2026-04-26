const map = {
  pending: "bg-amber-500/15 text-amber-300",
  confirmed: "bg-blue-500/15 text-blue-300",
  completed: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-rose-500/15 text-rose-300",
};

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || "bg-white/10 text-white/70"}`}>{status}</span>
);

export default StatusBadge;
