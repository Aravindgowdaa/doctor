import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/common/DashboardLayout";
import { fetchMe } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    avatar: null,
  });
  const [password, setPassword] = useState({ current_password: "", new_password: "" });

  const saveProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => value && formData.append(key, value));
    try {
      await axiosInstance.put("/auth/profile", formData);
      await dispatch(fetchMe());
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/auth/change-password", password);
      toast.success("Password updated");
      setPassword({ current_password: "", new_password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <DashboardLayout role="patient" title="Profile Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card space-y-4" onSubmit={saveProfile}>
          <h2 className="text-xl font-bold">Edit Profile</h2>
          {["name", "phone", "gender", "dob"].map((field) => (
            <div key={field}>
              <label className="label capitalize">{field}</label>
              <input className="input" type={field === "dob" ? "date" : "text"} value={profile[field]} onChange={(e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="label">Avatar</label>
            <input className="input" type="file" onChange={(e) => setProfile((prev) => ({ ...prev, avatar: e.target.files[0] }))} />
          </div>
          <button className="btn-primary" type="submit">
            Save Changes
          </button>
        </form>
        <form className="card space-y-4" onSubmit={changePassword}>
          <h2 className="text-xl font-bold">Change Password</h2>
          <div>
            <label className="label">Current Password</label>
            <input className="input" type="password" value={password.current_password} onChange={(e) => setPassword((prev) => ({ ...prev, current_password: e.target.value }))} />
          </div>
          <div>
            <label className="label">New Password</label>
            <input className="input" type="password" value={password.new_password} onChange={(e) => setPassword((prev) => ({ ...prev, new_password: e.target.value }))} />
          </div>
          <button className="btn-primary" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
