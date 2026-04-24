import { useEffect, useState } from "react";
import { FiBell, FiCalendar, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
  const stats = [
    {
      title: "Total appointments",
      value: items.length,
      helper: "All bookings",
    },
    {
      title: "Upcoming",
      value: items.filter((appointment) => ["pending", "confirmed"].includes(appointment.status)).length,
      helper: "Scheduled visits",
    },
    {
      title: "Completed",
      value: items.filter((appointment) => appointment.status === "completed").length,
      helper: "Past visits",
    },
    {
      title: "Notifications",
      value: notifications.length,
      helper: "Recent updates",
    },
  ];

  const quickActions = [
    {
      title: "Book an appointment",
      description: "Find a doctor and schedule your next visit.",
      to: "/doctors",
      icon: FiCalendar,
      tone: "from-brand-600/20 to-brand-500/10",
    },
    {
      title: "Check notifications",
      description: "Review the latest reminders and updates.",
      to: "/patient/dashboard",
      icon: FiBell,
      tone: "from-amber-500/20 to-amber-400/10",
    },
    {
      title: "Manage profile",
      description: "Keep your personal details and password up to date.",
      to: "/patient/profile",
      icon: FiUsers,
      tone: "from-emerald-500/20 to-emerald-400/10",
    },
  ];

  return (
    <DashboardLayout role="patient" title="Patient Dashboard">
      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(11,18,32,0.98),rgba(10,20,40,0.9))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">Welcome back</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Hello {user?.name || "Patient"}, your care is organized in one place.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                  Track upcoming visits, read notifications, and book your next appointment without jumping between screens.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px] xl:grid-cols-4">
                {[
                  ["Upcoming", upcoming ? 1 : 0],
                  ["Notifications", notifications.length],
                  ["Completed", items.filter((item) => item.status === "completed").length],
                  ["Confirmed", items.filter((item) => item.status === "confirmed").length],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                    <p className="text-sm text-white/55">At a glance</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101a31]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{item.title}</p>
                <h3 className="mt-3 text-3xl font-bold text-white">{item.value}</h3>
                <p className="mt-2 text-sm text-white/50">{item.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr),minmax(320px,0.95fr)]">
            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Next visit</p>
                  <h2 className="mt-2 text-2xl font-bold">Upcoming appointment</h2>
                </div>
                <p className="text-sm text-white/50">Most recent scheduled visit</p>
              </div>

              {upcoming ? (
                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Doctor</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">Dr. {upcoming.doctor?.name}</h3>
                      <p className="mt-2 text-sm text-white/60">{upcoming.doctor?.specialization || "General consultation"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Status</p>
                      <p className="mt-1 text-base font-semibold text-white capitalize">{upcoming.status}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Date</p>
                      <p className="mt-2 text-sm font-semibold text-white">{formatDate(upcoming.date)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Time</p>
                      <p className="mt-2 text-sm font-semibold text-white">{upcoming.time_slot}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Payment</p>
                      <p className="mt-2 text-sm font-semibold text-white capitalize">{upcoming.payment_status || "pending"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/5 text-center">
                  <div>
                    <FiClock className="mx-auto text-3xl text-white/35" />
                    <p className="mt-3 text-lg font-semibold text-white">No upcoming appointment right now</p>
                    <p className="mt-2 text-sm text-white/55">Book a visit when you are ready to see a doctor.</p>
                    <Link to="/doctors" className="btn-primary mt-5">
                      Find doctors
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Quick actions</p>
                <h2 className="mt-2 text-2xl font-bold">What you can do now</h2>
                <p className="mt-2 text-sm text-white/55">These shortcuts help patients move faster through the portal.</p>
              </div>

              <div className="mt-5 space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.to}
                    className={`group block rounded-3xl border border-white/10 bg-gradient-to-br ${action.tone} p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                        <action.icon className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">{action.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/65">{action.description}</p>
                        <span className="mt-3 inline-flex text-sm font-semibold text-white/80 transition group-hover:text-white">
                          Open section
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Patient portal ready</p>
                    <p className="text-sm text-white/55">Appointments, notifications, and profile details are all in one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr),minmax(320px,0.95fr)]">
            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Recent appointments</p>
                  <h2 className="mt-2 text-2xl font-bold">Your latest visits</h2>
                </div>
                <Link to="/patient/appointments" className="text-sm font-semibold text-white/70 transition hover:text-white">
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {items.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Dr. {appointment.doctor?.name}</p>
                      <p className="mt-1 text-sm text-white/55">
                        {formatDate(appointment.date)} at {appointment.time_slot}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${appointment.status === "completed" ? "bg-emerald-500/15 text-emerald-300" : appointment.status === "confirmed" ? "bg-blue-500/15 text-blue-300" : "bg-amber-500/15 text-amber-300"}`}>
                        {appointment.status}
                      </span>
                      <span className="text-sm text-white/50 capitalize">{appointment.payment_status}</span>
                    </div>
                  </div>
                ))}

                {!items.length && (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/55">
                    No appointments found yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Notifications</p>
                  <h2 className="mt-2 text-2xl font-bold">Recent updates</h2>
                </div>
                <FiBell className="text-xl text-white/45" />
              </div>

              <div className="mt-5 space-y-3">
                {notifications.slice(0, 6).map((notification) => (
                  <div key={notification.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/60">{notification.message}</p>
                  </div>
                ))}

                {!notifications.length && (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/55">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
