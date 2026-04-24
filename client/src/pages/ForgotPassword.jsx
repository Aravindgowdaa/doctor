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
    <div>
      <Navbar />
      <section className="container-app py-16">
        <div className="mx-auto max-w-xl card space-y-5">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
          {step >= 2 && (
            <div>
              <label className="label">OTP</label>
              <input className="input" value={form.otp} onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))} />
            </div>
          )}
          {step >= 3 && (
            <div>
              <label className="label">New Password</label>
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
