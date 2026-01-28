'use client';

import { Search, Menu, Filter } from 'lucide-react';
import UserAuth from '../components/UserAuth';
import Sidebar from '../components/Sidebar';
import MangaCard from '../components/MangaCard';
import { useState, useEffect } from 'react';

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
  followed?: boolean;
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
  description: { [key: string]: string };
}

export default function TitlePage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch manga data
        const mangaResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/mangas?state=published&itemsPerPage=50&order[updatedAt]=desc&groups=manga:read:collection`
        );

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

        if (mangaResponse.ok) {
          const mangaData = await mangaResponse.json();
          const mangaRaw = mangaData['member'] || [];

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
            // Ensure tags are included - they might be in different format
            mangaWithCovers.tags = manga.tags || [];
            // Initialize followed status
            mangaWithCovers.followed = false;
            return mangaWithCovers;
          });

          setMangaList(mangaWithCoverArts);
          setAvailableTags(allTags);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDisplayTitle = (title: { [key: string]: string }) => {
    return title['en'] || title['ja'] || Object.values(title)[0] || 'Untitled';
  };

  const getTagName = (tag: Tag) => {
    return (
      tag.name['en'] ||
      tag.name['ja'] ||
      Object.values(tag.name)[0] ||
      'Unknown'
    );
  };

  const filteredManga = mangaList.filter((manga) => {
    const title = getDisplayTitle(manga.title).toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase());

    // Filter by status/content rating
    let matchesFilter = true;
    if (selectedFilter === 'ongoing')
      matchesFilter = manga.status === 'ongoing';
    else if (selectedFilter === 'completed')
      matchesFilter = manga.status === 'completed';
    else if (selectedFilter === 'safe')
      matchesFilter = manga.contentRating === 'safe';

    // Filter by tags
    let matchesTags = true;
    if (selectedTags.length > 0) {
      if (!manga.tags || manga.tags.length === 0) {
        matchesTags = false;
      } else {
        // Handle different tag formats
        const mangaTagIds = manga.tags.map((tag: any) => {
          if (typeof tag === 'string') return tag;
          if (typeof tag === 'object' && tag.id) return tag.id;
          return String(tag);
        });
        matchesTags = selectedTags.every((tagId) =>
          mangaTagIds.includes(tagId)
        );
      }
    }

    return matchesSearch && matchesFilter && matchesTags;
  });

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
                  {filteredManga.length}{' '}
                  {filteredManga.length === 1 ? 'title' : 'titles'} available
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
          ) : filteredManga.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
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
