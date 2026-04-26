import { FiMapPin, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

import { formatCurrency, getDoctorAvatarUrl } from "../../utils/helpers";

const DoctorCard = ({ doctor }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
    <img
      src={getDoctorAvatarUrl(doctor)}
      alt={doctor.user?.name}
      className="h-56 w-full rounded-3xl object-cover"
    />
    <div className="mt-5 flex flex-1 flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{doctor.user?.name}</h3>
          <p className="text-sm font-semibold text-brand-300">{doctor.specialization}</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-amber-300">
          <span className="inline-flex items-center gap-1">
            <FiStar />
            {doctor.average_rating || 0}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-white/65">
        <p>{doctor.experience} years experience</p>
        <p className="inline-flex items-center gap-2">
          <FiMapPin />
          {doctor.city}
        </p>
        <p className="font-semibold text-white">{formatCurrency(doctor.consultation_fee)}</p>
      </div>
      <div className="mt-5">
        <Link to={`/doctors/${doctor.id}`} className="btn-primary w-full">
          Book Now
        </Link>
      </div>
    </div>
  </div>
);

export default DoctorCard;
