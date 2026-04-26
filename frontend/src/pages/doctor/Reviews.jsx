import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/common/DashboardLayout";
import ReviewCard from "../../components/doctor/ReviewCard";
import axiosInstance from "../../utils/axiosInstance";

const DoctorReviews = () => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/doctors/profile")
      .then(({ data }) => {
        const doctor = data.data.doctor;
        return axiosInstance.get(`/reviews/doctor/${doctor.id}`);
      })
      .then((response) => setReviews(response?.data?.data?.reviews || []))
      .catch(() => {});
  }, [user]);

  return (
    <DashboardLayout role="doctor" title="Patient Reviews">
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DoctorReviews;
