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
    <div>
      <Navbar />
      <section className="container-app py-16">
        <div className="mx-auto max-w-xl card">
          <h1 className="text-3xl font-bold">Login</h1>
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
            {["patient", "doctor", "admin"].map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${role === item ? "bg-white text-brand-700 shadow-soft" : "text-slate-500"}`}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
            <div className="text-right">
              <a href="/forgot-password" className="text-sm font-semibold text-brand-700">
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
