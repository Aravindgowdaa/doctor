import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import BookingModal from "../components/appointment/BookingModal";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import ReviewCard from "../components/doctor/ReviewCard";
import { fetchDoctorDetail } from "../redux/slices/doctorSlice";
import axiosInstance from "../utils/axiosInstance";
import { formatCurrency, getDoctorAvatarUrl } from "../utils/helpers";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [slotsByDate, setSlotsByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctorDetail(id));
    axiosInstance.get(`/reviews/doctor/${id}`).then(({ data }) => setReviews(data.data.reviews)).catch(() => {});
  }, [dispatch, id]);

  const blockedDates = useMemo(() => new Set((doctor?.blocked_dates || []).map((item) => item.date)), [doctor]);
  const selectedDateSlots = useMemo(() => {
    const rawSlots = slotsByDate.find((entry) => entry.date === selectedDate)?.slots || [];
    return Array.from(new Set(rawSlots)).sort((left, right) => left.localeCompare(right));
  }, [slotsByDate, selectedDate]);
  const hasAnySlots = useMemo(() => slotsByDate.some((entry) => entry.slots.length), [slotsByDate]);
  const isPatient = user?.role === "patient";

  useEffect(() => {
    if (!doctor) return;
    const loadUpcomingSlots = async () => {
      try {
        const today = new Date();
        const upcomingDates = [];
        for (let index = 0; index < 14; index += 1) {
          const d = new Date(today);
          d.setDate(today.getDate() + index);
          const dateValue = d.toISOString().split("T")[0];
          if (!blockedDates.has(dateValue)) {
            upcomingDates.push(dateValue);
          }
        }

        const responses = await Promise.all(
          upcomingDates.map((dateValue) =>
            axiosInstance
              .get(`/appointments/${doctor.id}/slots`, { params: { date: dateValue } })
              .then(({ data }) => {
                const normalizedSlots = Array.from(new Set(data?.data?.slots || [])).sort((left, right) => left.localeCompare(right));
                return { date: dateValue, slots: normalizedSlots };
              })
              .catch(() => ({ date: dateValue, slots: [] }))
          )
        );

        setSlotsByDate(responses);
        const firstDateWithSlots = responses.find((entry) => entry.slots.length)?.date || "";
        setSelectedDate(firstDateWithSlots);
        setSelectedSlot("");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch slots");
      }
    };
    loadUpcomingSlots();
  }, [doctor, blockedDates]);

  if (loading || !doctor) return <Loader text="Loading doctor profile..." />;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="container-app py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-8">
            <div className="grid gap-8 rounded-3xl border border-white/10 bg-[#0b1220]/95 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:grid-cols-[240px,1fr]">
              <img
                src={getDoctorAvatarUrl(doctor)}
                alt={doctor.user?.name}
                className="h-72 w-full rounded-3xl object-cover"
              />
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white">Dr. {doctor.user?.name}</h1>
                    <p className="mt-2 text-lg font-semibold text-brand-300">{doctor.specialization}</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-amber-300">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <FiStar />
                      {doctor.average_rating} ({doctor.total_reviews} reviews)
                    </span>
                  </div>
                </div>
                <p className="mt-5 leading-8 text-white/68">{doctor.bio}</p>
                <div className="mt-6 grid gap-4 text-sm text-white/72 md:grid-cols-2">
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

            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit space-y-5 rounded-3xl border border-white/10 bg-[#0b1220]/95 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <h2 className="text-2xl font-bold text-white">Book Consultation</h2>
            <div>
              <label className="label text-white/75">Available Slots</label>
              {!hasAnySlots ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                  No slots available in the next 14 days.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {slotsByDate
                      .filter((entry) => entry.slots.length)
                      .map((entry) => (
                        <button
                          key={entry.date}
                          type="button"
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            selectedDate === entry.date
                              ? "border-brand-500 bg-brand-600 text-white"
                              : "border-white/10 bg-white/5 text-white/70"
                          }`}
                          onClick={() => {
                            setSelectedDate(entry.date);
                            setSelectedSlot("");
                          }}
                        >
                          {new Date(entry.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                        </button>
                      ))}
                  </div>
                  <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-scroll pr-1 sm:grid-cols-3">
                    {selectedDateSlots.map((slot) => (
                      <button
                        key={`${selectedDate}-${slot}`}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`h-10 rounded-xl border px-3 py-2 text-sm font-semibold leading-none ${
                          selectedSlot === slot
                            ? "border-brand-500 bg-brand-600 text-white"
                            : "border-white/10 bg-white/5 text-white/75"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {selectedDate && selectedSlot ? (
                    <p className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-sm text-white/90">
                      Selected: {new Date(selectedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} at {selectedSlot}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
            {isPatient ? (
              <button
                type="button"
                className="btn-primary w-full"
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setOpenBooking(true)}
              >
                Continue to Pay
              </button>
            ) : (
              <button type="button" className="btn-secondary w-full" onClick={() => navigate("/login")}>
                Login as Patient to Continue
              </button>
            )}
          </div>
        </div>
      </section>

      <BookingModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        doctor={doctor}
        date={selectedDate}
        slots={selectedDateSlots}
        initialSlot={selectedSlot}
        onBooked={() => {
          setSelectedSlot("");
          setSlotsByDate((prev) =>
            prev.map((entry) =>
              entry.date === selectedDate ? { ...entry, slots: entry.slots.filter((item) => item !== selectedSlot) } : entry
            )
          );
        }}
      />
      <Footer />
    </div>
  );
};

export default DoctorDetail;
