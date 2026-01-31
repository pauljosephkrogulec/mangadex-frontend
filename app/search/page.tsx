'use client';

import { Search, Menu, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import UserAuth from '../components/UserAuth';
import Sidebar from '../components/Sidebar';
import MangaCard from '../components/MangaCard';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Manga, Tag } from '../types';

export default function TitlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(24); // Frontend default
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Initialize state from URL parameters
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    const tags = searchParams.get('tags');
    const perPage = searchParams.get('itemsPerPage');

    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (filter) setSelectedFilter(filter);
    if (tags) setSelectedTags(tags.split(','));
    if (perPage) setItemsPerPage(parseInt(perPage));
  }, [searchParams]);

  // Update URL when state changes
  const updateURL = useCallback(
    (updates: Record<string, string | number | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          } else {
            params.delete(key);
          }
        } else {
          params.set(key, value.toString());
        }
      });

      const newURL = `/search${params.toString() ? '?' + params.toString() : ''}`;
      router.push(newURL, { scroll: false });
    },
    [searchParams, router]
  );

  const fetchManga = useCallback(
    async (page: number, reset: boolean = false) => {
      if (reset) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      try {
        const queryParams = new URLSearchParams({
          state: 'published',
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString(),
          'order[updatedAt]': 'desc',
          groups: 'manga:read:collection',
        });

        // Add search filter
        if (searchTerm) {
          queryParams.set('title', searchTerm);
        }

        // Add status/content rating filter
        if (selectedFilter === 'ongoing') {
          queryParams.set('status', 'ongoing');
        } else if (selectedFilter === 'completed') {
          queryParams.set('status', 'completed');
        } else if (selectedFilter === 'safe') {
          queryParams.set('contentRating', 'safe');
        }

        // Add tag filters
        selectedTags.forEach((tagId) => {
          queryParams.append('tags.id', tagId);
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/mangas?${queryParams.toString()}`
        );

        if (response.ok) {
          const data = await response.json();
          const mangaRaw = data['member'] || data['hydra:member'] || [];

          // Process manga data
          const mangaWithCoverArts = mangaRaw.map((manga: Manga) => {
            const mangaWithCovers = { ...manga } as Manga;
            if (manga.coverArts && manga.coverArts.length > 0) {
              mangaWithCovers.coverArts = [
                {
                  id: manga.coverArts[0].id,
                  fileName:
                    'https://mangadex.org/covers/' + manga.mainCoverArtFilename,
                  manga: manga.id,
                },
              ];
            }
            mangaWithCovers.tags = manga.tags || [];
            mangaWithCovers.followed = false;
            return mangaWithCovers;
          });

          setMangaList(mangaWithCoverArts);

          // Set pagination info from API response
          // API Platform returns pagination info in 'view'
          const view = data['view'] || {};

          // Extract pagination info from view
          let currentPageCount = page;
          let totalPagesCount = 1;
          let totalItemsCount = mangaRaw.length;

          // Parse current page from view @id
          if (view['@id']) {
            const urlParams = new URLSearchParams(
              view['@id'].split('?')[1] || ''
            );
            currentPageCount =
              parseInt(urlParams.get('page') as string) || page;
          }

          // Calculate total pages from last page link
          if (view['last']) {
            const lastPageUrl = view['last'];
            const urlParams = new URLSearchParams(
              lastPageUrl.split('?')[1] || ''
            );
            totalPagesCount = parseInt(urlParams.get('page') as string) || 1;
            totalItemsCount = data['totalItems'];
          }

          setTotalItems(totalItemsCount);
          setTotalPages(totalPagesCount);
          setCurrentPage(currentPageCount);

          console.log('Pagination info:', {
            totalItems: totalItemsCount,
            currentPage: currentPageCount,
            totalPages: totalPagesCount,
            itemsPerPage: itemsPerPage,
            responseLength: mangaRaw.length,
            view: view,
          });
        }
      } catch (error) {
        console.error('Failed to fetch manga:', error);
      } finally {
        setLoading(false);
        setPaginationLoading(false);
      }
    },
    [itemsPerPage, searchTerm, selectedFilter, selectedTags]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch manga data with pagination
        await fetchManga(currentPage, true);

        // Fetch all tags data (handle pagination)
        let allTags: Tag[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const tagsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/tags?itemsPerPage=200&page=${page}`
          );

          if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            const tagsRaw = tagsData['member'] || [];
            allTags = [...allTags, ...tagsRaw];

            // Check if there are more pages
            hasMore = tagsData['view']?.['next'] && tagsRaw.length > 0;
            page++;
          } else {
            hasMore = false;
          }
        }

        setAvailableTags(allTags);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, fetchManga]); // Add currentPage and fetchManga dependencies

  // Refetch manga when search parameters change
  useEffect(() => {
    fetchManga(1, true);
    updateURL({
      page: 1,
      search: searchTerm,
      filter: selectedFilter,
      tags: selectedTags,
      itemsPerPage: itemsPerPage,
    });
  }, [
    searchTerm,
    selectedFilter,
    selectedTags,
    itemsPerPage,
    fetchManga,
    updateURL,
  ]);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !paginationLoading) {
      fetchManga(newPage, false);
      setCurrentPage(newPage);
      updateURL({ page: newPage });
    }
  };

  const getTagName = (tag: Tag) => {
    return (
      tag.name['en'] ||
      tag.name['ja'] ||
      Object.values(tag.name)[0] ||
      'Unknown'
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Navigation Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Navigation Links */}
              <div className="flex-1"></div>

              {/* Center Search Bar */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateURL({
                          page: 1,
                          search: searchTerm,
                          filter: selectedFilter,
                          tags: selectedTags,
                          itemsPerPage: itemsPerPage,
                        });
                      }
                    }}
                    className="w-96 pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex-1 flex justify-end items-center space-x-4">
                {/* User menu */}
                <UserAuth />

                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-700"
                >
                  <Menu className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Browse Titles</h1>
                <p className="text-gray-400 mt-1">
                  {totalItems} {totalItems === 1 ? 'title' : 'titles'} available
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Titles</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="safe">Safe Only</option>
                </select>

                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                  <option value={96}>96 per page</option>
                </select>

                <button
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedTags.length > 0
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tag Filter Panel */}
        {showTagFilter && (
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium">Filter by Tags</h3>
                <div className="flex items-center gap-2">
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-orange-400 hover:text-orange-300 text-sm"
                    >
                      Clear All
                    </button>
                  )}
                  {availableTags.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      No tags available
                    </span>
                  )}
                </div>
              </div>

              {/* Tag Groups */}
              {['content', 'format', 'genre', 'theme'].map((group) => {
                const groupTags = availableTags.filter(
                  (tag) => tag.tagGroup === group
                );
                if (groupTags.length === 0) return null;

                return (
                  <div key={group} className="mb-4">
                    <h4 className="text-gray-400 text-sm font-medium mb-2 capitalize">
                      {group} ({groupTags.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag.id)
                                ? prev.filter((id) => id !== tag.id)
                                : [...prev, tag.id]
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag.id)
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {getTagName(tag)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Show ungrouped tags if any */}
              {(() => {
                const ungroupedTags = availableTags.filter(
                  (tag) =>
                    !['content', 'format', 'genre', 'theme'].includes(
                      tag.tagGroup
                    )
                );
                if (ungroupedTags.length > 0) {
                  return (
                    <div className="mb-4">
                      <h4 className="text-gray-400 text-sm font-medium mb-2">
                        Other ({ungroupedTags.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ungroupedTags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => {
                              setSelectedTags((prev) =>
                                prev.includes(tag.id)
                                  ? prev.filter((id) => id !== tag.id)
                                  : [...prev, tag.id]
                              );
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              selectedTags.includes(tag.id)
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {getTagName(tag)}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* Manga Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          ) : mangaList.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {mangaList.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || paginationLoading}
                      className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={paginationLoading}
                              className={`px-3 py-1 rounded transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-orange-600 text-white'
                                  : 'hover:bg-gray-700 text-gray-300'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || paginationLoading}
                      className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Page Info */}
              <div className="mt-4 text-center text-gray-400 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                {totalItems} titles
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No titles found
              </h3>
              <p className="text-gray-400">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Check back later for new releases'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
