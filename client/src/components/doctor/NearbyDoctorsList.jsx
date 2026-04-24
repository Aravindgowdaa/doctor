import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink, FiMapPin, FiStar } from "react-icons/fi";

const NearbyDoctorsList = ({ doctors, selectedDoctorId, onSelectDoctor, onBookDoctor, onViewProfile }) => {
  if (!doctors.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-sm text-white/65 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
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
          className={`cursor-pointer rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition ${
            selectedDoctorId === doctor.placeId ? "ring-2 ring-brand-400" : "hover:-translate-y-1"
          }`}
          onClick={() => onSelectDoctor(doctor.placeId)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-white">{doctor.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">{doctor.address}</p>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <span className="inline-flex items-center gap-1">
                <FiStar />
                {doctor.rating || "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/65">
            <span className="inline-flex items-center gap-1">
              <FiMapPin />
              {doctor.distanceText}
            </span>
            <span className={doctor.isOpen ? "text-emerald-300" : "text-rose-300"}>{doctor.openStatus}</span>
            {doctor.dbDoctor && <span className="rounded-full bg-white/10 px-2 py-1 font-semibold text-brand-300">Available in portal</span>}
          </div>
          <p className="mt-3 text-xs leading-5 text-white/45">
            {doctor.dbDoctor
              ? `${doctor.dbDoctor.specialization || "Specialist"} at ${doctor.dbDoctor.clinic_name || "their clinic"}`
              : "Nearby clinic or hospital preview"}
          </p>
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
