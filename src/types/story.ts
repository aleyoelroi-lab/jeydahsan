export type StoryGenre =
  | 'Romance'
  | 'Fantasy'
  | 'Teen Fiction'
  | 'Mystery'
  | 'Sci-Fi'
  | 'Paranormal'
  | 'Poetry';

export type CoverTheme =
  | 'emerald-botanical'
  | 'mint-constellation'
  | 'forest-silhouette'
  | 'jade-arch'
  | 'sage-minimal'
  | 'pine-vintage';

export interface InlineComment {
  id: string;
  author: string;
  handle: string;
  avatarBg?: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  publishedAt: string;
  wordCount: number;
  readTimeMinutes: number;
  votes: number;
  isVoted?: boolean;
  paragraphs: string[];
  inlineComments: Record<number, InlineComment[]>;
  chapterDiscussion: InlineComment[];
}

export interface Story {
  id: string;
  title: string;
  author: {
    name: string;
    handle: string;
    bio: string;
    followers: string;
  };
  genre: StoryGenre;
  status: 'Ongoing' | 'Completed';
  reads: number;
  votes: number;
  isVoted?: boolean;
  isSaved?: boolean;
  readingProgress: {
    chapterIndex: number;
    percentage: number;
  };
  updatedAt: string;
  tags: string[];
  synopsis: string;
  coverTheme: CoverTheme;
  chapters: Chapter[];
  featured?: boolean;
  ranking?: number;
  contestBadge?: string;
}

export interface ReadingList {
  id: string;
  name: string;
  description: string;
  storyIds: string[];
  curator: string;
  isCustom?: boolean;
}

export interface WritingContest {
  id: string;
  title: string;
  season: string;
  prizePool: string;
  deadline: string;
  wordRequirement: string;
  entriesCount: number;
  prompt: string;
  judgingCriteria: string[];
  submittedStoryIds: string[];
}
