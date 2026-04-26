const DoctorTable = ({ doctors = [], actions, emptyMessage = "No doctors found." }) => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-white/55">
          <tr>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Doctor</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Specialization</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">City</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Fee</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Status</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length ? (
            doctors.map((doctor) => {
              const status = doctor.is_approved ? "Approved" : doctor.is_rejected ? "Rejected" : "Pending";
              const statusClass =
                status === "Approved"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : status === "Rejected"
                    ? "bg-rose-500/15 text-rose-300"
                    : "bg-amber-500/15 text-amber-300";

              return (
                <tr key={doctor.id} className="border-t border-white/10 transition hover:bg-white/5">
                  <td className="px-5 py-4 font-semibold text-white">{doctor.user?.name}</td>
                  <td className="px-5 py-4 text-white/75">{doctor.specialization || "-"}</td>
                  <td className="px-5 py-4 text-white/75">{doctor.city || "-"}</td>
                  <td className="px-5 py-4 text-white/75">{doctor.consultation_fee || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>
                  </td>
                  <td className="px-5 py-4">{actions?.(doctor)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="px-5 py-10 text-center text-sm text-white/55">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DoctorTable;
