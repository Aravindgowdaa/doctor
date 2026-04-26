import { useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/common/Navbar";
import axiosInstance from "../utils/axiosInstance";

const patientInitial = { name: "", email: "", phone: "", password: "", gender: "male", dob: "" };
const doctorInitial = {
  ...patientInitial,
  specialization: "",
  qualification: "",
  experience: "",
  clinic_name: "",
  clinic_address: "",
  city: "",
  consultation_fee: "",
  bio: "",
  profile_photo: null,
};

const Signup = () => {
  const [tab, setTab] = useState("patient");
  const [patientForm, setPatientForm] = useState(patientInitial);
  const [doctorForm, setDoctorForm] = useState(doctorInitial);

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...patientForm,
      dob: patientForm.dob || null,
    };
    try {
      await axiosInstance.post("/auth/register-patient", payload);
      toast.success("Patient account created successfully");
      setPatientForm(patientInitial);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries({
      ...doctorForm,
      dob: doctorForm.dob || "",
    }).forEach(([key, value]) => {
      if (key === "profile_photo" && !value) return;
      formData.append(key, value);
    });
    try {
      await axiosInstance.post("/auth/register-doctor", formData);
      toast.success("Doctor account submitted for approval");
      setDoctorForm(doctorInitial);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const form = tab === "patient" ? patientForm : doctorForm;
  const setForm = tab === "patient" ? setPatientForm : setDoctorForm;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03050e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,127,242,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(23,178,106,0.12),transparent_24%)]" />
      <Navbar />
      <section className="container-app relative flex min-h-[calc(100vh-5rem)] items-center py-10">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[#0b1220]/92 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {["patient", "doctor"].map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${tab === item ? "bg-white text-slate-950 shadow-soft" : "text-white/50"}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={tab === "patient" ? handlePatientSubmit : handleDoctorSubmit}>
            {["name", "email", "phone", "password", "gender", "dob"].map((field) => (
              <div key={field}>
                <label className="label capitalize text-white/75">{field}</label>
                <input
                  className="input"
                  type={field === "password" ? "password" : field === "dob" ? "date" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                />
              </div>
            ))}
            {tab === "doctor" && (
              <>
                {["specialization", "qualification", "experience", "clinic_name", "clinic_address", "city", "consultation_fee", "bio"].map((field) => (
                  <div key={field}>
                    <label className="label capitalize">{field.replaceAll("_", " ")}</label>
                    <input
                      className="input"
                      type={["experience", "consultation_fee"].includes(field) ? "number" : "text"}
                      value={doctorForm[field]}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="label">Profile Photo</label>
                  <input className="input" type="file" onChange={(e) => setDoctorForm((prev) => ({ ...prev, profile_photo: e.target.files[0] }))} />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <button className="btn-primary w-full" type="submit">
                {tab === "patient" ? "Register Patient" : "Register Doctor"}
              </button>
              {tab === "doctor" && <p className="mt-3 text-sm text-white/55">Doctor accounts remain pending until admin approval.</p>}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signup;
