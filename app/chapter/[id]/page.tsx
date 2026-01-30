'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Calendar,
  User
} from 'lucide-react';
import UserAuth from '../../components/UserAuth';
import { Chapter } from '../../types';


export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);

        // Fetch chapter details
        const chapterResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/chapters/${id}`);
        if (!chapterResponse.ok) {
          throw new Error('Failed to fetch chapter details');
        }
        const chapterData = await chapterResponse.json();
        setChapter(chapterData);

        // Fetch chapter pages
        const pagesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/chapters/${id}`);
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          setPages(pagesData.pagesData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChapterData();
    }
  }, [id]);

  const getDisplayTitle = (title: { [key: string]: string } | undefined) => {
    if (!title || typeof title !== 'object') return 'Untitled';
    return title['en'] || title['ja'] || Object.values(title)[0] || 'Untitled';
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNextPage();
    if (e.key === 'ArrowLeft') goToPreviousPage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-400 mb-4">{error || 'Chapter not found'}</p>
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
  console.log(chapter.manga)
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {chapter.manga && (
                <Link 
                  href={`/manga/${chapter.manga.id}`}
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Manga
                </Link>
              )}
              <div>
                <h1 className="text-lg font-semibold">
                  {chapter.manga ? getDisplayTitle(chapter.manga.title) : 'Unknown Manga'}
                </h1>
                <p className="text-sm text-gray-400">
                  {chapter.volume && `Vol. ${chapter.volume} `}
                  Ch. {chapter.chapter}
                  {chapter.title && ` - ${chapter.title}`}
                </p>
              </div>
            </div>
            <UserAuth />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Chapter Info */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            {chapter.scanlator && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{chapter.scanlator}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-gray-600 rounded text-xs">
                {chapter.translatedLanguage?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        {pages.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {pages.length}
              </span>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === pages.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Page Display */}
        {pages.length > 0 ? (
          <div className="flex justify-center">
            <div className="relative max-w-4xl">
              <img
                src={pages[currentPage] || ''}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No pages available for this chapter</p>
          </div>
        )}

        {/* Page Navigation at bottom */}
        {pages.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {pages.length}
              </span>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === pages.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Keyboard navigation hint */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Use arrow keys to navigate between pages</p>
        </div>
      </main>
    </div>
  );
}
