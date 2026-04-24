import { FiCalendar, FiClock, FiGrid, FiSettings, FiStar, FiUsers } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

import Navbar from "./Navbar";

const menus = {
  patient: [
    { to: "/patient/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/patient/appointments", label: "Appointments", icon: FiCalendar },
    { to: "/patient/profile", label: "Profile", icon: FiSettings },
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/doctor/appointments", label: "Appointments", icon: FiCalendar },
    { to: "/doctor/availability", label: "Availability", icon: FiClock },
    { to: "/doctor/profile", label: "Profile", icon: FiSettings },
    { to: "/doctor/reviews", label: "Reviews", icon: FiStar },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/admin/doctors", label: "Doctor Requests", icon: FiUsers },
    { to: "/admin/all-doctors", label: "All Doctors", icon: FiUsers },
    { to: "/admin/patients", label: "Patients", icon: FiUsers },
    { to: "/admin/appointments", label: "Appointments", icon: FiCalendar },
  ],
};

const DashboardLayout = ({ role, title, children }) => (
  <div className="min-h-screen bg-[#050816] text-white">
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(29,127,242,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(23,178,106,0.1),transparent_24%)]" />
    <Navbar />
    <div className="container-app grid gap-8 py-10 lg:grid-cols-[280px,1fr]">
      <aside className="h-fit rounded-[28px] border border-white/10 bg-[#0b1220]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <Link to="/" className="mb-6 block text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          {role === "patient" ? "Patient Portal" : "Doctor Portal"}
        </Link>
        <div className="space-y-2">
          {menus[role].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-brand-600 text-white shadow-soft" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <main className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
        </div>
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
