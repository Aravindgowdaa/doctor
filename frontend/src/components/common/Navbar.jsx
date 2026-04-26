import { FiCalendar, FiMenu, FiUser } from "react-icons/fi";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";

import { logoutUser } from "../../redux/slices/authSlice";
import { getDashboardPath } from "../../utils/helpers";

const linkClass = ({ isActive }) => `text-sm font-semibold transition ${isActive ? "text-white" : "text-white/70 hover:text-white"}`;

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/75 text-white backdrop-blur-xl">
      <div className="container-app flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
            <FiCalendar />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Doctor Portal</p>
            <p className="text-xs text-white/55">Trusted medical appointments</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={linkClass}>
            Doctors
          </NavLink>
          <NavLink to="/nearby-doctors" className={linkClass}>
            Nearby Doctors
          </NavLink>
          {!user && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/signup" className="btn-secondary">
                Create account
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to={getDashboardPath(user.role)} className="text-sm font-semibold text-white/70 transition hover:text-white">
                Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          )}
        </nav>

        <button type="button" className="inline-flex text-2xl text-white md:hidden" onClick={() => setOpen((prev) => !prev)}>
          <FiMenu />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#050816] text-white md:hidden">
          <div className="container-app flex flex-col gap-4 py-4">
            <Link to="/">Home</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/nearby-doctors">Nearby Doctors</Link>
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardPath(user.role)} className="flex items-center gap-2">
                  <FiUser /> Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
