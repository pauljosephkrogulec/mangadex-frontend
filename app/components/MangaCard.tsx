'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { MangaCardProps } from '../types';
import StatusBadge from './StatusBadge';
import ContentRatingBadge from './ContentRatingBadge';

export default function MangaCard({ manga, className = '' }: MangaCardProps) {
  const getDisplayTitle = (title: { [key: string]: string }) => {
    return title['en'] || title['ja'] || Object.values(title)[0] || 'Untitled';
  };

  return (
    <div className={`group relative ${className}`}>
      <Link href={`/manga/${manga.id}`} className="block cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3">
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-gray-500 group-hover:to-gray-600 transition-all">
            {manga.coverArts && manga.coverArts.length > 0 ? (
              <Image
                src={manga.coverArts[0].fileName}
                alt={getDisplayTitle(manga.title)}
                width={200}
                height={267}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove(
                    'hidden'
                  );
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          {manga.contentRating === 'safe' && (
            <ContentRatingBadge
              rating={manga.contentRating}
              className="absolute top-2 right-2"
            />
          )}
          <StatusBadge
            status={manga.status}
            className="absolute top-2 left-2"
          />
        </div>
        <h3
          className="font-medium text-white group-hover:text-orange-400 transition-colors overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {getDisplayTitle(manga.title)}
        </h3>
        <p className="text-sm text-gray-400">
          {manga.status === 'ongoing'
            ? 'Ongoing'
            : manga.status === 'completed'
              ? 'Completed'
              : manga.status}
          {manga.year && ` • ${manga.year}`}
        </p>
      </Link>
    </div>
  );
}
