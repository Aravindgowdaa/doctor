import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

import { formatCurrency, formatDate } from "../../utils/helpers";

const Receipt = ({ appointment }) => {
  const receiptRef = useRef(null);

  const handleDownload = async () => {
    const canvas = await html2canvas(receiptRef.current);
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, height);
    pdf.save(`appointment-${appointment.id}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div ref={receiptRef} className="rounded-3xl border border-white/10 bg-[#07111f] p-6 text-white">
        <h3 className="text-2xl font-bold">Appointment Receipt</h3>
        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-2">
          <p>Receipt ID: #{appointment.id}</p>
          <p>Date: {formatDate(appointment.date)}</p>
          <p>Doctor: Dr. {appointment.doctor?.name}</p>
          <p>Patient: {appointment.patient?.name}</p>
          <p>Time Slot: {appointment.time_slot}</p>
          <p>Amount Paid: {formatCurrency(appointment.fee)}</p>
        </div>
      </div>
      <button type="button" className="btn-secondary" onClick={handleDownload}>
        Download PDF
      </button>
    </div>
  );
};

export default Receipt;
