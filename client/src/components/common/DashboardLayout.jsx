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
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="container-app grid gap-8 py-10 lg:grid-cols-[260px,1fr]">
      <aside className="card h-fit">
        <Link to="/" className="mb-6 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Doctor Portal
        </Link>
        <div className="space-y-2">
          {menus[role].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <main>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
