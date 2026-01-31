'use client';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({
  status,
  className = '',
}: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-600';
      case 'hiatus':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(status)} ${className}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
