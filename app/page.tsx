'use client';

import Link from 'next/link';
import { Search, BookOpen, ArrowRight, Menu } from 'lucide-react';
import UserAuth from './components/UserAuth';
import Sidebar from './components/Sidebar';
import MangaCard from './components/MangaCard';
import { useState, useEffect } from 'react';
import { Manga, CoverArt } from './types';


export default function Home() {
  const [featuredManga, setFeaturedManga] = useState<Manga[]>([]);
  const [latestManga, setLatestManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/mangas?state=published&itemsPerPage=10&order[updatedAt]=desc`
        );

        if (response.ok) {
          const data = await response.json();
          const mangaList = data['member'] || [];

          // Add placeholder cover art URLs to manga
          const mangaWithCoverArts = mangaList.map((manga: any) => {
            const mangaWithCovers = { ...manga } as Manga;
            if (manga.coverArts && manga.coverArts.length > 0) {
              // Use placeholder image with manga ID as seed

              mangaWithCovers.coverArts = [
                {
                  id: manga.coverArts[0],
                  fileName:
                    'https://mangadex.org/covers/' + manga.mainCoverArtFilename,
                  manga: manga.id,
                },
              ];
            }
            // Initialize followed status
            mangaWithCovers.followed = false;
            return mangaWithCovers;
          });

          // Set first 6 as featured, next 8 as latest updates
          setFeaturedManga(mangaWithCoverArts.slice(0, 6));
          setLatestManga(mangaWithCoverArts.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch manga data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaData();
  }, []);

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
                    placeholder="Search titles, authors, or groups..."
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

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Read Comics & Manga Online
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100">
                High quality images, support creators and translators
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Start Reading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Manga Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Featured Manga</h2>
              <Link
                href="/search"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredManga.length > 0 ? (
                  featuredManga.map((manga) => (
                    <MangaCard key={manga.id} manga={manga} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No manga available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Latest Updates Section */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Latest Updates</h2>
              <Link
                href="/updates"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-700 bg-gray-700 rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex space-x-4">
                      <div className="w-16 h-20 bg-gray-600 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 bg-gray-500 rounded mb-1"></div>
                        <div className="h-3 bg-gray-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestManga.length > 0 ? (
                  latestManga.map((manga) => (
                    <MangaCard
                      key={manga.id}
                      manga={manga}
                      className="border border-gray-700 bg-gray-700 rounded-lg p-4 hover:border-orange-400 transition-colors"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No updates available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  10,000+
                </div>
                <div className="text-gray-300">Manga Titles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  500K+
                </div>
                <div className="text-gray-300">Chapters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  2M+
                </div>
                <div className="text-gray-300">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  1000+
                </div>
                <div className="text-gray-300">Scan Groups</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  <span className="text-lg font-bold">MangaDex</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Read comics and manga online with high quality images and
                  support creators and translators.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Browse</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link
                      href="/search"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/updates"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Updates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/groups"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Groups
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lists"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Lists
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Community</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link
                      href="/forums"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Forums
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/discord"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reddit"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Reddit
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/twitter"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Twitter
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link
                      href="/help"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rules"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api"
                      className="hover:text-orange-500 transition-colors"
                    >
                      API
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 MangaDex. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
