const SlotPicker = ({ slots = [], selectedSlot, onChange }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {slots.map((slot) => (
      <button
        key={slot}
        type="button"
        onClick={() => onChange(slot)}
        className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
          selectedSlot === slot ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
);

export default SlotPicker;
