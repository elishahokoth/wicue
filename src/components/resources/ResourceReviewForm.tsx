import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Review } from './ResourceReview';
import { useAuth } from '../../contexts/AuthContext';
type ResourceReviewFormProps = {
  resourceId: string;
  initialReview?: Review;
  onSubmit: (review: Omit<Review, 'id' | 'date' | 'likes' | 'dislikes' | 'userLiked' | 'userDisliked'>) => void;
  onCancel?: () => void;
};
const ResourceReviewForm: React.FC<ResourceReviewFormProps> = ({
  resourceId,
  initialReview,
  onSubmit,
  onCancel
}) => {
  const {
    currentUser
  } = useAuth();
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    onSubmit({
      userId: currentUser.id,
      userName: currentUser.name,
      resourceId,
      rating,
      comment
    });
    // Reset form if not editing
    if (!initialReview) {
      setRating(0);
      setComment('');
    }
  };
  return <form onSubmit={handleSubmit} className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-blue-900 jungle:border-green-800 extra-dark:border-gray-800">
      <h3 className="text-md font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
        {initialReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-1">
          Rating
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="focus:outline-none">
              <Star className={`h-6 w-6 ${star <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-blue-700 jungle:text-green-700 extra-dark:text-gray-700'}`} />
            </button>)}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-1">
          Your Review
        </label>
        <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 text-sm" placeholder="Share your thoughts about this resource..." required />
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && <button type="button" onClick={onCancel} className="px-3 py-1.5 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
            Cancel
          </button>}
        <button type="submit" disabled={rating === 0 || comment.trim() === ''} className={`px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${rating === 0 || comment.trim() === '' ? 'bg-indigo-400 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-sky-600 cursor-not-allowed' : 'bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600'}`}>
          {initialReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>;
};
export default ResourceReviewForm;