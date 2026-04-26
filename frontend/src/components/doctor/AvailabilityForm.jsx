import { useState } from "react";

const defaultSlot = { day: "Monday", start_time: "09:00", end_time: "13:00", slot_duration: 30 };

const AvailabilityForm = ({ initialSlots = [], onSubmit }) => {
  const [slots, setSlots] = useState(initialSlots.length ? initialSlots : [defaultSlot]);

  const updateSlot = (index, key, value) => {
    setSlots((prev) => prev.map((slot, slotIndex) => (slotIndex === index ? { ...slot, [key]: value } : slot)));
  };

  return (
    <div className="space-y-4">
      {slots.map((slot, index) => (
        <div key={`${slot.day}-${index}`} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <select className="input" value={slot.day} onChange={(e) => updateSlot(index, "day", e.target.value)}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
          <input className="input" type="time" value={slot.start_time} onChange={(e) => updateSlot(index, "start_time", e.target.value)} />
          <input className="input" type="time" value={slot.end_time} onChange={(e) => updateSlot(index, "end_time", e.target.value)} />
          <input
            className="input"
            type="number"
            min="10"
            value={slot.slot_duration}
            onChange={(e) => updateSlot(index, "slot_duration", Number(e.target.value))}
          />
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-secondary" onClick={() => setSlots((prev) => [...prev, defaultSlot])}>
          Add Day Slot
        </button>
        <button type="button" className="btn-primary" onClick={() => onSubmit(slots)}>
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
