import React, { useState } from 'react';
import { Star, MessageSquare, Check, ShieldCheck, CornerDownRight } from 'lucide-react';
import { Review, Language, Dictionary } from '../types';

interface ReviewSectionProps {
  reviews: Review[];
  currentLanguage: Language;
  dict: Dictionary;
  onAddReview: (review: Review) => void;
}

export default function ReviewSection({
  reviews,
  currentLanguage,
  dict,
  onAddReview
}: ReviewSectionProps) {
  const [authorName, setAuthorName] = useState('');
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0;

  // Compute rating metrics count
  const starCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
  reviews.forEach(r => {
    const idx = Math.floor(r.rating) - 1;
    if (idx >= 0 && idx < 5) {
      starCounts[idx]++;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !reviewComment) return;

    const newReview: Review = {
      id: "REV-" + Math.floor(1000 + Math.random() * 9000),
      author: authorName,
      rating: ratingVal,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      language: currentLanguage
    };

    onAddReview(newReview);
    setShowSuccessAlert(true);
    
    // Reset Form
    setAuthorName('');
    setRatingVal(5);
    setReviewComment('');

    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white border-t border-gray-100" id="reviews-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Metric Summary Panel & Review Form */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 font-bold block mb-1">Ratings Summary</span>
            <h3 className="font-sans font-bold text-2xl text-gray-900 leading-tight">
              {dict.customerReviews}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              We average a stunning high score from BGC and Makati foodies. Here is what real clients think about our culinary execution.
            </p>
          </div>

          {/* Average Rating Stats Row */}
          <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="text-center">
              <span className="font-mono font-extrabold text-4xl text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 block font-semibold mt-1">out of 5.0</span>
            </div>
            
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star - 1] || 0;
                const percentage = (count / reviews.length) * 100 || 0;

                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-500 font-semibold text-right">{star}</span>
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-6 text-gray-400 font-medium text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-xs p-6 rounded-2xl space-y-4">
            <h4 className="font-sans font-bold text-sm text-gray-900 border-l-2 border-emerald-600 pl-2">
              {dict.writeReview}
            </h4>

            {showSuccessAlert && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-semibold">
                <Check className="h-4.5 w-4.5" />
                <span>{dict.reviewsSuccess}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Author Name */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.yourName}</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                />
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{dict.yourRating}</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= ratingVal
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.yourReview}</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your dining or delivery experience..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              {dict.submitReview}
            </button>
          </form>
        </div>

        {/* Reviews Feed Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="font-sans font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-gray-400" />
              <span>Reviews Queue ({reviews.length})</span>
            </span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Filter: Latest first</span>
          </div>

          <div className="space-y-5 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-gray-100 p-5 rounded-2xl space-y-3.5 hover:shadow-xs transition-shadow"
              >
                {/* Author row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{rev.author}</span>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-800">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        <span>Verified Eater</span>
                      </span>
                    </div>
                    
                    <span className="text-[10px] text-gray-400 font-semibold block">{rev.date}</span>
                  </div>

                  {/* Stars Display */}
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < rev.rating ? 'fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Message */}
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                {/* Language indicator flag */}
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider font-semibold text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded-md bg-gray-50">
                    Lang: {rev.language.toUpperCase()}
                  </span>
                </div>

                {/* Owner Reply */}
                {rev.reply && (
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex gap-2.5 items-start mt-2 ml-4">
                    <CornerDownRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[10px] text-emerald-800 uppercase tracking-wider block">{dict.ownerReply}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "{rev.reply}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
