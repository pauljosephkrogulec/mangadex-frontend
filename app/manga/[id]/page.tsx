'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  Heart, 
  Star,
  Users,
  Globe,
  Clock
} from 'lucide-react';
import UserAuth from '../../components/UserAuth';

interface Manga {
  id: string;
  title: { [key: string]: string };
  description: { [key: string]: string };
  status: string;
  year?: number;
  contentRating: string;
  createdAt: string;
  updatedAt: string;
  coverArts?: CoverArt[];
  lastChapter?: string;
  mainCoverArtFilename?: string;
  tags?: Tag[];
  authors?: Author[];
  artists?: Author[];
  followed?: boolean;
  rating?: {
    average: number;
    count: number;
  };
  statistics?: {
    follows: number;
    views: number;
  };
  availableTranslatedLanguages?: string[];
}

interface CoverArt {
  id: string;
  fileName: string;
  manga: string;
  volume?: string;
}

interface Tag {
  id: string;
  name: { [key: string]: string };
  tagGroup: string;
}

interface Author {
  id: string;
  name: string | { [key: string]: string };
  role: string;
}

interface Chapter {
  id: string;
  chapter: string;
  title?: string;
  volume?: string;
  pages: number;
  publishAt: string;
  translatedLanguage: string;
  scanlator?: string;
}

export default function MangaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        setLoading(true);

        // Fetch manga details
        const mangaResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/mangas/${id}`);
        if (!mangaResponse.ok) {
          throw new Error('Failed to fetch manga details');
        }
        const mangaData = await mangaResponse.json();
        setManga(mangaData);
        // Fetch chapters
        const chaptersUrl = selectedLanguage === 'all' 
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/chapters?manga.id=${id}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/chapters?manga.id=${id}&translatedLanguage=${selectedLanguage}`;
        
        const chaptersResponse = await fetch(chaptersUrl);
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json();
          setChapters(chaptersData['member'] || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMangaData();
    }
  }, [id, selectedLanguage]);

  const getDisplayTitle = (title: { [key: string]: string } | undefined) => {
    if (!title || typeof title !== 'object') return 'Untitled';
    return title['en'] || title['ja'] || Object.values(title)[0] || 'Untitled';
  };

  const getDisplayDescription = (description: { [key: string]: string } | undefined) => {
    if (!description || typeof description !== 'object') return 'No description available';
    return description['en'] || description['ja'] || Object.values(description)[0] || 'No description available';
  };

  const getAuthorName = (name: string | { [key: string]: string } | undefined) => {
    if (!name) return 'Unknown';
    if (typeof name === 'string') return name;
    if (typeof name === 'object') {
      return name['en'] || name['ja'] || Object.values(name)[0] || 'Unknown';
    }
    return 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getContentRatingColor = (rating: string) => {
    switch (rating) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 h-96 bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-400 mb-4">{error || 'Manga not found'}</p>
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }
  console.log(chapters)
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Search
            </Link>
            <UserAuth />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cover and Basic Info */}
          <div className="w-full lg:w-64">
            <div className="sticky top-8">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-600 to-gray-700">
                  {manga.coverArts && manga.coverArts.length > 0 ? (
                    <img
                      src={'https://mangadex.org/covers/' + manga.mainCoverArtFilename}
                      alt={getDisplayTitle(manga.title)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Start Reading
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" />
                  {manga.followed ? 'Unfollow' : 'Follow'}
                </button>
              </div>

              {/* Statistics */}
              {manga.statistics && (
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Follows:</span>
                    <span>{manga.statistics.follows.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Views:</span>
                    <span>{manga.statistics.views.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Title and Badges */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{getDisplayTitle(manga.title)}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(manga.status)}`}>
                  {manga.status.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getContentRatingColor(manga.contentRating)}`}>
                  {manga.contentRating.toUpperCase()}
                </span>
                {manga.year && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 text-white">
                    {manga.year}
                  </span>
                )}
              </div>

              {/* Rating */}
              {manga.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{manga.rating.average.toFixed(2)}</span>
                  </div>
                  <span className="text-gray-400">({manga.rating.count.toLocaleString()} ratings)</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {getDisplayDescription(manga.description)}
                </p>
              </div>
            </div>

            {/* Tags */}
            {manga.tags && manga.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {manga.tags.map((tag) => {
                    const tagName = tag.name.en || tag.name.ja || (tag.name ? Object.values(tag.name)[0] : 'Unknown');
                    return (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                      >
                        {tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Authors/Artists */}
            {(manga.authors?.length || manga.artists?.length) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Authors & Artists</h2>
                <div className="space-y-2">
                  {manga.authors?.map((author) => (
                    <div key={author.id} className="text-gray-300">
                      <span className="font-medium">{getAuthorName(author.name)}</span>
                      <span className="text-gray-500 ml-2">(Author)</span>
                    </div>
                  ))}
                  {manga.artists?.map((artist) => (
                    <div key={artist.id} className="text-gray-300">
                      <span className="font-medium">{getAuthorName(artist.name)}</span>
                      <span className="text-gray-500 ml-2">(Artist)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Chapters</h2>
                {manga.availableTranslatedLanguages && manga.availableTranslatedLanguages.length > 0 && (
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Languages</option>
                    {manga.availableTranslatedLanguages.map((lang: string) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {chapters.length > 0 ? (
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/manga/${id}/chapter/${chapter.id}`}
                      className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {chapter.volume && `Vol. ${chapter.volume} `}
                            Ch. {chapter.chapter}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {chapter.pages} pages
                            {chapter.scanlator && ` • ${chapter.scanlator}`}
                            <span className="ml-2 px-2 py-1 bg-gray-600 rounded text-xs">
                              {chapter.translatedLanguage?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          {new Date(chapter.publishAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No chapters available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
