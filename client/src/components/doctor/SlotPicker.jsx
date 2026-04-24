const SlotPicker = ({ slots = [], selectedSlot, onChange }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {slots.map((slot) => (
      <button
        key={slot}
        type="button"
        onClick={() => onChange(slot)}
        className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
          selectedSlot === slot ? "border-brand-500 bg-brand-600 text-white shadow-soft" : "border-white/10 bg-white/5 text-white/75"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
);

export default SlotPicker;
