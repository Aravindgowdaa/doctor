const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button type="button" className="text-sm font-semibold text-slate-500" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
