import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/common/DashboardLayout";
import { fetchDoctorAppointments } from "../../redux/slices/appointmentSlice";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/helpers";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);
  const [, setProfile] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctorAppointments());
    axiosInstance.get("/doctors/profile").then(({ data }) => setProfile(data.data.doctor)).catch(() => {});
  }, [dispatch, user]);

  const todaysAppointments = items.filter((item) => item.date === new Date().toISOString().split("T")[0]);

  return (
    <DashboardLayout role="doctor" title={`Dr. ${user?.name || ""}`}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card border-white/10 bg-white/5">
          <p className="text-sm text-white/50">Today's Appointments</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{todaysAppointments.length}</h3>
        </div>
        <div className="card border-white/10 bg-white/5">
          <p className="text-sm text-white/50">Total Patients</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{new Set(items.map((item) => item.patient?.id)).size}</h3>
        </div>
        <div className="card border-white/10 bg-white/5">
          <p className="text-sm text-white/50">Earnings</p>
          <h3 className="mt-2 text-3xl font-bold text-white">
            {formatCurrency(items.filter((item) => item.payment_status === "paid").reduce((sum, item) => sum + Number(item.fee), 0))}
          </h3>
        </div>
      </div>

      <div className="card mt-6 border-white/10 bg-white/5">
        <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
        <div className="mt-4 space-y-3">
          {todaysAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">
                {appointment.time_slot} - {appointment.patient?.name}
              </p>
              <p className="mt-1 text-sm text-white/60">{appointment.symptoms || "No symptoms provided"}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
