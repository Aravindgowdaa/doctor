import { FiStar } from "react-icons/fi";

import { formatDate } from "../../utils/helpers";

const ReviewCard = ({ review }) => (
  <div className="rounded-3xl border border-white/10 bg-[#101a31]/95 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-white">{review.patient?.name}</p>
        <p className="text-xs text-white/55">{formatDate(review.created_at)}</p>
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-amber-300">
        <FiStar />
        {review.rating}
      </div>
    </div>
    <p className="mt-3 text-sm leading-7 text-white/72">{review.comment}</p>
  </div>
);

export default ReviewCard;
