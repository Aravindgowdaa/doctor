import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import StatusBadge from "../../components/appointment/StatusBadge";
import DashboardLayout from "../../components/common/DashboardLayout";
import { fetchDoctorAppointments } from "../../redux/slices/appointmentSlice";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/helpers";

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.appointments);
  const [filters, setFilters] = useState({ status: "", date: "" });

  useEffect(() => {
    dispatch(fetchDoctorAppointments(filters));
  }, [dispatch, filters]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/appointments/${id}/status`, { status });
      toast.success("Appointment updated");
      dispatch(fetchDoctorAppointments(filters));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };

  return (
    <DashboardLayout role="doctor" title="Manage Appointments">
      <div className="card mb-6 grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Filter by status" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} />
        <input className="input" type="date" value={filters.date} onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))} />
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-4">Patient</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Symptoms</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((appointment) => (
              <tr key={appointment.id} className="border-t border-slate-100">
                <td className="py-4">{appointment.patient?.name}</td>
                <td className="py-4">{formatDate(appointment.date)} {appointment.time_slot}</td>
                <td className="py-4">{appointment.symptoms || "-"}</td>
                <td className="py-4"><StatusBadge status={appointment.status} /></td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => updateStatus(appointment.id, "confirmed")}>
                      Confirm
                    </button>
                    <button type="button" className="btn-primary !px-4 !py-2" onClick={() => updateStatus(appointment.id, "completed")}>
                      Complete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
