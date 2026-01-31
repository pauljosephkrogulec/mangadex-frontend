'use client';

interface ContentRatingBadgeProps {
  rating: string;
  className?: string;
}

export default function ContentRatingBadge({
  rating,
  className = '',
}: ContentRatingBadgeProps) {
  const getContentRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'safe':
        return 'bg-green-500';
      case 'suggestive':
        return 'bg-yellow-500';
      case 'erotica':
        return 'bg-orange-500';
      case 'pornographic':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold text-white ${getContentRatingColor(rating)} ${className}`}
    >
      {rating.toUpperCase()}
    </span>
  );
}
