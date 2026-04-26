import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/common/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = () => {
    setLoading(true);
    axiosInstance
      .get("/admin/patients")
      .then(({ data }) => setPatients(data.data.patients))
      .catch(() => {})
      .finally(() => setLoading(false));
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
      {loading ? (
        <Loader text="Loading patients..." />
      ) : (
        <div className="card overflow-hidden border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-white/50">
                <tr>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Name</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Email</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Phone</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Status</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.length ? (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-t border-white/10 transition hover:bg-white/5">
                      <td className="px-5 py-4 font-semibold text-white">{patient.name}</td>
                      <td className="px-5 py-4 text-white/70">{patient.email}</td>
                      <td className="px-5 py-4 text-white/70">{patient.phone || "-"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${patient.is_blocked ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                          {patient.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => toggleBlock(patient.id)}>
                          {patient.is_blocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-white/55">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPatients;
