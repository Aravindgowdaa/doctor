import { FiMapPin, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

import { formatCurrency } from "../../utils/helpers";

const DoctorCard = ({ doctor }) => (
  <div className="card flex h-full flex-col">
    <img
      src={doctor.profile_photo || doctor.user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"}
      alt={doctor.user?.name}
      className="h-56 w-full rounded-3xl object-cover"
    />
    <div className="mt-5 flex flex-1 flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{doctor.user?.name}</h3>
          <p className="text-sm font-semibold text-brand-700">{doctor.specialization}</p>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
          <span className="inline-flex items-center gap-1">
            <FiStar />
            {doctor.average_rating || 0}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>{doctor.experience} years experience</p>
        <p className="inline-flex items-center gap-2">
          <FiMapPin />
          {doctor.city}
        </p>
        <p className="font-semibold text-slate-900">{formatCurrency(doctor.consultation_fee)}</p>
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
