import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink, FiMapPin, FiStar } from "react-icons/fi";

const NearbyDoctorsList = ({ doctors, selectedDoctorId, onSelectDoctor, onBookDoctor, onViewProfile }) => {
  if (!doctors.length) {
    return (
      <div className="card text-sm text-slate-500">
        No nearby doctors, clinics, or hospitals were found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor, index) => (
        <motion.div
          key={doctor.placeId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className={`card cursor-pointer transition ${selectedDoctorId === doctor.placeId ? "ring-2 ring-brand-400" : "hover:-translate-y-1"}`}
          onClick={() => onSelectDoctor(doctor.placeId)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{doctor.address}</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              <span className="inline-flex items-center gap-1">
                <FiStar />
                {doctor.rating || "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <FiMapPin />
              {doctor.distanceText}
            </span>
            <span className={doctor.isOpen ? "text-emerald-600" : "text-rose-600"}>{doctor.openStatus}</span>
            {doctor.dbDoctor && <span className="rounded-full bg-brand-50 px-2 py-1 font-semibold text-brand-700">Available in portal</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {doctor.dbDoctor ? (
              <button
                type="button"
                className="btn-primary !px-4 !py-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onViewProfile(doctor.dbDoctor.id);
                }}
              >
                View Profile <FiArrowRight className="ml-1" />
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary !px-4 !py-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onBookDoctor(doctor);
                }}
              >
                <FiExternalLink />
                External
              </button>
            )}
            <button
              type="button"
              className="btn-secondary !px-4 !py-2"
              onClick={(event) => {
                event.stopPropagation();
                onBookDoctor(doctor);
              }}
            >
              Book Appointment
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NearbyDoctorsList;
