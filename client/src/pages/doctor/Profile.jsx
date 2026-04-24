import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";

const DoctorProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    specialization: "",
    qualification: "",
    experience: "",
    bio: "",
    clinic_name: "",
    clinic_address: "",
    city: "",
    consultation_fee: "",
    phone: user?.phone || "",
    email: user?.email || "",
    profile_photo: null,
  });

  useEffect(() => {
    axiosInstance.get("/doctors/profile").then(({ data }) => {
      const doctor = data.data.doctor;
      if (doctor) {
        setForm((prev) => ({
          ...prev,
          ...doctor,
          clinic_name: doctor.clinic_name || "",
          clinic_address: doctor.clinic_address || "",
        }));
      }
    }).catch(() => {});
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => value && formData.append(key, value));
    try {
      await axiosInstance.put("/doctors/profile", formData);
      toast.success("Doctor profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    }
  };

  return (
    <DashboardLayout role="doctor" title="Doctor Profile">
      <form className="card grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {["specialization", "qualification", "experience", "bio", "clinic_name", "clinic_address", "city", "consultation_fee", "phone", "email"].map((field) => (
          <div key={field}>
            <label className="label capitalize">{field.replaceAll("_", " ")}</label>
            <input
              className="input"
              type={["experience", "consultation_fee"].includes(field) ? "number" : "text"}
              value={form[field] || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="label">Profile Photo</label>
          <input className="input" type="file" onChange={(e) => setForm((prev) => ({ ...prev, profile_photo: e.target.files[0] }))} />
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary" type="submit">
            Save Profile
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default DoctorProfile;
