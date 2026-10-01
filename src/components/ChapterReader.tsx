import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Send,
  Sliders,
  Star,
  X,
} from 'lucide-react';
import { Story } from '../types/story';
import { BookCoverArt } from './BookCoverArt';

interface ChapterReaderProps {
  story: Story;
  initialChapterIndex?: number;
  onClose: () => void;
  onToggleStorySave: (storyId: string) => void;
  onToggleChapterVote: (storyId: string, chapterId: string) => void;
  onAddInlineComment: (
    storyId: string,
    chapterId: string,
    paragraphIndex: number,
    text: string
  ) => void;
  onAddChapterComment: (storyId: string, chapterId: string, text: string) => void;
  onUpdateProgress: (storyId: string, chapterIndex: number, percentage: number) => void;
}

type ThemeMode = 'white' | 'sage' | 'forest';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  story,
  initialChapterIndex = 0,
  onClose,
  onToggleStorySave,
  onToggleChapterVote,
  onAddInlineComment,
  onAddChapterComment,
  onUpdateProgress,
}) => {
  const [chapterIdx, setChapterIdx] = useState<number>(
    Math.min(initialChapterIndex, Math.max(0, story.chapters.length - 1))
  );
  const [activeParaIdx, setActiveParaIdx] = useState<number | null>(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>('white');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontSerif, setFontSerif] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [inlineInput, setInlineInput] = useState<string>('');
  const [chapterInput, setChapterInput] = useState<string>('');
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});

  const currentChapter = story.chapters[chapterIdx] || story.chapters[0];

  const handleChapterChange = (newIdx: number) => {
    setChapterIdx(newIdx);
    setActiveParaIdx(null);
    const pct = Math.round(((newIdx + 1) / story.chapters.length) * 100);
    onUpdateProgress(story.id, newIdx, pct);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeParaIdx === null || !inlineInput.trim()) return;
    onAddInlineComment(story.id, currentChapter.id, activeParaIdx, inlineInput.trim());
    setInlineInput('');
  };

  const handleDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterInput.trim()) return;
    onAddChapterComment(story.id, currentChapter.id, chapterInput.trim());
    setChapterInput('');
  };

  const toggleLike = (id: string) => {
    setLikedCommentIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const themes: Record<
    ThemeMode,
    {
      bg: string;
      headerBg: string;
      cardBg: string;
      text: string;
      muted: string;
      border: string;
      activePara: string;
    }
  > = {
    white: {
      bg: 'bg-white',
      headerBg: 'bg-white/95',
      cardBg: 'bg-[#F8FAF8]',
      text: 'text-[#0C2417]',
      muted: 'text-[#4B6356]',
      border: 'border-[#E2ECE5]',
      activePara: 'bg-[#ECFDF5] border-l-3 border-[#059669]',
    },
    sage: {
      bg: 'bg-[#F2F8F4]',
      headerBg: 'bg-[#F2F8F4]/95',
      cardBg: 'bg-[#E5F2E9]',
      text: 'text-[#092215]',
      muted: 'text-[#415C4D]',
      border: 'border-[#CCE2D4]',
      activePara: 'bg-white/90 border-l-3 border-[#059669]',
    },
    forest: {
      bg: 'bg-[#062418]',
      headerBg: 'bg-[#062418]/95',
      cardBg: 'bg-[#0A3323]',
      text: 'text-[#ECFDF5]',
      muted: 'text-[#9CB6A8]',
      border: 'border-[#134430]',
      activePara: 'bg-[#0D3B29] border-l-3 border-[#34D399]',
    },
  };

  const t = themes[themeMode];

  const fontClasses: Record<FontSize, string> = {
    sm: 'text-[15px] leading-[1.75]',
    md: 'text-[17px] leading-[1.8]',
    lg: 'text-[19px] leading-[1.85]',
    xl: 'text-[21px] leading-[1.9]',
  };

  const activeComments =
    activeParaIdx !== null ? currentChapter.inlineComments[activeParaIdx] || [] : [];

  const totalInlineInChapter = (
    Object.values(currentChapter.inlineComments) as Array<Array<unknown>>
  ).reduce((acc, list) => acc + list.length, 0);

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-200`}>
      {/* Top Sticky Bar */}
      <header
        className={`sticky top-0 z-40 ${t.headerBg} backdrop-blur-md border-b ${t.border}`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Back & Story Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg text-sm font-medium ${t.muted} hover:text-[#059669] hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-1.5`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Jeydahsan</span>
            </button>
            <div className={`hidden md:block h-5 w-[1px] ${t.border} bg-current opacity-20`} />
            <div className="hidden md:flex items-center gap-2.5 truncate">
              <div className="w-6 h-8 shrink-0">
                <BookCoverArt
                  title={story.title}
                  author={story.author.name}
                  theme={story.coverTheme}
                />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate leading-tight">{story.title}</p>
                <p className={`text-[11px] ${t.muted} truncate`}>by {story.author.name}</p>
              </div>
            </div>
          </div>

          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Select chapter"
              value={chapterIdx}
              onChange={(e) => handleChapterChange(Number(e.target.value))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${t.border} ${t.cardBg} ${t.text} focus:outline-none focus:ring-2 focus:ring-[#059669] cursor-pointer max-w-[200px] sm:max-w-[280px] truncate`}
            >
              {story.chapters.map((ch, i) => (
                <option key={ch.id} value={i}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reader Controls: Vote Star, Library Bookmark, Display Settings */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleChapterVote(story.id, currentChapter.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                currentChapter.isVoted
                  ? 'bg-[#059669] text-white shadow-xs'
                  : `border ${t.border} ${t.cardBg} hover:border-[#059669]`
              }`}
              title="Vote for this chapter on Jeydahsan"
            >
              <Star
                className={`w-3.5 h-3.5 ${currentChapter.isVoted ? 'fill-current' : ''}`}
              />
              <span className="hidden sm:inline">
                {currentChapter.isVoted ? 'Voted' : 'Vote'}
              </span>
              <span className="font-mono tabular-nums opacity-90">
                {currentChapter.votes.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => onToggleStorySave(story.id)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border ${t.border} ${t.cardBg} hover:border-[#059669] transition-colors cursor-pointer flex items-center gap-1.5`}
              title="Save story to your library"
            >
              {story.isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="hidden sm:inline">In Library</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>

            {/* Typography & Surface Settings Popover */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg text-xs font-medium border ${t.border} ${t.cardBg} hover:border-[#059669] transition-colors cursor-pointer flex items-center gap-1`}
                aria-label="Reading appearance"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-serif font-bold text-xs">Aa</span>
              </button>

              {showSettings && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl border ${t.border} ${t.bg} shadow-xl p-4 z-50`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                      Reading Settings
                    </span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className={`${t.muted} hover:opacity-75 cursor-pointer`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Surface Palette */}
                  <div className="mb-4">
                    <p className={`text-xs ${t.muted} mb-2`}>Background</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setThemeMode('white')}
                        className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                          themeMode === 'white'
                            ? 'border-[#059669] ring-2 ring-[#059669]/30'
                            : 'border-[#E2ECE5]'
                        } bg-white text-[#0C2417]`}
                      >
                        White
                      </button>
                      <button
                        onClick={() => setThemeMode('sage')}
                        className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                          themeMode === 'sage'
                            ? 'border-[#059669] ring-2 ring-[#059669]/30'
                            : 'border-[#CCE2D4]'
                        } bg-[#F2F8F4] text-[#092215]`}
                      >
                        Sage
                      </button>
                      <button
                        onClick={() => setThemeMode('forest')}
                        className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                          themeMode === 'forest'
                            ? 'border-[#34D399] ring-2 ring-[#34D399]/30'
                            : 'border-[#134430]'
                        } bg-[#062418] text-[#ECFDF5]`}
                      >
                        Forest
                      </button>
                    </div>
                  </div>

                  {/* Font Type */}
                  <div className="mb-4">
                    <p className={`text-xs ${t.muted} mb-2`}>Font Style</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFontSerif(true)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-serif border cursor-pointer ${
                          fontSerif ? 'border-[#059669] bg-[#059669]/10 font-bold' : t.border
                        }`}
                      >
                        Book Serif
                      </button>
                      <button
                        onClick={() => setFontSerif(false)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-sans border cursor-pointer ${
                          !fontSerif ? 'border-[#059669] bg-[#059669]/10 font-bold' : t.border
                        }`}
                      >
                        Clean Sans
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <p className={`text-xs ${t.muted} mb-2`}>Text Size</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`py-1.5 rounded-lg text-xs font-bold border cursor-pointer uppercase ${
                            fontSize === sz ? 'border-[#059669] bg-[#059669] text-white' : t.border
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emerald Reading Progress Indicator */}
        <div className="w-full h-1 bg-[#059669]/15">
          <div
            className="h-full bg-[#059669] transition-all duration-300"
            style={{
              width: `${Math.round(((chapterIdx + 1) / story.chapters.length) * 100)}%`,
            }}
          />
        </div>
      </header>

      {/* Main Reading Workspace Split */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left 8 Cols: Manuscript Content */}
        <article className="lg:col-span-8 max-w-[70ch] mx-auto w-full">
          {/* Metadata */}
          <div className={`flex flex-wrap items-center gap-2 text-xs ${t.muted} mb-3`}>
            <span className="font-semibold text-[#059669]">{story.genre}</span>
            <span aria-hidden="true">·</span>
            <span>
              Part {currentChapter.number} of {story.chapters.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{currentChapter.wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{currentChapter.readTimeMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#059669] font-medium">
              {totalInlineInChapter} reader notes
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
            {currentChapter.title}
          </h1>

          <div className={`flex items-center justify-between pb-5 mb-8 border-b ${t.border} text-xs ${t.muted}`}>
            <span>
              By <strong className={t.text}>{story.author.name}</strong> ({story.author.handle}) · Published {currentChapter.publishedAt}
            </span>
          </div>

          {/* Interactive Paragraphs with Wattpad-style inline comments */}
          <div className={`space-y-6 ${fontSerif ? 'font-serif' : 'font-sans'} ${fontClasses[fontSize]}`}>
            {currentChapter.paragraphs.map((para, pIdx) => {
              const pNotes = currentChapter.inlineComments[pIdx] || [];
              const isSelected = activeParaIdx === pIdx;

              return (
                <div
                  key={pIdx}
                  onClick={() => setActiveParaIdx(pIdx)}
                  className={`group relative rounded-r-lg py-2 px-3 -mx-3 transition-colors duration-150 cursor-pointer ${
                    isSelected ? t.activePara : 'hover:bg-[#059669]/[0.05]'
                  }`}
                >
                  <p className="pr-12">{para}</p>

                  {/* Inline comment trigger button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveParaIdx(pIdx);
                    }}
                    aria-label={`View or add notes for paragraph ${pIdx + 1}`}
                    className={`absolute right-2 top-2.5 inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-sans font-semibold transition-opacity duration-150 cursor-pointer ${
                      pNotes.length > 0
                        ? 'opacity-100 bg-[#059669]/15 text-[#059669]'
                        : isSelected
                        ? 'opacity-100 bg-[#059669] text-white'
                        : 'opacity-0 group-hover:opacity-100 bg-[#059669]/10 text-[#059669]'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span className="font-mono tabular-nums">
                      {pNotes.length > 0 ? pNotes.length : '+'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom of Chapter Controls */}
          <div className={`mt-14 pt-8 border-t ${t.border}`}>
            <div
              className={`p-6 rounded-2xl ${t.cardBg} border ${t.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
            >
              <div>
                <h3 className="text-lg font-bold mb-1">
                  Enjoyed {currentChapter.title}?
                </h3>
                <p className={`text-xs ${t.muted}`}>
                  Leave a vote for {story.author.name} on Jeydahsan or share your thoughts below!
                </p>
              </div>
              <button
                onClick={() => onToggleChapterVote(story.id, currentChapter.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  currentChapter.isVoted
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-[#064E3B] text-white hover:bg-[#059669]'
                }`}
              >
                <Star className={`w-4 h-4 ${currentChapter.isVoted ? 'fill-current' : ''}`} />
                <span>{currentChapter.isVoted ? 'Voted' : 'Vote for Chapter'}</span>
                <span className="font-mono tabular-nums opacity-90">
                  ({currentChapter.votes.toLocaleString()})
                </span>
              </button>
            </div>

            {/* Stepper Navigation */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                disabled={chapterIdx === 0}
                onClick={() => handleChapterChange(chapterIdx - 1)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border ${t.border} disabled:opacity-30 hover:border-[#059669] transition-colors cursor-pointer whitespace-nowrap`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <span className={`text-xs font-mono tabular-nums ${t.muted}`}>
                Part {chapterIdx + 1} of {story.chapters.length}
              </span>

              <button
                disabled={chapterIdx >= story.chapters.length - 1}
                onClick={() => handleChapterChange(chapterIdx + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-30 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chapter End Discussion */}
          <div className={`mt-12 pt-8 border-t ${t.border}`}>
            <h2 className="text-xl font-bold mb-1">Chapter Discussion</h2>
            <p className={`text-xs ${t.muted} mb-6`}>
              Join {story.title} readers in discussing this chapter.
            </p>

            <form onSubmit={handleDiscussionSubmit} className="mb-8 flex gap-3">
              <input
                type="text"
                value={chapterInput}
                onChange={(e) => setChapterInput(e.target.value)}
                placeholder="Share your thoughts on this chapter..."
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm border ${t.border} ${t.cardBg} ${t.text} focus:outline-none focus:ring-2 focus:ring-[#059669]`}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            <div className={`divide-y ${t.border}`}>
              {currentChapter.chapterDiscussion.length === 0 ? (
                <p className={`text-xs ${t.muted} py-4`}>
                  No chapter comments yet. Click on any paragraph above to read or post line-by-line reactions!
                </p>
              ) : (
                currentChapter.chapterDiscussion.map((comment) => {
                  const isLiked = likedCommentIds[comment.id];
                  return (
                    <div key={comment.id} className="py-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <span className="font-bold">{comment.author}</span>
                          <span className={t.muted}>{comment.handle}</span>
                          <span className={t.muted} aria-hidden="true">
                            ·
                          </span>
                          <span className={t.muted}>{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <button
                        onClick={() => toggleLike(comment.id)}
                        className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums ${
                          isLiked ? 'text-[#059669] font-bold' : t.muted
                        } hover:text-[#059669] cursor-pointer shrink-0`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </article>

        {/* Right 4 Cols: Wattpad Signature Inline Margin Reaction Drawer */}
        <aside className="lg:col-span-4">
          <div
            className={`sticky top-24 rounded-2xl border ${t.border} ${t.cardBg} p-5 shadow-xs`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/10">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#059669]">
                  Inline Reactions
                </h2>
                <p className={`text-xs ${t.muted}`}>
                  {activeParaIdx !== null
                    ? `Paragraph ${activeParaIdx + 1} of ${currentChapter.paragraphs.length}`
                    : 'Click any paragraph to view notes'}
                </p>
              </div>
              {activeParaIdx !== null && (
                <span className="text-xs font-mono tabular-nums text-[#059669] font-bold">
                  {activeComments.length} notes
                </span>
              )}
            </div>

            {activeParaIdx !== null ? (
              <>
                <blockquote
                  className={`text-xs italic ${t.muted} border-l-2 border-[#059669] pl-3 py-1 mb-4 line-clamp-3`}
                >
                  “{currentChapter.paragraphs[activeParaIdx]}”
                </blockquote>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 mb-4">
                  {activeComments.length === 0 ? (
                    <div className={`text-xs ${t.muted} py-6 text-center`}>
                      No inline reactions on this paragraph yet. Be the first to leave one!
                    </div>
                  ) : (
                    activeComments.map((ic) => {
                      const isLiked = likedCommentIds[ic.id];
                      return (
                        <div
                          key={ic.id}
                          className={`p-3 rounded-xl border ${t.border} ${t.bg}`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold truncate">{ic.author}</span>
                              <span className={`${t.muted} truncate`}>{ic.handle}</span>
                            </div>
                            <button
                              onClick={() => toggleLike(ic.id)}
                              className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums cursor-pointer ${
                                isLiked ? 'text-[#059669] font-bold' : t.muted
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                              <span>{ic.likes + (isLiked ? 1 : 0)}</span>
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed mb-1">{ic.text}</p>
                          <span className={`text-[10px] ${t.muted}`}>{ic.timestamp}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add inline reaction form */}
                <form onSubmit={handleInlineSubmit} className="space-y-2">
                  <textarea
                    rows={2}
                    value={inlineInput}
                    onChange={(e) => setInlineInput(e.target.value)}
                    placeholder={`React to paragraph #${activeParaIdx + 1}...`}
                    className={`w-full px-3 py-2 rounded-lg text-xs border ${t.border} ${t.bg} ${t.text} focus:outline-none focus:ring-2 focus:ring-[#059669] resize-none`}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    Post Inline Reaction
                  </button>
                </form>
              </>
            ) : (
              <div className={`text-xs ${t.muted} py-8 text-center`}>
                Click any line of text in the chapter to view reader reactions or leave your own note.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
