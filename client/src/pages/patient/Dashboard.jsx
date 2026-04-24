import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { fetchPatientAppointments } from "../../redux/slices/appointmentSlice";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/helpers";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.appointments);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    dispatch(fetchPatientAppointments());
    axiosInstance.get("/notifications").then(({ data }) => setNotifications(data.data.notifications)).catch(() => {});
  }, [dispatch]);

  const upcoming = items.find((appointment) => ["pending", "confirmed"].includes(appointment.status));

  return (
    <DashboardLayout role="patient" title={`Welcome back, ${user?.name || "Patient"}`}>
      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold">Upcoming Appointment</h2>
              {upcoming ? (
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Doctor: Dr. {upcoming.doctor?.name}</p>
                  <p>Date: {formatDate(upcoming.date)}</p>
                  <p>Time: {upcoming.time_slot}</p>
                  <p>Status: {upcoming.status}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No upcoming appointment right now.</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card">
                <p className="text-sm text-slate-500">Total Appointments</p>
                <h3 className="mt-2 text-3xl font-bold">{items.length}</h3>
              </div>
              <div className="card">
                <p className="text-sm text-slate-500">Completed</p>
                <h3 className="mt-2 text-3xl font-bold">{items.filter((item) => item.status === "completed").length}</h3>
              </div>
              <div className="card">
                <p className="text-sm text-slate-500">Confirmed</p>
                <h3 className="mt-2 text-3xl font-bold">{items.filter((item) => item.status === "confirmed").length}</h3>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold">Recent Notifications</h2>
            <div className="mt-4 space-y-3">
              {notifications.slice(0, 6).map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
