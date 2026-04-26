import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiCalendar, FiCheckCircle, FiUsers } from "react-icons/fi";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import StatsCard from "../../components/admin/StatsCard";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/helpers";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(
    () =>
      (stats?.topRatedDoctors || []).map((doctor) => ({
        name: doctor.user?.name || "Doctor",
        rating: Number(doctor.average_rating || 0),
      })),
    [stats],
  );

  const quickActions = [
    {
      title: "Review doctor requests",
      description: `${stats?.pendingApprovals || 0} doctors are waiting for approval.`,
      to: "/admin/doctors",
      tone: "from-brand-600/20 to-brand-500/10",
      icon: FiUsers,
    },
    {
      title: "Check today's schedule",
      description: `${stats?.todayAppointments || 0} appointments are planned for today.`,
      to: "/admin/appointments",
      tone: "from-emerald-500/20 to-emerald-400/10",
      icon: FiCalendar,
    },
    {
      title: "Monitor platform health",
      description: `${stats?.totalPatients || 0} patients and ${stats?.totalDoctors || 0} doctors are active in the portal.`,
      to: "/admin/patients",
      tone: "from-amber-500/20 to-amber-400/10",
      icon: FiActivity,
    },
  ];

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      {loading ? (
        <Loader text="Loading admin analytics..." />
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(11,18,32,0.98),rgba(10,20,40,0.9))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">Welcome back, admin</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  A clearer view of the portal, so you can act quickly and confidently.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                  Review approvals, keep an eye on appointments, and spot the busiest parts of the system at a glance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Today</p>
                  <p className="mt-2 text-2xl font-bold text-white">{stats?.todayAppointments || 0}</p>
                  <p className="text-sm text-white/55">Appointments</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Waiting</p>
                  <p className="mt-2 text-2xl font-bold text-white">{stats?.pendingApprovals || 0}</p>
                  <p className="text-sm text-white/55">Approvals</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
                  <p className="text-sm text-white/55">Collected</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatsCard title="Total Patients" value={stats?.totalPatients || 0} helper="Registered patients" />
            <StatsCard title="Total Doctors" value={stats?.totalDoctors || 0} helper="Approved doctors" />
            <StatsCard title="Today Appointments" value={stats?.todayAppointments || 0} helper="Scheduled for today" />
            <StatsCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} helper="Paid appointments" />
            <StatsCard title="Pending Approvals" value={stats?.pendingApprovals || 0} helper="Awaiting review" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr),minmax(320px,0.9fr)]">
            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Overview</p>
                  <h2 className="mt-2 text-2xl font-bold">Top rated doctors</h2>
                </div>
                <p className="text-sm text-white/50">Live admin data</p>
              </div>

              <div className="mt-6 h-[320px]">
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={{
                          background: "rgba(5, 8, 22, 0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          color: "#fff",
                        }}
                        labelStyle={{ color: "rgba(255,255,255,0.75)" }}
                      />
                      <Bar dataKey="rating" fill="#1d7ff2" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/10 text-sm text-white/55">
                    No approved doctors yet to display in the chart.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Quick actions</p>
                <h2 className="mt-2 text-2xl font-bold">What needs attention</h2>
                <p className="mt-2 text-sm text-white/55">Use these shortcuts to keep the portal moving smoothly.</p>
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
                    <p className="text-sm font-semibold text-white">Ready for review</p>
                    <p className="text-sm text-white/55">You can approve doctors and manage patients from here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
