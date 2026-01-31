// Centralized type definitions for MangaDex frontend

// User-related types
export interface User {
  id: string;
  name: string;
  email?: string;
  roles?: string[];
}

// Manga-related types
export interface Manga {
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

export interface CoverArt {
  id?: string;
  fileName: string;
  manga: string;
  volume?: string;
}

export interface Tag {
  id: string;
  name: { [key: string]: string };
  tagGroup: string;
  description?: { [key: string]: string };
}

export interface Author {
  id: string;
  name: string | { [key: string]: string };
  role: string;
}

// Chapter-related types
export interface Chapter {
  id: string;
  chapter: string;
  title?: string;
  volume?: string;
  pages: number;
  publishAt: string;
  translatedLanguage: string;
  scanlator?: string;
  manga?: {
    id: string;
    title: { [key: string]: string };
  };
}

export interface Page {
  id: string;
  index: number;
  fileName: string;
  imageUrl: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  member: T[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  view: {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  };
}

// Component props types
export interface MangaCardProps {
  manga: Manga;
  className?: string;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
}
