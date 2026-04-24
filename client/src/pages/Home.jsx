import { motion } from "framer-motion";
import { useEffect } from "react";
import { FiArrowRight, FiSearch, FiShield, FiStar, FiUserCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import DoctorCard from "../components/doctor/DoctorCard";
import { fetchBestDoctors } from "../redux/slices/doctorSlice";

const specializations = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Orthopedic", "Gynecologist"];

const Home = () => {
  const dispatch = useDispatch();
  const { bestDoctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchBestDoctors());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <section className="bg-hero pb-20 pt-16">
        <div className="container-app grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-700 shadow-soft">
              Care, booked beautifully
            </span>
            <div className="space-y-5">
              <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
                Find the right doctor and lock your slot in minutes.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Search trusted specialists, pay securely, get confirmations instantly, and keep every appointment in one place.
              </p>
            </div>
            <div className="card flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-11" placeholder="Search doctor or specialization" />
              </div>
              <Link to="/doctors" className="btn-primary">
                Explore Doctors <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["250+", "Doctors"],
                ["12k+", "Patients"],
                ["30k+", "Bookings"],
                ["18+", "Cities"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl bg-white/80 p-4 shadow-soft">
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <img
              src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80"
              alt="Doctors"
              className="h-[580px] w-full rounded-[2rem] object-cover shadow-soft"
            />
          </motion.div>
        </div>
      </section>

      <section className="container-app py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Popular Specializations</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {specializations.map((spec) => (
            <Link key={spec} to={`/doctors?spec=${spec}`} className="card text-center transition hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                <FiUserCheck />
              </div>
              <h3 className="font-bold">{spec}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Best Doctors</h2>
            <p className="mt-2 text-slate-500">Top-rated doctors patients keep coming back to.</p>
          </div>
          <Link to="/doctors" className="btn-secondary">
            View All
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bestDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      <section className="container-app py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Search & compare", "Filter doctors by city, price, rating, and specialty."],
            ["Pick a time slot", "Choose a date and see live availability without double booking."],
            ["Book & get confirmed", "Pay securely and receive instant appointment confirmation."],
          ].map(([title, text], index) => (
            <div key={title} className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-xl font-bold text-brand-700">{index + 1}</div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [FiShield, "Secure Booking", "JWT sessions, protected routes, and payment confirmation built in."],
            [FiStar, "Reviewed Experts", "Patients can only review after completed appointments."],
            [FiUserCheck, "Admin Approval", "Every doctor profile is vetted before going live."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="card">
              <Icon className="text-3xl text-brand-700" />
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
