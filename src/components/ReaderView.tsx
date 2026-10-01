import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  Heart,
  Mail,
  MessageSquare,
  Moon,
  Send,
  ShieldAlert,
  Sliders,
  Sun,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { Book, Chapter, Comment, ReportCategory, User } from '../types/truewriters';
import { getWatermarkText, handleProtectedKeyDown } from '../utils/security';

interface ReaderViewProps {
  book: Book;
  initialChapterIndex?: number;
  currentUser: User;
  theme: 'light' | 'night';
  onToggleTheme: () => void;
  onClose: () => void;
  onToggleSave: (bookId: string) => void;
  onOpenReport: (targetType: 'book' | 'chapter' | 'comment', targetId: string, title: string) => void;
  onOpenContactBuyer: (book: Book) => void;
  onAddComment: (chapterId: string, text: string, paragraphIndex?: number) => void;
  onVoteChapter: (chapterId: string, type: 'up' | 'down') => void;
}

type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  initialChapterIndex = 0,
  currentUser,
  theme,
  onToggleTheme,
  onClose,
  onToggleSave,
  onOpenReport,
  onOpenContactBuyer,
  onAddComment,
  onVoteChapter,
}) => {
  const [chapterIndex, setChapterIndex] = useState<number>(
    Math.min(initialChapterIndex, Math.max(0, book.chapters.length - 1))
  );
  const [fontSize, setFontSize] = useState<ReaderFontSize>('md');
  const [useSerif, setUseSerif] = useState<boolean>(true);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local comments state for demonstration
  const [chapterComments, setChapterComments] = useState<Comment[]>([
    {
      id: 'com-1',
      userId: 'usr-reader-1',
      authorPenName: 'Iris Claire',
      targetType: 'chapter',
      targetId: book.chapters[chapterIndex]?.id || 'ch-1',
      body: 'The pacing in this chapter is remarkable. The description of the conservatory roof gives me chills.',
      createdAt: '2 hours ago',
      thumbsUp: 24,
      userLiked: false,
    },
    {
      id: 'com-2',
      userId: 'usr-reader-2',
      authorPenName: 'Liam Stone',
      targetType: 'chapter',
      targetId: book.chapters[chapterIndex]?.id || 'ch-1',
      body: 'I appreciate that there are no coin locks on Jeydahsan. Being able to read the whole chapter without interruption is a dream.',
      createdAt: '45 mins ago',
      thumbsUp: 56,
      userLiked: true,
    },
  ]);

  const currentChapter = book.chapters[chapterIndex] || book.chapters[0];
  const isNight = theme === 'night';

  const showSecurityToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Content Protection Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      handleProtectedKeyDown(e, (action) => {
        showSecurityToast(`Action restricted (${action}): copying or inspecting story content is protected.`);
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showSecurityToast('Right-click is disabled on Jeydahsan story content to protect author rights.');
  };

  const paragraphs = currentChapter?.contentMd.split(/\n\s*\n/).filter(Boolean) || [];

  const fontClasses: Record<ReaderFontSize, string> = {
    sm: 'text-[15px]',
    md: 'text-[17px]',
    lg: 'text-[19px]',
    xl: 'text-[22px]',
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser.emailVerified) {
      showSecurityToast('Unverified accounts cannot post comments. Please verify your email via OTP.');
      return;
    }

    const newCom: Comment = {
      id: `com-${Date.now()}`,
      userId: currentUser.id,
      authorPenName: currentUser.penName,
      targetType: 'chapter',
      targetId: currentChapter.id,
      paragraphIndex: activeParagraphIndex !== null ? activeParagraphIndex : undefined,
      body: commentText.trim(),
      createdAt: 'Just now',
      thumbsUp: 1,
    };

    setChapterComments([newCom, ...chapterComments]);
    onAddComment(currentChapter.id, commentText.trim(), activeParagraphIndex !== null ? activeParagraphIndex : undefined);
    setCommentText('');
    showSecurityToast('Comment posted successfully.');
  };

  const watermarkString = getWatermarkText(currentUser.id, currentUser.penName);

  return (
    <div
      onContextMenu={handleContextMenu}
      className="min-h-screen transition-colors duration-200 relative select-none"
      style={{
        backgroundColor: isNight ? '#12140F' : '#FDFBF4',
        color: isNight ? '#E8E6DE' : '#1C1C1A',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl bg-amber-900/90 text-amber-100 shadow-xl border border-amber-700/50 flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-300" />
          <p className="text-xs leading-relaxed font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Reader Sticky Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: isNight ? 'rgba(18, 20, 15, 0.95)' : 'rgba(253, 251, 244, 0.95)',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
        }}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Back & Story Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer"
              style={{
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
                color: isNight ? '#E8E6DE' : '#1C1C1A',
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="truncate">
              <h2 className="text-sm font-bold truncate leading-tight">{book.title}</h2>
              <p className="text-xs truncate" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                by {book.authorName} · {currentChapter?.title}
              </p>
            </div>
          </div>

          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Select chapter"
              value={chapterIndex}
              onChange={(e) => setChapterIndex(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer max-w-[200px] sm:max-w-[280px] truncate"
              style={{
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                color: isNight ? '#E8E6DE' : '#1C1C1A',
              }}
            >
              {book.chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reading Preferences & Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border transition-colors cursor-pointer"
              style={{
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              }}
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#1C1C1A]" />}
            </button>

            {/* Typography Popover */}
            <div className="relative">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                aria-label="Reading appearance"
                className="p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                style={{
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                }}
              >
                <Sliders className="w-4 h-4 text-[#6E8B5E]" />
                <span className="hidden sm:inline">Aa</span>
              </button>

              {showPreferences && (
                <div
                  className="absolute right-0 mt-2 w-64 p-4 rounded-2xl border shadow-xl z-50 text-xs"
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <div className="flex items-center justify-between mb-3 font-bold uppercase tracking-wider text-[#6E8B5E]">
                    <span>Reading Appearance</span>
                    <button onClick={() => setShowPreferences(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Font Family */}
                  <div className="mb-4">
                    <p className="mb-2" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>Typeface</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setUseSerif(true)}
                        className={`py-1.5 px-2 rounded-lg font-serif border ${useSerif ? 'border-[#6E8B5E] font-bold' : ''}`}
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setUseSerif(false)}
                        className={`py-1.5 px-2 rounded-lg font-sans border ${!useSerif ? 'border-[#6E8B5E] font-bold' : ''}`}
                      >
                        Sans-Serif
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <p className="mb-2" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>Font Size</p>
                    <div className="grid grid-cols-4 gap-1.5 font-bold">
                      {(['sm', 'md', 'lg', 'xl'] as ReaderFontSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`py-1 rounded uppercase border ${fontSize === sz ? 'bg-[#6E8B5E] text-white border-[#6E8B5E]' : ''}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buyer Contact Button */}
            <button
              onClick={() => onOpenContactBuyer(book)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
              style={{ backgroundColor: '#6E8B5E' }}
              title="Send direct acquisition / rights request to author (0% platform commission)"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Author</span>
            </button>

            {/* Report Button */}
            <button
              onClick={() => onOpenReport('chapter', currentChapter?.id || book.id, `${book.title} - ${currentChapter?.title}`)}
              className="p-2 rounded-xl border text-xs text-red-600 transition-colors cursor-pointer hover:bg-red-50"
              style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
              title="Report content (Plagiarism, explicit content, hate speech, spam)"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chapter Reading Progress Meter */}
        <div className="w-full h-1" style={{ backgroundColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.round(((chapterIndex + 1) / book.chapters.length) * 100)}%`,
              backgroundColor: '#6E8B5E',
            }}
          />
        </div>
      </header>

      {/* Main Reading Workspace with Max Column Width 68ch */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 lg:py-14 relative">
        {/* Invisible Per-User Watermark Overlay (Section 5) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden leading-loose font-mono text-[10px] break-words uppercase tracking-widest z-10"
          style={{
            opacity: 0.035,
            color: isNight ? '#FFFFFF' : '#000000',
            transform: 'rotate(-12deg) scale(1.1)',
            transformOrigin: 'top left',
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <p key={i} className="my-12">
              {watermarkString} · {watermarkString}
            </p>
          ))}
        </div>

        {/* Centered 68ch Reading Column */}
        <article className="max-w-[68ch] mx-auto relative z-20">
          {/* Chapter Header Info */}
          <div className="mb-8 pb-6 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2" style={{ color: '#6E8B5E' }}>
              <span>Part {currentChapter?.order || 1} of {book.chapters.length}</span>
              <span aria-hidden="true">·</span>
              <span>{currentChapter?.wordCount || 0} words</span>
              <span aria-hidden="true">·</span>
              <span>~{Math.max(1, Math.ceil((currentChapter?.wordCount || 0) / 220))} min read</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
              {currentChapter?.title}
            </h1>

            <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              Published by <strong className="font-semibold">{book.authorName}</strong> · Rating: {book.rating}
            </p>
          </div>

          {/* Protected Story Content */}
          <div
            className={`story-protected-text space-y-6 ${useSerif ? 'font-serif' : 'font-sans'} ${fontClasses[fontSize]}`}
            style={{ lineHeight: 1.7 }}
          >
            {paragraphs.map((para, pIdx) => {
              const isSelected = activeParagraphIndex === pIdx;
              return (
                <div
                  key={pIdx}
                  onClick={() => setActiveParagraphIndex(isSelected ? null : pIdx)}
                  className={`group relative rounded-xl p-3 -mx-3 transition-colors cursor-pointer ${
                    isSelected
                      ? isNight ? 'bg-[#1B1E17] border-l-4 border-[#6E8B5E]' : 'bg-[#F4F1E8] border-l-4 border-[#6E8B5E]'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <p className="pr-8">{para}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveParagraphIndex(isSelected ? null : pIdx);
                    }}
                    className={`absolute right-2 top-3 p-1 rounded-md text-xs transition-opacity ${
                      isSelected ? 'opacity-100 bg-[#6E8B5E] text-white' : 'opacity-0 group-hover:opacity-100 bg-black/5'
                    }`}
                    title="Comment on this paragraph"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Visible Protected Copyright Notice Footer (Section 5) */}
          <div
            className="mt-14 pt-6 border-t text-center text-xs"
            style={{
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              color: isNight ? '#8C9087' : '#5C5F58',
            }}
          >
            <p className="font-semibold mb-1">
              © {new Date().getFullYear()} {book.authorName}. All rights reserved. Unauthorized copying or reposting is prohibited.
            </p>
            <p className="text-[11px] opacity-75">
              Notice: Jeydahsan embeds digital watermarks and anti-copy deterrents. Screenshots cannot be prevented by web browsers (roadmap native apps item).
            </p>
          </div>

          {/* Stepper Navigation */}
          <div
            className="mt-8 pt-6 border-t flex items-center justify-between gap-4"
            style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
          >
            <button
              disabled={chapterIndex === 0}
              onClick={() => {
                setChapterIndex(chapterIndex - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border disabled:opacity-30 cursor-pointer"
              style={{
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <span className="text-xs font-mono" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              Part {chapterIndex + 1} of {book.chapters.length}
            </span>

            <button
              disabled={chapterIndex >= book.chapters.length - 1}
              onClick={() => {
                setChapterIndex(chapterIndex + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-30 cursor-pointer shadow-xs"
              style={{ backgroundColor: '#6E8B5E' }}
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chapter Feedback & Threaded Comments */}
          <section className="mt-14 pt-8 border-t" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-serif">Reader Discussion</h3>
                <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                  {activeParagraphIndex !== null
                    ? `Commenting on paragraph ${activeParagraphIndex + 1}`
                    : 'Share your thoughts on this chapter (Markdown-lite supported)'}
                </p>
              </div>

              {activeParagraphIndex !== null && (
                <button
                  onClick={() => setActiveParagraphIndex(null)}
                  className="text-xs text-[#6E8B5E] hover:underline"
                >
                  Clear paragraph focus
                </button>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mb-8 space-y-3">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  activeParagraphIndex !== null
                    ? `Reply to paragraph #${activeParagraphIndex + 1}...`
                    : 'Write a comment about this chapter...'
                }
                className="w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                style={{
                  backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#E8E6DE' : '#1C1C1A',
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px]" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                  {!currentUser.emailVerified ? '🔒 Verification required to comment' : 'Markdown supported'}
                </span>
                <button
                  type="submit"
                  disabled={!currentUser.emailVerified}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-40"
                  style={{ backgroundColor: '#6E8B5E' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="divide-y" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              {chapterComments.map((com) => (
                <div key={com.id} className="py-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{com.authorPenName}</span>
                    <span className="font-mono text-[11px]" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                      {com.createdAt}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{com.body}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px]" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                    <button
                      onClick={() => {
                        setChapterComments(
                          chapterComments.map((c) =>
                            c.id === com.id
                              ? { ...c, thumbsUp: c.thumbsUp + (c.userLiked ? -1 : 1), userLiked: !c.userLiked }
                              : c
                          )
                        );
                      }}
                      className={`inline-flex items-center gap-1 hover:text-[#6E8B5E] cursor-pointer ${
                        com.userLiked ? 'text-[#6E8B5E] font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{com.thumbsUp}</span>
                    </button>
                    <button
                      onClick={() => onOpenReport('comment', com.id, `Comment by ${com.authorPenName}`)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};
