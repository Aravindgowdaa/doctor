import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/common/DashboardLayout";
import AvailabilityForm from "../../components/doctor/AvailabilityForm";
import axiosInstance from "../../utils/axiosInstance";

const DoctorAvailability = () => {
  const [blockedDate, setBlockedDate] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axiosInstance.get("/doctors/profile").then(({ data }) => setSlots(data.data.doctor?.available_slots || [])).catch(() => {});
  }, []);

  const saveAvailability = async (items) => {
    try {
      await axiosInstance.put("/doctors/slots", { slots: items });
      toast.success("Availability updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save availability");
    }
  };

  const addBlockedDate = async () => {
    try {
      await axiosInstance.put("/doctors/block-date", { date: blockedDate });
      toast.success("Blocked date added");
      setBlockedDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to block date");
    }
  };

  return (
    <DashboardLayout role="doctor" title="Weekly Availability">
      <div className="card space-y-6 border-white/10 bg-white/5">
        <AvailabilityForm initialSlots={slots} onSubmit={saveAvailability} />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-bold text-white">Block Specific Date</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input className="input" type="date" value={blockedDate} onChange={(e) => setBlockedDate(e.target.value)} />
            <button type="button" className="btn-primary" onClick={addBlockedDate}>
              Block Date
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAvailability;
