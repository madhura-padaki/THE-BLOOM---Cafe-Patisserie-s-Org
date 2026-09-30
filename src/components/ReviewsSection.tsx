import React, { useState } from 'react';
import { Review } from '../types/index.ts';
import { Star, MessageSquarePlus, ExternalLink, X, Check } from 'lucide-react';
import { submitReview } from '../services/api.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewAdded }) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const googleListingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'THE BLOOM - Cafe & Patisserie, Jayanagar Bengaluru'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      setError('Please provide your name and your thoughts.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const newRev = await submitReview({ author, rating, comment });
      onReviewAdded(newRev);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddModal(false);
        setAuthor('');
        setComment('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#F8F4EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
              <span className="w-8 h-[1px] bg-[#8FA58A]" />
              <span>Guest Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal">
              Words From Our Visitors
            </h2>
            <p className="text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
              Memorable moments shared by guests who spent slow afternoons and warm evenings at THE BLOOM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#8FA58A]" />
              <span>Leave a Review</span>
            </button>

            <a
              href={googleListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#304A3A] text-white hover:bg-[#22372A] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>See More Reviews</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </a>
          </div>
        </div>

        {/* Rating Summary Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-white/70 border border-[#D8C8B4]/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-serif text-3xl font-bold text-[#304A3A]">4.9</div>
            <div>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-[#4A3428]/70">
                Based on verified visitor feedback &amp; Google Reviews
              </span>
            </div>
          </div>
          <div className="text-xs text-[#4A3428]/80">
            Jayanagar, Bengaluru · Botanical Cafe &amp; Patisserie
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white/90 p-6 rounded-2xl border border-[#D8C8B4]/60 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#4A3428]/50 font-light">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#4A3428]/85 leading-relaxed font-light italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#D8C8B4]/30 flex items-center justify-between text-xs">
                <span className="font-medium text-[#304A3A]">{rev.author}</span>
                {rev.source && (
                  <span className="text-[10px] text-[#4A3428]/50 uppercase tracking-wider">
                    {rev.source}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F8F4EC] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#D8C8B4] relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3428] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-2xl text-[#304A3A] mb-2 font-medium">
              Share Your Experience
            </h3>
            <p className="text-xs text-[#4A3428]/70 mb-5 font-light">
              We appreciate hearing about your visit to THE BLOOM.
            </p>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2 text-emerald-800">
                <Check className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-serif text-lg font-medium">Thank you for your review!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Ramesh K."
                    className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-xl text-xs text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A] mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`p-2 rounded-lg border text-xs font-medium cursor-pointer ${
                          rating >= num
                            ? 'bg-amber-100 border-amber-400 text-amber-800'
                            : 'bg-white border-[#D8C8B4] text-[#4A3428]/50'
                        }`}
                      >
                        ★ {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#304A3A] mb-1">
                    Your Feedback / Highlights
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love? Favorite dessert, coffee, or seating area..."
                    className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-xl text-xs text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-[#D8C8B4] text-xs font-medium text-[#4A3428]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-[#304A3A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A]"
                  >
                    {isSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
