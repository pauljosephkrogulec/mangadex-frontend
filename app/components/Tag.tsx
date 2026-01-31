'use client';

import { Tag as TagType } from '../types';

interface TagProps {
  tag: TagType;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function Tag({
  tag,
  className = '',
  clickable = false,
  onClick,
}: TagProps) {
  const getTagName = (name: { [key: string]: string } | undefined) => {
    if (!name || typeof name !== 'object') return 'Unknown';
    return name['en'] || name['ja'] || Object.values(name)[0] || 'Unknown';
  };

  const baseClasses = 'px-3 py-1 rounded-full text-sm transition-colors';
  const colorClasses = clickable
    ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
    : 'bg-gray-700 hover:bg-gray-600';

  return (
    <span
      className={`${baseClasses} ${colorClasses} ${className}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {getTagName(tag.name)}
    </span>
  );
}
