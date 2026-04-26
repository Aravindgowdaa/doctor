import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import DoctorCard from "../components/doctor/DoctorCard";
import { fetchBestDoctors, fetchDoctors } from "../redux/slices/doctorSlice";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, bestDoctors, loading, error } = useSelector((state) => state.doctors);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    spec: searchParams.get("spec") || "",
    minFee: "",
    maxFee: "",
    rating: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filterFields = [
    { key: "q", label: "Search", placeholder: "e.g. skin, heart, child" },
    { key: "city", label: "City", placeholder: "e.g. Mumbai" },
    { key: "spec", label: "Speciality", placeholder: "e.g. Dentist" },
    { key: "minFee", label: "Min Fee", placeholder: "e.g. 500", type: "number" },
    { key: "maxFee", label: "Max Fee", placeholder: "e.g. 1500", type: "number" },
    { key: "rating", label: "Rating", placeholder: "e.g. 4+", type: "number" },
  ];

  useEffect(() => {
    dispatch(fetchDoctors(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchBestDoctors());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const sourceDoctors = doctors.length ? doctors : bestDoctors;
  const paginatedDoctors = useMemo(() => sourceDoctors.slice((page - 1) * perPage, page * perPage), [sourceDoctors, page]);
  const totalPages = Math.max(1, Math.ceil(sourceDoctors.length / perPage));

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="container-app py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Find Your Doctor</h1>
          <p className="mt-3 text-white/60">Search by name, city, speciality, budget, or rating to find the right doctor faster.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[290px,1fr]">
          <aside className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <p className="mb-4 text-sm text-white/55">Use these easy search options to narrow the list.</p>
            <button
              type="button"
              className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
              onClick={() =>
                setFilters({
                  q: "",
                  city: "",
                  spec: "",
                  minFee: "",
                  maxFee: "",
                  rating: "",
                })
              }
            >
              Clear filters
            </button>
            {filterFields.map((field) => (
              <div key={field.key} className="mb-4 last:mb-0">
                <label className="label text-white/75">{field.label}</label>
                <input
                  className="input"
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={filters[field.key]}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </aside>
          <div>
            {loading ? (
              <Loader text="Loading doctors..." />
            ) : (
              <>
                {error && (
                  <div className="mb-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                    {error}
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-[#0b1220]/95 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
                  <div>
                    <p className="text-sm font-semibold text-white/50">Showing</p>
                    <h2 className="text-2xl font-bold text-white">{sourceDoctors.length} doctors</h2>
                  </div>
                  <p className="text-sm text-white/45">Page {page} of {totalPages}</p>
                </div>
                {paginatedDoctors.length ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedDoctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-8 text-center text-white/65 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                    <h3 className="text-2xl font-bold text-white">No doctors found</h3>
                    <p className="mt-3 text-sm text-white/55">
                      Try clearing the filters or searching with a different city, speciality, or rating.
                    </p>
                  </div>
                )}
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button type="button" className="btn-secondary" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    Prev
                  </button>
                  <span className="text-sm font-semibold text-white/70">
                    {page} / {totalPages}
                  </span>
                  <button type="button" className="btn-secondary" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Doctors;
