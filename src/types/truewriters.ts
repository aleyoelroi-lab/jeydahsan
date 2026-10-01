/**
 * Jeydahsan Data Models
 * Exactly following the specification
 */

export type ContentRating = 'All Ages' | 'Teen' | 'Mature';
export type BookStatus = 'Ongoing' | 'Completed' | 'Hiatus';
export type UserRole = 'reader' | 'writer' | 'moderator' | 'admin';

export interface User {
  id: string;
  penName: string;
  fullName?: string;
  nickname?: string;
  displayNamePreference?: 'fullName' | 'nickname';
  email: string;
  showEmailPublicly?: boolean;
  emailVerified: boolean;
  role: UserRole;
  avatar?: string;
  bio?: string;
  links?: string[];
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  blockedUserIds?: string[];
  ageVerified13Plus: boolean;
  isGuest?: boolean;
}

export interface ChapterVersion {
  id: string;
  chapterId: string;
  contentMd: string;
  createdAt: string;
  wordCount: number;
}

export interface Chapter {
  id: string;
  bookId: string;
  order: number;
  title: string;
  contentMd: string;
  wordCount: number;
  pageCount: number;
  updatedAt: string;
  publishedAt: string;
  versions?: ChapterVersion[];
}

export interface Book {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  showAuthorEmail?: boolean;
  seriesId?: string;
  seriesTitle?: string;
  seriesOrder?: number;
  title: string;
  description: string;
  coverUrl: string;
  tags: string[];
  rating: ContentRating;
  status: BookStatus;
  isPublic: boolean;
  pageCount: number;
  wordCount: number;
  createdAt: string;
  publishedAt?: string;
  reads: number;
  thumbsUp: number;
  thumbsDown: number;
  chapters: Chapter[];
}

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  scrollPercent: number;
  updatedAt: string;
}

export type ShelfType = 'reading' | 'want_to_read' | 'completed';

export interface BookshelfItem {
  id: string;
  userId: string;
  bookId: string;
  shelf: ShelfType;
  updatedAt: string;
  notes?: string;
}

export interface Comment {
  id: string;
  userId: string;
  authorPenName: string;
  targetType: 'book' | 'chapter';
  targetId: string;
  paragraphIndex?: number;
  parentId?: string;
  body: string;
  createdAt: string;
  editedAt?: string;
  thumbsUp: number;
  userLiked?: boolean;
}

export type ReportCategory =
  | 'Pornographic / sexually explicit content'
  | 'Plagiarism — this same story exists on another website'
  | 'Hate speech or harassment'
  | 'Spam or advertising'
  | 'Other';

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'book' | 'chapter' | 'comment' | 'forum_post';
  targetId: string;
  targetTitle?: string;
  category: ReportCategory;
  description: string;
  sourceUrl?: string; // required for plagiarism
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  threadCount: number;
}

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string;
  authorPenName: string;
  authorAvatar?: string;
  contentMd: string;
  createdAt: string;
  quotePostId?: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  authorId: string;
  authorPenName: string;
  createdAt: string;
  isPinned?: boolean;
  isLocked?: boolean;
  posts: ForumPost[];
  upvotes: number;
}

export interface ContactRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  buyerId: string;
  authorId: string;
  buyerName: string;
  buyerEmail: string;
  organization?: string;
  rightsInterestedIn?: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  authorConsent: boolean;
  consentAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  moderatorName: string;
  targetType: 'book' | 'user' | 'comment' | 'report';
  targetId: string;
  action: 'dismiss' | 'warn_user' | 'hide_content' | 'unpublish_book' | 'suspend_7d' | 'suspend_30d' | 'ban_user';
  reason: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
