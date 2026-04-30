import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency, formatDate } from "../../utils/helpers";
import Modal from "../common/Modal";
import SlotPicker from "../doctor/SlotPicker";

const BookingModal = ({ open, onClose, doctor, date, slots, initialSlot = "", onBooked }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-clinic");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeSlot("");
      setAppointmentType("in-clinic");
      setSymptoms("");
      setNotes("");
      setLoading(false);
      setConfirmingPayment(false);
      setShowQr(false);
      setCreatedAppointment(null);
      setPaymentDone(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeSlot(initialSlot || "");
    }
  }, [open, initialSlot]);

  const handleBook = async () => {
    if (!timeSlot) {
      toast.error("Please choose a time slot");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/appointments/book", {
        doctor_id: doctor.id,
        date,
        time_slot: timeSlot,
        appointment_type: appointmentType,
        symptoms,
        notes,
      });
      if (!data?.data?.appointment?.id) {
        throw new Error("Unable to create appointment");
      }
      setCreatedAppointment(data.data.appointment);
      setShowQr(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const confirmQrPayment = async () => {
    if (!createdAppointment?.id) return;
    setConfirmingPayment(true);
    try {
      const { data } = await axiosInstance.post("/appointments/manual-payment-confirm", {
        appointment_id: createdAppointment.id,
      });
      setCreatedAppointment(data?.data?.appointment || createdAppointment);
      setPaymentDone(true);
      toast.success(data.message || "Payment confirmed");
      onBooked?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to confirm payment");
    } finally {
      setConfirmingPayment(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment">
      {paymentDone ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
            <h3 className="text-xl font-bold text-emerald-200">Appointment Done</h3>
            <p className="mt-1 text-sm text-emerald-100/80">
              Your appointment has done successfully and is now visible in doctor appointments.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Booked Slot</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {formatDate(createdAppointment?.date)} at {createdAppointment?.time_slot}
            </p>
            <p className="mt-2 text-sm text-white/65">
              Dr. {createdAppointment?.doctor?.name} • {formatCurrency(createdAppointment?.fee)}
            </p>
          </div>

          <button type="button" className="btn-primary w-full" onClick={onClose}>
            Done
          </button>
        </div>
      ) : showQr ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Amount To Pay</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(createdAppointment?.fee || doctor?.consultation_fee)}
            </p>
            <p className="mt-2 text-sm text-white/65">
              Slot: {formatDate(createdAppointment?.date)} at {createdAppointment?.time_slot}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black p-2">
            <img src="/payment-qr.jpeg" alt="PhonePe QR code" className="max-h-[52vh] w-full rounded-xl object-contain" />
          </div>
          <p className="text-xs text-white/55">
            Scan and pay the exact amount, then click "Payment Done" to confirm your appointment.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={confirmQrPayment}
              disabled={confirmingPayment}
            >
              {confirmingPayment ? "Confirming..." : "Payment Done"}
            </button>
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => setShowQr(false)}
              disabled={confirmingPayment}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
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
            {loading ? "Processing..." : "Continue To Pay"}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
