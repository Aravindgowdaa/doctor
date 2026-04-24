import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { loadRazorpay } from "../../utils/helpers";
import Modal from "../common/Modal";
import SlotPicker from "../doctor/SlotPicker";

const BookingModal = ({ open, onClose, doctor, date, slots, onBooked }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-clinic");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!timeSlot) {
      toast.error("Please choose a time slot");
      return;
    }
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay");
      }
      const { data } = await axiosInstance.post("/appointments/book", {
        doctor_id: doctor.id,
        date,
        time_slot: timeSlot,
        appointment_type: appointmentType,
        symptoms,
        notes,
      });
      const { appointment, order, key, payment_required } = data.data;

      if (!payment_required || !order || !key) {
        toast.success(data.message || "Appointment booked successfully");
        onBooked?.();
        onClose();
        return;
      }

      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Doctor Portal",
        description: `Consultation with Dr. ${doctor.user?.name}`,
        order_id: order.id,
        handler: async (response) => {
          await axiosInstance.post("/appointments/verify-payment", {
            appointment_id: appointment.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success("Appointment booked successfully");
          onBooked?.();
          onClose();
        },
        theme: {
          color: "#1d7ff2",
        },
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment">
      <div className="space-y-5">
        <div>
          <label className="label text-white/75">Available Time Slots</label>
          <SlotPicker slots={slots} selectedSlot={timeSlot} onChange={setTimeSlot} />
        </div>
        <div>
          <label className="label text-white/75">Appointment Type</label>
          <select className="input" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
            <option value="in-clinic">In-clinic</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div>
          <label className="label text-white/75">Symptoms</label>
          <textarea className="input min-h-24" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
        </div>
        <div>
          <label className="label text-white/75">Notes</label>
          <textarea className="input min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="button" className="btn-primary w-full" disabled={loading} onClick={handleBook}>
          {loading ? "Processing..." : "Book & Pay"}
        </button>
      </div>
    </Modal>
  );
};

export default BookingModal;
