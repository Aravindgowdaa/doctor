import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Receipt from "../../components/appointment/Receipt";
import StatusBadge from "../../components/appointment/StatusBadge";
import DashboardLayout from "../../components/common/DashboardLayout";
import Modal from "../../components/common/Modal";
import { fetchPatientAppointments } from "../../redux/slices/appointmentSlice";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/helpers";

const PatientAppointments = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.appointments);
  const [selected, setSelected] = useState(null);
  const [modalMode, setModalMode] = useState("receipt");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  const cancelAppointment = async (id) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      dispatch(fetchPatientAppointments());
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel appointment");
    }
  };

  const submitReview = async () => {
    try {
      await axiosInstance.post("/reviews", {
        doctor: selected.doctor.id,
        appointment: selected.id,
        ...reviewForm,
      });
      toast.success("Review submitted");
      setSelected(null);
      setModalMode("receipt");
      setReviewForm({ rating: 5, comment: "" });
      dispatch(fetchPatientAppointments());
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit review");
    }
  };

  return (
    <DashboardLayout role="patient" title="Your Appointments">
      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-4">Doctor</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Payment</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((appointment) => (
              <tr key={appointment.id} className="border-t border-slate-100">
                <td className="py-4">Dr. {appointment.doctor?.name}</td>
                <td className="py-4">{formatDate(appointment.date)} {appointment.time_slot}</td>
                <td className="py-4">
                  <StatusBadge status={appointment.status} />
                </td>
                <td className="py-4">{appointment.payment_status}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => setSelected(appointment)}>
                      Receipt
                    </button>
                    {["pending", "confirmed"].includes(appointment.status) && (
                      <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => cancelAppointment(appointment.id)}>
                        Cancel
                      </button>
                    )}
                    {appointment.status === "completed" && (
                      <button
                        type="button"
                        className="btn-primary !px-4 !py-2"
                        onClick={() => {
                          setSelected(appointment);
                          setModalMode("review");
                        }}
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setModalMode("receipt");
        }}
        title={modalMode === "review" ? "Leave Review" : "Download Receipt"}
      >
        {modalMode === "review" ? (
          <div className="space-y-4">
            <div>
              <label className="label">Rating</label>
              <input className="input" type="number" min="1" max="5" value={reviewForm.rating} onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Comment</label>
              <textarea className="input min-h-24" value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))} />
            </div>
            <button type="button" className="btn-primary w-full" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        ) : selected ? (
          <Receipt appointment={selected} />
        ) : null}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientAppointments;
