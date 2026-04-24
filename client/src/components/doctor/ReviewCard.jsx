import { FiStar } from "react-icons/fi";

import { formatDate } from "../../utils/helpers";

const ReviewCard = ({ review }) => (
  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-slate-900">{review.patient?.name}</p>
        <p className="text-xs text-slate-500">{formatDate(review.created_at)}</p>
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
        <FiStar />
        {review.rating}
      </div>
    </div>
    <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
  </div>
);

export default ReviewCard;
