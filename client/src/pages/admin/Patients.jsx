import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);

  const loadPatients = () => {
    axiosInstance.get("/admin/patients").then(({ data }) => setPatients(data.data.patients)).catch(() => {});
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const toggleBlock = async (patientId) => {
    try {
      await axiosInstance.put(`/admin/users/${patientId}/block`);
      toast.success("Patient status updated");
      loadPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <DashboardLayout role="admin" title="Patients">
      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Phone</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t border-slate-100">
                <td className="py-4">{patient.name}</td>
                <td className="py-4">{patient.email}</td>
                <td className="py-4">{patient.phone}</td>
                <td className="py-4">
                  <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => toggleBlock(patient.id)}>
                    {patient.is_blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminPatients;
