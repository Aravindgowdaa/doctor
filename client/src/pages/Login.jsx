import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import { loginUser } from "../redux/slices/authSlice";
import { getDashboardPath } from "../utils/helpers";

const Login = () => {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await dispatch(loginUser({ ...form, role })).unwrap();
      toast.success("Login successful");
      navigate(getDashboardPath(user.role));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03050e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,127,242,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(23,178,106,0.12),transparent_24%)]" />
      <Navbar />
      <section className="container-app relative flex min-h-[calc(100vh-5rem)] items-center py-10">
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#0b1220]/92 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {["patient", "doctor", "admin"].map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${role === item ? "bg-white text-slate-950 shadow-soft" : "text-white/50"}`}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label text-white/75">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label className="label text-white/75">Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
            <div className="text-right">
              <a href="/forgot-password" className="text-sm font-semibold text-brand-300">
                Forgot Password?
              </a>
            </div>
            <button className="btn-primary w-full" type="submit">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
