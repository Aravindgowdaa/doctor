import { useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/common/Navbar";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", password: "" });

  const sendOtp = async () => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email: form.email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axiosInstance.post("/auth/verify-otp", { email: form.email, otp: form.otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const resetPassword = async () => {
    try {
      await axiosInstance.post("/auth/reset-password", { email: form.email, password: form.password });
      toast.success("Password reset successful");
      setStep(1);
      setForm({ email: "", otp: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03050e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,127,242,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(23,178,106,0.12),transparent_24%)]" />
      <Navbar />
      <section className="container-app relative flex min-h-[calc(100vh-5rem)] items-center py-10">
        <div className="mx-auto max-w-xl space-y-5 rounded-[28px] border border-white/10 bg-[#0b1220]/92 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
          <div>
            <label className="label text-white/75">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
          {step >= 2 && (
            <div>
              <label className="label text-white/75">OTP</label>
              <input className="input" value={form.otp} onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))} />
            </div>
          )}
          {step >= 3 && (
            <div>
              <label className="label text-white/75">New Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
          )}
          {step === 1 && (
            <button type="button" className="btn-primary w-full" onClick={sendOtp}>
              Send OTP
            </button>
          )}
          {step === 2 && (
            <button type="button" className="btn-primary w-full" onClick={verifyOtp}>
              Verify OTP
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn-primary w-full" onClick={resetPassword}>
              Reset Password
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
