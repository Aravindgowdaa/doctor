import { useEffect, useState } from "react";

import StatusBadge from "../../components/appointment/StatusBadge";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/helpers";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/appointments").then(({ data }) => setAppointments(data.data.appointments)).catch(() => {});
  }, []);

  return (
    <DashboardLayout role="admin" title="All Appointments">
      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-4">Patient</th>
              <th className="pb-4">Doctor</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Fee</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Payment</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-slate-100">
                <td className="py-4">{appointment.patient?.name}</td>
                <td className="py-4">{appointment.doctor?.name}</td>
                <td className="py-4">{formatDate(appointment.date)} {appointment.time_slot}</td>
                <td className="py-4">{appointment.fee}</td>
                <td className="py-4"><StatusBadge status={appointment.status} /></td>
                <td className="py-4">{appointment.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminAppointments;
