const DoctorTable = ({ doctors = [], actions }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4">Doctor</th>
            <th className="px-5 py-4">Specialization</th>
            <th className="px-5 py-4">City</th>
            <th className="px-5 py-4">Fee</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-t border-slate-100">
              <td className="px-5 py-4 font-semibold text-slate-900">{doctor.user?.name}</td>
              <td className="px-5 py-4">{doctor.specialization}</td>
              <td className="px-5 py-4">{doctor.city}</td>
              <td className="px-5 py-4">{doctor.consultation_fee}</td>
              <td className="px-5 py-4">{doctor.is_approved ? "Approved" : doctor.is_rejected ? "Rejected" : "Pending"}</td>
              <td className="px-5 py-4">{actions?.(doctor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DoctorTable;
