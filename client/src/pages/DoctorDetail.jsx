import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import BookingModal from "../components/appointment/BookingModal";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import ReviewCard from "../components/doctor/ReviewCard";
import { fetchDoctorDetail } from "../redux/slices/doctorSlice";
import axiosInstance from "../utils/axiosInstance";
import { formatCurrency } from "../utils/helpers";

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.doctors);
  const [reviews, setReviews] = useState([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctorDetail(id));
    axiosInstance.get(`/reviews/doctor/${id}`).then(({ data }) => setReviews(data.data.reviews)).catch(() => {});
  }, [dispatch, id]);

  useEffect(() => {
    if (!date || !doctor) return;
    axiosInstance
      .get(`/appointments/${doctor.id}/slots`, { params: { date } })
      .then(({ data }) => setSlots(data.data.slots))
      .catch((error) => toast.error(error.response?.data?.message || "Failed to fetch slots"));
  }, [date, doctor]);

  const blockedDates = useMemo(() => new Set((doctor?.blocked_dates || []).map((item) => item.date)), [doctor]);

  if (loading || !doctor) return <Loader text="Loading doctor profile..." />;

  return (
    <div>
      <Navbar />
      <section className="container-app py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-8">
            <div className="card grid gap-8 md:grid-cols-[240px,1fr]">
              <img
                src={doctor.profile_photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"}
                alt={doctor.user?.name}
                className="h-72 w-full rounded-3xl object-cover"
              />
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold">Dr. {doctor.user?.name}</h1>
                    <p className="mt-2 text-lg font-semibold text-brand-700">{doctor.specialization}</p>
                  </div>
                  <div className="rounded-full bg-amber-50 px-4 py-2 text-amber-600">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <FiStar />
                      {doctor.average_rating} ({doctor.total_reviews} reviews)
                    </span>
                  </div>
                </div>
                <p className="mt-5 leading-8 text-slate-600">{doctor.bio}</p>
                <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                  <p>Qualification: {doctor.qualification}</p>
                  <p>Experience: {doctor.experience} years</p>
                  <p>Clinic: {doctor.clinic_name}</p>
                  <p className="inline-flex items-center gap-2">
                    <FiMapPin />
                    {doctor.city}
                  </p>
                  <p>Fee: {formatCurrency(doctor.consultation_fee)}</p>
                  <p className="inline-flex items-center gap-2">
                    <FiPhone />
                    {doctor.phone || "Book to reveal"}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          <div className="card h-fit space-y-5">
            <h2 className="text-2xl font-bold">Book Consultation</h2>
            <div>
              <label className="label">Select Date</label>
              <input
                type="date"
                className="input"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => {
                  if (blockedDates.has(e.target.value)) {
                    toast.error("Doctor is unavailable on that date");
                    return;
                  }
                  setDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="label">Available Slots</label>
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{slots.length ? `${slots.length} slots available` : "Select a date to load slots."}</p>
            </div>
            <button type="button" className="btn-primary w-full" disabled={!date || !slots.length} onClick={() => setOpenBooking(true)}>
              Continue to Pay
            </button>
          </div>
        </div>
      </section>

      <BookingModal open={openBooking} onClose={() => setOpenBooking(false)} doctor={doctor} date={date} slots={slots} onBooked={() => setSlots([])} />
      <Footer />
    </div>
  );
};

export default DoctorDetail;
