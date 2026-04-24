import { FiClock, FiExternalLink, FiMapPin, FiStar } from "react-icons/fi";

const InfoWindowCard = ({ doctor, onBook, onViewProfile }) => (
  <div className="w-[250px] space-y-3 p-1">
    <div>
      <h3 className="text-base font-bold text-slate-900">{doctor.name}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{doctor.address}</p>
    </div>
    <div className="space-y-2 text-xs text-slate-600">
      <p className="inline-flex items-center gap-2">
        <FiStar className="text-amber-500" />
        {doctor.rating ? `${doctor.rating} rating` : "No rating yet"}
      </p>
      <p className="inline-flex items-center gap-2">
        <FiClock className={doctor.isOpen ? "text-emerald-500" : "text-rose-500"} />
        {doctor.openStatus}
      </p>
      <p className="inline-flex items-center gap-2">
        <FiMapPin className="text-brand-700" />
        {doctor.distanceText}
      </p>
    </div>
    <div className="flex gap-2">
      {doctor.dbDoctor ? (
        <button type="button" className="btn-primary !px-4 !py-2" onClick={() => onViewProfile(doctor.dbDoctor.id)}>
          View Profile
        </button>
      ) : (
        <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => onBook(doctor)}>
          <FiExternalLink />
          External
        </button>
      )}
      <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => onBook(doctor)}>
        Book
      </button>
    </div>
  </div>
);

export default InfoWindowCard;
