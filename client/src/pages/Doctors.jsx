import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import DoctorCard from "../components/doctor/DoctorCard";
import { fetchDoctors } from "../redux/slices/doctorSlice";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctors);
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

  useEffect(() => {
    dispatch(fetchDoctors(filters));
  }, [dispatch, filters]);

  const paginatedDoctors = useMemo(() => doctors.slice((page - 1) * perPage, page * perPage), [doctors, page]);
  const totalPages = Math.max(1, Math.ceil(doctors.length / perPage));

  return (
    <div>
      <Navbar />
      <section className="container-app py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Find Your Doctor</h1>
          <p className="mt-3 text-slate-500">Search, filter, and compare verified specialists across cities and budgets.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[290px,1fr]">
          <aside className="card h-fit space-y-4">
            {["q", "city", "spec", "minFee", "maxFee", "rating"].map((field) => (
              <div key={field}>
                <label className="label capitalize">{field}</label>
                <input className="input" value={filters[field]} onChange={(e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }))} />
              </div>
            ))}
          </aside>
          <div>
            {loading ? (
              <Loader text="Loading doctors..." />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button type="button" className="btn-secondary" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    Prev
                  </button>
                  <span className="text-sm font-semibold">
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
