import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export type Review = {
  id: string;
  userId: string;
  userName: string;
  resourceId: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  dislikes: number;
  userLiked?: string[]; // Array of user IDs who liked
  userDisliked?: string[]; // Array of user IDs who disliked
};
type ResourceReviewProps = {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onLike?: (reviewId: string) => void;
  onDislike?: (reviewId: string) => void;
};
const ResourceReview: React.FC<ResourceReviewProps> = ({
  review,
  onEdit,
  onDelete,
  onLike,
  onDislike
}) => {
  const {
    currentUser
  } = useAuth();
  const isOwnReview = currentUser?.id === review.userId;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const hasLiked = review.userLiked?.includes(currentUser?.id || '');
  const hasDisliked = review.userDisliked?.includes(currentUser?.id || '');
  return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-blue-900 jungle:border-green-800 extra-dark:border-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-blue-700 jungle:text-green-700 extra-dark:text-gray-700'}`} />)}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
            {review.userName}
          </span>
          <span className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
            {formatDate(review.date)}
          </span>
        </div>
        {isOwnReview && <div className="flex space-x-2">
            {onEdit && <button onClick={() => onEdit(review)} className="text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500 hover:text-indigo-500 dark:hover:text-blue-400 jungle:hover:text-green-400 extra-dark:hover:text-gray-400">
                <Edit className="h-4 w-4" />
              </button>}
            {onDelete && <button onClick={() => onDelete(review.id)} className="text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500 hover:text-red-500">
                <Trash className="h-4 w-4" />
              </button>}
          </div>}
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
        {review.comment}
      </p>
      <div className="mt-3 flex items-center space-x-4">
        <button onClick={() => onLike && onLike(review.id)} className={`flex items-center text-xs ${hasLiked ? 'text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400'}`}>
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          <span>{review.likes}</span>
        </button>
        <button onClick={() => onDislike && onDislike(review.id)} className={`flex items-center text-xs ${hasDisliked ? 'text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400'}`}>
          <ThumbsDown className="h-3.5 w-3.5 mr-1" />
          <span>{review.dislikes}</span>
        </button>
      </div>
    </div>;
};
export default ResourceReview;