import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookMarked,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Inbox,
  Lock,
  Mail,
  MessageSquare,
  Moon,
  PenTool,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sun,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { BookCard } from './components/BookCard';
import { ContactRequestModal } from './components/ContactRequestModal';
import { EditorView } from './components/EditorView';
import { ForumView } from './components/ForumView';
import { Header } from './components/Header';
import { ReaderView } from './components/ReaderView';
import { ReportModal } from './components/ReportModal';
import { TermsModal } from './components/TermsModal';
import { MAX_PAGES_PER_BOOK, MAX_PUBLIC_BOOKS_PER_USER } from './constants/platform';
import {
  ADMIN_USER,
  ADMIN_USERS,
  CURRENT_USER,
  INITIAL_BOOKS,
  INITIAL_CONTACT_REQUESTS,
  INITIAL_REPORTS,
} from './data/mockData';
import {
  AuditLog,
  Book,
  BookshelfItem,
  ContactRequest,
  ModerationAction,
  ReadingProgress,
  Report,
  ShelfType,
  User,
} from './types/truewriters';
import {
  clearStoredSession,
  findUserByEmail,
  getStoredSession,
  GUEST_USER,
  saveRegisteredUser,
  setStoredSession,
} from './utils/auth';
import { verifyAdAccessKey } from './utils/security';

export default function App() {
  // Theme state: light (#FDFBF4) or night (#12140F)
  const [theme, setTheme] = useState<'light' | 'night'>(() => {
    const saved = localStorage.getItem('jeydahsan-theme') || localStorage.getItem('truewriters-theme');
    if (saved === 'night' || saved === 'light') return saved;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'night';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('jeydahsan-theme', theme);
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#12140F';
      document.body.style.color = '#E8E6DE';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FDFBF4';
      document.body.style.color = '#1C1C1A';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'night' : 'light'));
  };

  // User State - persisted in localStorage until user logs out
  const [currentUser, setCurrentUser] = useState<User>(() => getStoredSession());
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Check URL query parameters for ?verify_token=... and ?email=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const verifyToken = params.get('verify_token') || params.get('magic_token');
      const verifyEmail = params.get('email');

      if (verifyToken && verifyEmail) {
        const cleanEmail = verifyEmail.trim().toLowerCase();
        const existing = findUserByEmail(cleanEmail);

        if (existing) {
          const verifiedUser: User = {
            ...existing,
            emailVerified: true,
            isGuest: false,
          };
          saveRegisteredUser(verifiedUser);
          setStoredSession(verifiedUser);
          setCurrentUser(verifiedUser);
          setBannerNotice(
            `✨ Account verified successfully! Welcome back, ${verifiedUser.penName}. You are logged in until you log out.`
          );
        } else {
          const autoName = cleanEmail.split('@')[0];
          const newUser: User = {
            id: `usr-${Date.now()}`,
            fullName: autoName,
            nickname: autoName,
            displayNamePreference: 'nickname',
            penName: autoName,
            email: cleanEmail,
            emailVerified: true,
            role: 'writer',
            joinedDate: 'October 2026',
            followersCount: 0,
            followingCount: 0,
            ageVerified13Plus: true,
            isGuest: false,
          };
          saveRegisteredUser(newUser);
          setStoredSession(newUser);
          setCurrentUser(newUser);
          setBannerNotice(
            `✨ Account created & verified! Welcome, ${newUser.penName}. You are now logged in until you log out.`
          );
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error('Error handling URL verification link:', err);
    }
  }, []);

  // AD Security & Session Authentication
  const [isAdAuthenticated, setIsAdAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ad_auth_session') === '1';
    }
    return false;
  });
  const [showAdAuthModal, setShowAdAuthModal] = useState<boolean>(false);
  const [adPasscodeAttempt, setAdPasscodeAttempt] = useState<string>('');
  const [adAuthError, setAdAuthError] = useState<string | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<'jeydah' | 'chyrine'>('jeydah');

  // Navigation tab: 'browse' | 'library' | 'write' | 'forum' | 'contact-inbox' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('browse');

  const handleNavigate = (tab: string) => {
    if (tab === 'admin') {
      if (!isAdAuthenticated) {
        setAdAuthError(null);
        setAdPasscodeAttempt('');
        setShowAdAuthModal(true);
        return;
      }
      setCurrentUser(ADMIN_USERS[selectedAdminId]);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdAuthError(null);
    const isValid = await verifyAdAccessKey(adPasscodeAttempt);
    if (isValid) {
      setIsAdAuthenticated(true);
      sessionStorage.setItem('ad_auth_session', '1');
      setCurrentUser(ADMIN_USERS[selectedAdminId]);
      setShowAdAuthModal(false);
      setAdPasscodeAttempt('');
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdAuthError('Access denied.');
    }
  };

  const handleLockAdSession = () => {
    setIsAdAuthenticated(false);
    sessionStorage.removeItem('ad_auth_session');
    setCurrentUser(CURRENT_USER);
    setActiveTab('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchAdmin = (adminKey: 'jeydah' | 'chyrine') => {
    setSelectedAdminId(adminKey);
    setCurrentUser(ADMIN_USERS[adminKey]);
  };

  // Quick switch role helper (only between current writer and active admin if unlocked)
  const toggleRole = () => {
    if (currentUser.role === 'admin') {
      setCurrentUser(CURRENT_USER);
    } else if (isAdAuthenticated) {
      setCurrentUser(ADMIN_USERS[selectedAdminId]);
    } else {
      setShowAdAuthModal(true);
    }
  };

  // Core Data
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>(INITIAL_CONTACT_REQUESTS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-001',
      actorId: 'usr-admin-jeydah',
      actorName: 'Jeydah (Administrator)',
      action: 'System Initialized & Anti-Plagiarism Scanner Online',
      metadata: { target: 'Jeydahsan Core' },
      createdAt: '2026-09-26 09:00',
    },
  ]);

  // Bookshelf items (saved / reading / completed)
  const [bookshelf, setBookshelf] = useState<BookshelfItem[]>([
    {
      id: 'bs-1',
      userId: currentUser.id,
      bookId: 'book-verdigris-sanctum',
      shelf: 'reading',
      updatedAt: '2026-09-26',
    },
    {
      id: 'bs-2',
      userId: currentUser.id,
      bookId: 'book-saltwood-maze',
      shelf: 'want_to_read',
      updatedAt: '2026-09-25',
    },
    {
      id: 'bs-3',
      userId: currentUser.id,
      bookId: 'book-hollow-spire',
      shelf: 'completed',
      updatedAt: '2026-09-24',
    },
  ]);

  // Reading progress tracking (bookId -> { chapterIndex, percent })
  const [readingProgress, setReadingProgress] = useState<Record<string, { chapterIndex: number; percent: number }>>({
    'book-verdigris-sanctum': { chapterIndex: 1, percent: 45 },
    'book-hollow-spire': { chapterIndex: 0, percent: 100 },
  });

  // Browse Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'reads' | 'thumbsUp' | 'recent'>('reads');

  // Modals & Overlays
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readingChapterIndex, setReadingChapterIndex] = useState<number>(0);

  const [contactBook, setContactBook] = useState<Book | null>(null);
  const [reportModalData, setReportModalData] = useState<{
    targetType: 'book' | 'chapter' | 'comment' | 'forum_post';
    targetId: string;
    title: string;
  } | null>(null);

  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (!book.isPublic && book.authorId !== currentUser.id) return false;

        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.authorName.toLowerCase().includes(q) ||
          book.description.toLowerCase().includes(q) ||
          book.tags.some((t) => t.toLowerCase().includes(q));

        const matchesRating = selectedRating === 'All' || book.rating === selectedRating;
        const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
        const matchesTag = selectedTag === 'All' || book.tags.includes(selectedTag);

        return matchesQuery && matchesRating && matchesStatus && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'thumbsUp') return b.thumbsUp - a.thumbsUp;
        if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.reads - a.reads;
      });
  }, [books, searchQuery, selectedRating, selectedStatus, selectedTag, sortBy, currentUser.id]);

  // Public books count for current user
  const userPublicBooksCount = useMemo(() => {
    return books.filter((b) => b.authorId === currentUser.id && b.isPublic).length;
  }, [books, currentUser.id]);

  // Handlers for Reader
  const handleOpenReader = (bookId: string, chapterIndex = 0) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;

    // Increment read count
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, reads: b.reads + 1 } : b))
    );

    // Update bookshelf to 'reading' if not present
    setBookshelf((prev) => {
      const existing = prev.find((item) => item.bookId === bookId);
      if (!existing) {
        return [
          ...prev,
          {
            id: `bs-${Date.now()}`,
            userId: currentUser.id,
            bookId,
            shelf: 'reading',
            updatedAt: new Date().toISOString(),
          },
        ];
      }
      return prev;
    });

    setReadingBook(target);
    setReadingChapterIndex(chapterIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveBook = (bookId: string) => {
    setBookshelf((prev) => {
      const existing = prev.find((item) => item.bookId === bookId);
      if (existing) {
        // Toggle between shelves or remove
        return prev.filter((item) => item.bookId !== bookId);
      } else {
        return [
          ...prev,
          {
            id: `bs-${Date.now()}`,
            userId: currentUser.id,
            bookId,
            shelf: 'want_to_read',
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const handleSetShelf = (bookId: string, shelf: ShelfType) => {
    setBookshelf((prev) => {
      const existing = prev.find((item) => item.bookId === bookId);
      if (existing) {
        return prev.map((item) => (item.bookId === bookId ? { ...item, shelf } : item));
      }
      return [
        ...prev,
        {
          id: `bs-${Date.now()}`,
          userId: currentUser.id,
          bookId,
          shelf,
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const handleVoteBook = (bookId: string, type: 'up' | 'down') => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          thumbsUp: type === 'up' ? b.thumbsUp + 1 : b.thumbsUp,
          thumbsDown: type === 'down' ? b.thumbsDown + 1 : b.thumbsDown,
        };
      })
    );
  };

  const handleVoteChapter = (chapterId: string, type: 'up' | 'down') => {
    if (!readingBook) return;
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== readingBook.id) return b;
        return {
          ...b,
          thumbsUp: type === 'up' ? b.thumbsUp + 1 : b.thumbsUp,
          thumbsDown: type === 'down' ? b.thumbsDown + 1 : b.thumbsDown,
        };
      })
    );
  };

  const handleAddComment = (chapterId: string, text: string, paragraphIndex?: number) => {
    // In our live reader, comments are added to local state seamlessly
    console.log('Added comment to', chapterId, text, paragraphIndex);
  };

  // Save Book from Editor
  const handleSaveBook = (bookToSave: Book, andOpenReader?: boolean) => {
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === bookToSave.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = bookToSave;
        return next;
      }
      return [bookToSave, ...prev];
    });

    if (andOpenReader) {
      handleOpenReader(bookToSave.id, 0);
    }
  };

  // Start Series Book 2
  const handleStartSeriesBook2 = (parentBook: Book) => {
    const seriesTitle = parentBook.seriesTitle || `${parentBook.title} Series`;
    const newBook2: Book = {
      id: `book-series-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.penName,
      seriesId: parentBook.seriesId || `series-${parentBook.id}`,
      seriesTitle,
      seriesOrder: 2,
      title: `${parentBook.title}: Part II`,
      description: `The continuing sequence to "${parentBook.title}" in the ${seriesTitle}.`,
      coverUrl: parentBook.coverUrl,
      tags: [...parentBook.tags],
      rating: parentBook.rating,
      status: 'Ongoing',
      isPublic: true,
      pageCount: 1,
      wordCount: 300,
      createdAt: new Date().toISOString().slice(0, 10),
      publishedAt: new Date().toISOString().slice(0, 10),
      reads: 0,
      thumbsUp: 0,
      thumbsDown: 0,
      chapters: [
        {
          id: `ch-seq-${Date.now()}`,
          bookId: `book-series-${Date.now()}`,
          order: 1,
          title: 'Prologue: The Second Horizon',
          contentMd: `The echoes from ${parentBook.title} still resonated through the stone halls...`,
          wordCount: 300,
          pageCount: 1,
          updatedAt: new Date().toISOString().slice(0, 10),
          publishedAt: new Date().toISOString().slice(0, 10),
        },
      ],
    };

    setBooks((prev) => [newBook2, ...prev]);
    setActiveTab('write');
  };

  // Submit Contact Request from Buyer
  const handleSubmitContactRequest = (req: ContactRequest) => {
    setContactRequests((prev) => [req, ...prev]);
  };

  // Submit Report
  const handleSubmitReport = (rep: Report) => {
    setReports((prev) => [rep, ...prev]);
  };

  // Resolve Report in AD
  const handleResolveReport = (reportId: string, action: ModerationAction) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action.action === 'dismiss' ? 'dismissed' : 'resolved',
              resolutionNote: `${action.action.toUpperCase()}: ${action.reason}`,
            }
          : r
      )
    );

    // Apply moderation action to book if targeted
    if (action.targetType === 'book') {
      if (action.action === 'hide_content' || action.action === 'unpublish_book') {
        setBooks((prev) =>
          prev.map((b) => (b.id === action.targetId ? { ...b, isPublic: false } : b))
        );
      }
    }

    // Append to audit logs
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.penName,
      action: `Moderation Action: ${action.action} on ${action.targetType} (${action.targetId})`,
      metadata: { reason: action.reason },
      createdAt: new Date().toLocaleString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // User Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setStoredSession(user);
    setBannerNotice(`✨ Welcome back, ${user.penName}! You are logged in until you log out.`);
    setShowAuthModal(false);
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
    setStoredSession(updated);
    // Sync any authored books with updated penName or public email
    setBooks((prev) =>
      prev.map((b) =>
        b.authorId === updated.id
          ? {
              ...b,
              authorName: updated.penName,
              authorEmail: updated.showEmailPublicly ? updated.email : undefined,
              showAuthorEmail: !!updated.showEmailPublicly,
            }
          : b
      )
    );
    setBannerNotice(`Profile updated: Your active display name is "${updated.penName}".`);
  };

  const handleLogOut = () => {
    clearStoredSession();
    setCurrentUser(GUEST_USER);
    setBannerNotice('You have logged out. You can browse freely or log back in anytime.');
    setShowAuthModal(false);
  };

  const isNight = theme === 'night';

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{
        backgroundColor: isNight ? '#12140F' : '#FDFBF4',
        color: isNight ? '#E8E6DE' : '#1C1C1A',
      }}
    >
      {/* Universal Header */}
      <Header
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => setShowAuthModal(true)}
        onToggleRole={toggleRole}
        onLogOut={!currentUser.isGuest ? handleLogOut : undefined}
      />

      {/* Global Status Banner Notice */}
      {bannerNotice && (
        <div
          className="border-b transition-colors px-4 py-2.5 text-xs"
          style={{
            backgroundColor: isNight ? 'rgba(110, 139, 94, 0.15)' : '#F0FDF4',
            borderColor: isNight ? '#2C3128' : '#DCFCE7',
            color: isNight ? '#A3B899' : '#166534',
          }}
        >
          <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between gap-4">
            <span className="font-medium">{bannerNotice}</span>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-xs font-bold hover:underline opacity-80 hover:opacity-100 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-4 sm:px-8 py-6">
        {/* TAB 1: BROWSE / DISCOVER */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            {/* Hero Ethos Banner */}
            <div
              className="rounded-3xl border p-6 sm:p-8 relative overflow-hidden shadow-xs transition-colors"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="max-w-3xl space-y-3 relative z-10">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                  Where authentic literature lives without paywalls or ads.
                </h1>
                <p className="text-sm sm:text-base leading-relaxed opacity-85">
                  Read uninterrupted with clean typography, inline paragraph discussions, and anti-scraping
                  protection. Every book has a maximum cap of 500 pages (150,000 words), and authors keep 100% of their
                  copyright with 0% platform commission on scout inquiries.
                </p>

                {/* Platform Guarantees Badges */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-[#6E8B5E]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No chapter unlocks or coins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6E8B5E]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Max 500 pages (150k words) per book</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6E8B5E]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Max 7 public books per author</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6E8B5E]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>0% commission on rights inquiries</span>
                  </div>
                </div>
              </div>

              {/* Decorative Subtle Corner JS Watermark */}
              <div
                aria-hidden="true"
                className="absolute right-2 -bottom-6 opacity-10 pointer-events-none select-none font-serif font-black text-[160px] sm:text-[210px] leading-none tracking-tighter"
                style={{ color: '#6E8B5E' }}
              >
                JS
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div
              className="p-4 sm:p-5 rounded-2xl border space-y-4 shadow-xs"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, keyword, or tag..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6E8B5E]"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      color: isNight ? '#E8E6DE' : '#1C1C1A',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs font-semibold opacity-70 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-hidden cursor-pointer"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      color: isNight ? '#E8E6DE' : '#1C1C1A',
                    }}
                  >
                    <option value="reads">Most Reads</option>
                    <option value="thumbsUp">Highest Thumbs Up</option>
                    <option value="recent">Recently Added</option>
                  </select>
                </div>
              </div>

              {/* Tag & Rating Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                <span className="text-xs font-semibold opacity-60 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Rating:
                </span>
                {['All', 'All Ages', 'Teen', 'Mature'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedRating === r
                        ? 'bg-[#6E8B5E] text-white'
                        : 'border hover:border-[#6E8B5E]'
                    }`}
                    style={{
                      borderColor: selectedRating === r ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      backgroundColor: selectedRating === r ? '#6E8B5E' : 'transparent',
                    }}
                  >
                    {r}
                  </button>
                ))}

                <span className="text-xs font-semibold opacity-60 ml-3 mr-1">Status:</span>
                {['All', 'Ongoing', 'Completed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedStatus === s
                        ? 'bg-[#6E8B5E] text-white'
                        : 'border hover:border-[#6E8B5E]'
                    }`}
                    style={{
                      borderColor: selectedStatus === s ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      backgroundColor: selectedStatus === s ? '#6E8B5E' : 'transparent',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold">
                  Discover Books ({filteredBooks.length})
                </h2>
                <span className="text-xs opacity-60 font-mono">
                  Showing public books within the 500-page limit
                </span>
              </div>

              {filteredBooks.length === 0 ? (
                <div
                  className="rounded-2xl border p-12 text-center space-y-3"
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <BookOpen className="w-10 h-10 mx-auto opacity-30 text-[#6E8B5E]" />
                  <h3 className="font-serif font-bold text-lg">No books found</h3>
                  <p className="text-xs max-w-md mx-auto opacity-70">
                    No books matched your active search query or filter tags. Try resetting filters or
                    write your own original story in the Writer Studio.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRating('All');
                      setSelectedStatus('All');
                      setSelectedTag('All');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E8B5E] border border-[#6E8B5E] hover:bg-[#6E8B5E]/10 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBooks.map((book) => {
                    const isSaved = bookshelf.some((item) => item.bookId === book.id);
                    return (
                      <BookCard
                        key={book.id}
                        book={book}
                        theme={theme}
                        isSaved={isSaved}
                        onRead={handleOpenReader}
                        onToggleSave={handleToggleSaveBook}
                        onOpenContactBuyer={(b) => setContactBook(b)}
                        onVote={handleVoteBook}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
                  Personal Archive
                </span>
                <h1 className="text-3xl font-serif font-bold">My Bookshelf</h1>
                <p className="text-xs opacity-75 mt-1">
                  Your reading history, saved bookmarks, and custom shelves. Progress is saved locally.
                </p>
              </div>

              {/* Author quick stats */}
              <div
                className="px-4 py-3 rounded-2xl border text-xs flex items-center gap-4"
                style={{
                  backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              >
                <div>
                  <span className="block opacity-60 text-[10px] uppercase font-mono">My Public Books</span>
                  <span className="font-bold text-sm text-[#6E8B5E]">
                    {userPublicBooksCount} / {MAX_PUBLIC_BOOKS_PER_USER}
                  </span>
                </div>
                <div className="h-6 w-px bg-current opacity-20" />
                <button
                  onClick={() => setActiveTab('write')}
                  className="px-3 py-1.5 rounded-xl bg-[#6E8B5E] text-white font-semibold hover:bg-[#5C754E] transition-colors cursor-pointer"
                >
                  + New Book
                </button>
              </div>
            </div>

            {/* Currently Reading Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6E8B5E]" />
                Currently Reading
              </h2>

              {bookshelf.filter((b) => b.shelf === 'reading').length === 0 ? (
                <div
                  className="p-8 rounded-2xl border text-center space-y-2"
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <p className="text-xs opacity-70">You don't have any books marked as Currently Reading.</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="text-xs font-bold text-[#6E8B5E] hover:underline"
                  >
                    Browse available titles &rarr;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookshelf
                    .filter((item) => item.shelf === 'reading')
                    .map((item) => {
                      const book = books.find((b) => b.id === item.bookId);
                      if (!book) return null;
                      const prog = readingProgress[book.id] || { chapterIndex: 0, percent: 15 };

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border flex gap-4 items-center justify-between"
                          style={{
                            backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                            borderColor: isNight ? '#2C3128' : '#E4E0D4',
                          }}
                        >
                          <div className="w-16 h-22 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">{book.title}</h3>
                            <p className="text-xs opacity-70">{book.authorName}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-[11px] opacity-75 font-mono">
                                <span>Chapter {prog.chapterIndex + 1} of {book.chapters.length}</span>
                                <span>{prog.percent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                                <div className="h-full bg-[#6E8B5E] rounded-full" style={{ width: `${prog.percent}%` }} />
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col gap-2">
                            <button
                              onClick={() => handleOpenReader(book.id, prog.chapterIndex)}
                              className="px-3 py-1.5 rounded-xl bg-[#6E8B5E] text-white text-xs font-semibold hover:bg-[#5C754E] cursor-pointer"
                            >
                              Resume
                            </button>
                            <button
                              onClick={() => handleSetShelf(book.id, 'completed')}
                              className="px-3 py-1 rounded-lg border text-[11px] opacity-70 hover:opacity-100 cursor-pointer"
                              style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                            >
                              Mark Finished
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Want to Read & Finished Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Want to Read */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  Want to Read ({bookshelf.filter((b) => b.shelf === 'want_to_read').length})
                </h3>
                <div className="space-y-2">
                  {bookshelf.filter((b) => b.shelf === 'want_to_read').map((item) => {
                    const book = books.find((b) => b.id === item.bookId);
                    if (!book) return null;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border flex items-center justify-between text-xs"
                        style={{
                          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                          borderColor: isNight ? '#2C3128' : '#E4E0D4',
                        }}
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold block truncate">{book.title}</span>
                          <span className="opacity-70 text-[11px]">{book.authorName} · {book.pageCount} pages</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenReader(book.id, 0)}
                            className="px-2.5 py-1 rounded-lg bg-[#6E8B5E] text-white font-semibold cursor-pointer"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => handleToggleSaveBook(book.id)}
                            className="p-1 text-rose-500 hover:opacity-80"
                            title="Remove from shelf"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Finished */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6E8B5E]" />
                  Finished ({bookshelf.filter((b) => b.shelf === 'completed').length})
                </h3>
                <div className="space-y-2">
                  {bookshelf.filter((b) => b.shelf === 'completed').map((item) => {
                    const book = books.find((b) => b.id === item.bookId);
                    if (!book) return null;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border flex items-center justify-between text-xs"
                        style={{
                          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                          borderColor: isNight ? '#2C3128' : '#E4E0D4',
                        }}
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold block truncate">{book.title}</span>
                          <span className="opacity-70 text-[11px]">{book.pageCount} pages · Completed</span>
                        </div>
                        <button
                          onClick={() => handleOpenReader(book.id, 0)}
                          className="px-2.5 py-1 rounded-lg border font-semibold cursor-pointer hover:border-[#6E8B5E]"
                          style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                        >
                          Re-read
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WRITE & PUBLISH */}
        {activeTab === 'write' && (
          <EditorView
            currentUser={currentUser}
            existingBooks={books}
            theme={theme}
            onSaveBook={handleSaveBook}
            onStartSeriesBook2={handleStartSeriesBook2}
          />
        )}

        {/* TAB 4: COMMUNITY FORUM */}
        {activeTab === 'forum' && (
          <ForumView
            currentUser={currentUser}
            theme={theme}
            onOpenReport={(type, id, title) =>
              setReportModalData({ targetType: type as any, targetId: id, title })
            }
          />
        )}

        {/* TAB 5: BUYER REQUESTS INBOX */}
        {activeTab === 'contact-inbox' && (
          <div className="space-y-6">
            <div className="pb-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
                  Direct Author Inquiries · 0% Platform Commission
                </span>
                <h1 className="text-3xl font-serif font-bold">Buyer & Scout Requests</h1>
                <p className="text-xs opacity-75 mt-1">
                  Literary agents, film producers, and publishers can contact authors directly. Jeydahsan takes no cut of deals.
                </p>
              </div>

              <div
                className="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 self-start"
                style={{
                  backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              >
                <Shield className="w-4 h-4 text-[#6E8B5E]" />
                <span>You own 100% of your copyright</span>
              </div>
            </div>

            {/* Zero Commission Transparency Notice */}
            <div
              className="p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: '#6E8B5E',
              }}
            >
              <CheckCircle2 className="w-5 h-5 text-[#6E8B5E] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-serif font-bold text-[#6E8B5E] mb-0.5">
                  The Jeydahsan Independence Guarantee:
                </strong>
                Contact requests between buyers and authors are 100% free. The platform does not participate in
                negotiations, takes zero commission or cut, and never acts as an agent or middleman.
              </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold">
                Received Inquiries ({contactRequests.length})
              </h2>

              {contactRequests.length === 0 ? (
                <div
                  className="p-12 rounded-2xl border text-center space-y-2"
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <Inbox className="w-10 h-10 mx-auto opacity-30 text-[#6E8B5E]" />
                  <h3 className="font-bold text-base">No Buyer Requests Yet</h3>
                  <p className="text-xs opacity-70 max-w-sm mx-auto">
                    When literary agents or scout inquiries are submitted for your public books, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-6 rounded-2xl border space-y-4 shadow-xs"
                      style={{
                        backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                        borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base">{req.buyerName}</span>
                            {req.organization && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-[#6E8B5E]/15 text-[#6E8B5E] font-semibold">
                                {req.organization}
                              </span>
                            )}
                          </div>
                          <span className="text-xs opacity-70">
                            Inquiring about: <strong className="font-serif">{req.bookTitle}</strong> · Received: {req.createdAt}
                          </span>
                        </div>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider self-start sm:self-auto ${
                            req.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-600'
                              : req.status === 'accepted'
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : 'bg-rose-500/15 text-rose-600'
                          }`}
                        >
                          Status: {req.status}
                        </span>
                      </div>

                      {/* Rights badges */}
                      {req.rightsInterestedIn && req.rightsInterestedIn.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="font-semibold opacity-70">Rights Sought:</span>
                          {req.rightsInterestedIn.map((r, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold"
                              style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Message Body */}
                      <div
                        className="p-4 rounded-xl text-xs sm:text-sm leading-relaxed border whitespace-pre-wrap font-sans"
                        style={{
                          backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                          borderColor: isNight ? '#2C3128' : '#E4E0D4',
                        }}
                      >
                        {req.message}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-mono opacity-80">
                          <Mail className="w-3.5 h-3.5 text-[#6E8B5E]" />
                          <span>Direct Email: <strong>{req.buyerEmail}</strong></span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              alert(`Replied to ${req.buyerName} at ${req.buyerEmail}. You can also email them directly!`);
                              setContactRequests((prev) =>
                                prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r))
                              );
                            }}
                            className="px-4 py-1.5 rounded-xl bg-[#6E8B5E] text-white text-xs font-semibold hover:bg-[#5C754E] cursor-pointer"
                          >
                            Accept & Contact
                          </button>
                          <button
                            onClick={() => {
                              setContactRequests((prev) =>
                                prev.map((r) => (r.id === req.id ? { ...r, status: 'declined' } : r))
                              );
                            }}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                            style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AD */}
        {activeTab === 'admin' && (
          !isAdAuthenticated ? (
            <div
              className="p-12 text-center border rounded-3xl space-y-4 max-w-md mx-auto my-12 shadow-xs"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-[#6E8B5E]/15 text-[#6E8B5E]">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif font-bold">AD Restricted Area</h2>
              <p className="text-xs opacity-75">
                Security verification required to access moderation and operations controls.
              </p>
              <button
                onClick={() => {
                  setAdAuthError(null);
                  setAdPasscodeAttempt('');
                  setShowAdAuthModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#6E8B5E] text-white text-xs font-bold hover:bg-[#5C754E] cursor-pointer transition-colors"
              >
                Enter Security Key
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AdminDashboard
                currentUser={currentUser.role === 'admin' ? currentUser : ADMIN_USERS[selectedAdminId]}
                reports={reports}
                auditLogs={auditLogs}
                theme={theme}
                onResolveReport={handleResolveReport}
                onSwitchAdmin={handleSwitchAdmin}
                onLockSession={handleLockAdSession}
              />
            </div>
          )
        )}
      </main>

      {/* Reader View Modal */}
      {readingBook && (
        <ReaderView
          book={readingBook}
          initialChapterIndex={readingChapterIndex}
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onClose={() => setReadingBook(null)}
          onToggleSave={handleToggleSaveBook}
          onOpenReport={(type, id, title) =>
            setReportModalData({ targetType: type as any, targetId: id, title })
          }
          onOpenContactBuyer={(book) => setContactBook(book)}
          onAddComment={handleAddComment}
          onVoteChapter={handleVoteChapter}
        />
      )}

      {/* Contact Buyer Modal */}
      {contactBook && (
        <ContactRequestModal
          book={contactBook}
          theme={theme}
          onClose={() => setContactBook(null)}
          onSubmitRequest={handleSubmitContactRequest}
        />
      )}

      {/* Report Modal */}
      {reportModalData && (
        <ReportModal
          targetType={reportModalData.targetType}
          targetId={reportModalData.targetId}
          targetTitle={reportModalData.title}
          theme={theme}
          onClose={() => setReportModalData(null)}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {/* Terms of Service & Copyright Modal */}
      {showTermsModal && (
        <TermsModal theme={theme} onClose={() => setShowTermsModal(false)} />
      )}

      {/* User Auth, Registration & Account Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        theme={theme}
        onLoginSuccess={handleLoginSuccess}
        onUpdateUser={handleUpdateUser}
        onLogOut={handleLogOut}
      />

      {/* AD Security Key Verification Modal */}
      {showAdAuthModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => {
            setShowAdAuthModal(false);
            setAdPasscodeAttempt('');
            setAdAuthError(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              color: isNight ? '#E8E6DE' : '#1C1C1A',
            }}
          >
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6E8B5E]" />
                <h3 className="font-mono font-bold text-sm tracking-wider uppercase">AD Verification</h3>
              </div>
              <button
                onClick={() => {
                  setShowAdAuthModal(false);
                  setAdPasscodeAttempt('');
                  setAdAuthError(null);
                }}
                className="p-1 rounded-lg hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUnlockAd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 opacity-80">Security Key</label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={adPasscodeAttempt}
                  onChange={(e) => {
                    setAdPasscodeAttempt(e.target.value);
                    setAdAuthError(null);
                  }}
                  placeholder="Enter key..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
                {adAuthError && (
                  <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{adAuthError}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase opacity-70">Admin Identity</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedAdminId('jeydah')}
                    className={`py-2 px-3 rounded-xl border transition-colors cursor-pointer ${
                      selectedAdminId === 'jeydah' ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E]' : 'opacity-70'
                    }`}
                    style={{ borderColor: selectedAdminId === 'jeydah' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4' }}
                  >
                    Jeydah
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAdminId('chyrine')}
                    className={`py-2 px-3 rounded-xl border transition-colors cursor-pointer ${
                      selectedAdminId === 'chyrine' ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E]' : 'opacity-70'
                    }`}
                    style={{ borderColor: selectedAdminId === 'chyrine' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4' }}
                  >
                    Chyrine
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdAuthModal(false);
                    setAdPasscodeAttempt('');
                    setAdAuthError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                  style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#6E8B5E] text-white hover:bg-[#5C754E] cursor-pointer"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="border-t mt-16 transition-colors"
        style={{
          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
        }}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-6 text-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-bold text-white text-xs tracking-tight"
                  style={{ backgroundColor: '#6E8B5E' }}
                >
                  JS
                </span>
                <span className="text-xl font-serif font-bold">Jeydahsan</span>
              </div>
              <p className="opacity-75 max-w-md">
                A 100% free reading, writing, and author discovery platform. Zero paywalls, zero ads,
                built-in content protection, and direct author contact.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 font-semibold">
              <button
                onClick={() => {
                  setActiveTab('browse');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                Discover Books
              </button>
              <button
                onClick={() => {
                  setActiveTab('library');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                My Library
              </button>
              <button
                onClick={() => {
                  setActiveTab('write');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                Write & Publish
              </button>
              <button
                onClick={() => {
                  setActiveTab('forum');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                Community Forum
              </button>
              <button
                onClick={() => {
                  setActiveTab('contact-inbox');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                Buyer Requests
              </button>
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:text-[#6E8B5E] cursor-pointer"
              >
                Terms & Copyright Policy
              </button>
              <button
                onClick={() => {
                  handleNavigate('admin');
                }}
                className="hover:text-[#6E8B5E] cursor-pointer font-mono text-xs opacity-75 hover:opacity-100"
              >
                AD
              </button>
            </div>
          </div>

          <div
            className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 opacity-60 text-[11px]"
            style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
          >
            <span>&copy; {new Date().getFullYear()} Jeydahsan Platform. All authors retain 100% of their intellectual property.</span>
            <span>Platform rules: Max 500 pages per book · Max 7 public books per author · 0% commission</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
