const map = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-rose-50 text-rose-600",
};

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>
);

export default StatusBadge;
