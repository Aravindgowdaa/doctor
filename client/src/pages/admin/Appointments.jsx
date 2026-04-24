import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/appointment/StatusBadge";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/helpers";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/admin/appointments")
      .then(({ data }) => setAppointments(data.data.appointments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout role="admin" title="All Appointments">
      {loading ? (
        <Loader text="Loading appointments..." />
      ) : (
        <div className="card overflow-hidden border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-white/50">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Patient</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Doctor</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Date</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Fee</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Status</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t border-white/10 transition hover:bg-white/5">
                      <td className="px-5 py-4 font-semibold text-white">{appointment.patient?.name || "-"}</td>
                      <td className="px-5 py-4 font-semibold text-white">{appointment.doctor?.name || "-"}</td>
                      <td className="px-5 py-4 text-white/70">
                        {formatDate(appointment.date)} {appointment.time_slot}
                      </td>
                      <td className="px-5 py-4 text-white/70">{appointment.fee}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${appointment.payment_status === "paid" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                          {appointment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-sm text-white/55">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAppointments;
