import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import StatsCard from "../../components/admin/StatsCard";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/helpers";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/stats").then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Total Patients" value={stats?.totalPatients || 0} />
        <StatsCard title="Total Doctors" value={stats?.totalDoctors || 0} />
        <StatsCard title="Today's Appointments" value={stats?.todayAppointments || 0} />
        <StatsCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} />
        <StatsCard title="Pending Approvals" value={stats?.pendingApprovals || 0} />
      </div>
      <div className="card mt-6 h-[380px]">
        <h2 className="text-xl font-bold">Top Rated Doctors</h2>
        <div className="mt-4 h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.topRatedDoctors || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user.name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average_rating" fill="#1165d6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
