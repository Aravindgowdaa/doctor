import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DoctorTable from "../../components/admin/DoctorTable";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";

const AdminDoctors = ({ approvedOnly = false }) => {
  const [doctors, setDoctors] = useState([]);

  const loadDoctors = () => {
    axiosInstance.get("/admin/doctors").then(({ data }) => {
      const all = data.data.doctors;
      setDoctors(approvedOnly ? all.filter((doctor) => doctor.is_approved) : all.filter((doctor) => !doctor.is_approved && !doctor.is_rejected));
    }).catch(() => {});
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const runAction = async (doctor, action) => {
    try {
      if (action === "approve") {
        await axiosInstance.put(`/admin/doctors/${doctor.id}/approve`);
      } else if (action === "reject") {
        await axiosInstance.put(`/admin/doctors/${doctor.id}/reject`);
      } else {
        await axiosInstance.put(`/admin/users/${doctor.user.id}/block`);
      }
      toast.success(`Doctor ${action}d successfully`);
      loadDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <DashboardLayout role="admin" title={approvedOnly ? "All Doctors" : "Doctor Approval Requests"}>
      <DoctorTable
        doctors={doctors}
        actions={(doctor) =>
          approvedOnly ? (
            <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => runAction(doctor, "block")}>
              {doctor.user?.is_blocked ? "Unblock" : "Block"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" className="btn-primary !px-4 !py-2" onClick={() => runAction(doctor, "approve")}>
                Approve
              </button>
              <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => runAction(doctor, "reject")}>
                Reject
              </button>
            </div>
          )
        }
      />
    </DashboardLayout>
  );
};

export default AdminDoctors;
