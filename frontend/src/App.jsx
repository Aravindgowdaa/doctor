import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminAppointments from "./pages/admin/Appointments";
import AllDoctors from "./pages/admin/AllDoctors";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatients from "./pages/admin/Patients";
import DoctorDetail from "./pages/DoctorDetail";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorAvailability from "./pages/doctor/Availability";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorReviews from "./pages/doctor/Reviews";
import Doctors from "./pages/Doctors";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NearbyDoctors from "./pages/NearbyDoctors";
import PatientAppointments from "./pages/patient/Appointments";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientProfile from "./pages/patient/Profile";
import Signup from "./pages/Signup";
import { fetchMe } from "./redux/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/nearby-doctors" element={<NearbyDoctors />} />
      <Route path="/doctors/:id" element={<DoctorDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute role="patient"><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute role="patient"><PatientProfile /></ProtectedRoute>} />

      <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute role="doctor"><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/availability" element={<ProtectedRoute role="doctor"><DoctorAvailability /></ProtectedRoute>} />
      <Route path="/doctor/profile" element={<ProtectedRoute role="doctor"><DoctorProfile /></ProtectedRoute>} />
      <Route path="/doctor/reviews" element={<ProtectedRoute role="doctor"><DoctorReviews /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute role="admin"><AdminDoctors /></ProtectedRoute>} />
      <Route path="/admin/all-doctors" element={<ProtectedRoute role="admin"><AllDoctors /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute role="admin"><AdminPatients /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
