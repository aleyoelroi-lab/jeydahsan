import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  Clock,
  Code,
  Eye,
  FileText,
  Heading,
  History,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  Lock,
  Plus,
  Quote,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { MAX_PAGES_PER_BOOK, MAX_PUBLIC_BOOKS_PER_USER, WORDS_PER_PAGE } from '../constants/platform';
import { Book, Chapter, ChapterVersion, ContentRating, BookStatus, User } from '../types/truewriters';
import { calculatePages, countWords } from '../utils/security';

interface EditorViewProps {
  currentUser: User;
  existingBooks: Book[];
  theme: 'light' | 'night';
  onSaveBook: (book: Book, andOpenReader?: boolean) => void;
  onStartSeriesBook2: (parentBook: Book) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  currentUser,
  existingBooks,
  theme,
  onSaveBook,
  onStartSeriesBook2,
}) => {
  const isNight = theme === 'night';

  // Filter public books by current user to enforce 7-book limit
  const myPublicBooks = existingBooks.filter(
    (b) => b.authorId === currentUser.id && b.isPublic
  );

  const [selectedBookId, setSelectedBookId] = useState<string>('new');
  const [title, setTitle] = useState<string>('The Memory Orchard');
  const [description, setDescription] = useState<string>(
    'When a botanical conservator discovers that the nocturnal orchids of Saint Jude store human memories, she must decipher her family’s past before the frost claims the conservatory.'
  );
  const [coverUrl, setCoverUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  );
  const [tagsInput, setTagsInput] = useState<string>('Botanical, Mystery, Romance, Solarpunk');
  const [rating, setRating] = useState<ContentRating>('All Ages');
  const [status, setStatus] = useState<BookStatus>('Ongoing');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // Chapters & Active Chapter
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 'ch-draft-1',
      bookId: 'new',
      order: 1,
      title: 'Chapter 1: The Scent of Cardamom',
      contentMd: `The brass key to Ward Seven smelled unmistakably of crushed cardamom and river silt.

Linnea turned it twice in the corroded lock while rain drummed a steady, impatient rhythm against the arched iron ribs overhead.

Inside the conservatory, the air was twenty degrees warmer than the Scottish autumn outside. Giant silver-veined ferns unfurled across the walkway, their fronds trembling despite the absence of any draft.

> "A flower never forgets the voice that sang to it in winter," her grandmother's journal read.`,
      wordCount: 75,
      pageCount: 1,
      updatedAt: 'Just now',
      publishedAt: '2026-09-27',
      versions: [],
    },
  ]);

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...'>('Saved');
  const [pasteToast, setPasteToast] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  // Aggregated word and page counts for the entire book
  const totalBookWords = chapters.reduce((acc, ch) => acc + ch.wordCount, 0);
  const totalBookPages = calculatePages(totalBookWords);
  const isBookAtPageLimit = totalBookPages >= MAX_PAGES_PER_BOOK;

  // Block Paste Event Handler (Section 5)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPasteToast('Pasting is disabled. Please type your work here.');
    setTimeout(() => setPasteToast(null), 3500);
  };

  // Autosave timer every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSaveStatus('Saving...');
      setTimeout(() => {
        setSaveStatus('Saved');
      }, 600);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const handleContentChange = (newMd: string) => {
    setSaveStatus('Saving...');
    const wCount = countWords(newMd);
    const pCount = calculatePages(wCount);

    setChapters((prev) =>
      prev.map((ch, idx) =>
        idx === activeChapterIndex
          ? {
              ...ch,
              contentMd: newMd,
              wordCount: wCount,
              pageCount: pCount,
              updatedAt: 'Just now',
            }
          : ch
      )
    );

    setTimeout(() => setSaveStatus('Saved'), 500);
  };

  // Snapshot version history (keeps last 20)
  const handleSaveSnapshot = () => {
    const snap: ChapterVersion = {
      id: `ver-${Date.now()}`,
      chapterId: currentChapter.id,
      contentMd: currentChapter.contentMd,
      createdAt: new Date().toLocaleTimeString(),
      wordCount: currentChapter.wordCount,
    };

    setChapters((prev) =>
      prev.map((ch, idx) => {
        if (idx !== activeChapterIndex) return ch;
        const currentVersions = ch.versions || [];
        return {
          ...ch,
          versions: [snap, ...currentVersions].slice(0, 20),
        };
      })
    );

    setSaveStatus('Saved');
  };

  const handleRestoreVersion = (ver: ChapterVersion) => {
    handleContentChange(ver.contentMd);
    setShowVersionHistory(false);
  };

  // Add Chapter
  const handleAddChapter = () => {
    if (isBookAtPageLimit) {
      alert('This book has reached the maximum 500 pages. Please start Book 2 in the series.');
      return;
    }

    const nextOrder = chapters.length + 1;
    const newCh: Chapter = {
      id: `ch-draft-${Date.now()}`,
      bookId: selectedBookId,
      order: nextOrder,
      title: `Chapter ${nextOrder}: Untitled`,
      contentMd: `Begin writing Chapter ${nextOrder} here...\n\nEvery line you type is protected from unauthorized copying.`,
      wordCount: 15,
      pageCount: 1,
      updatedAt: 'Just now',
      publishedAt: 'Draft',
      versions: [],
    };

    setChapters([...chapters, newCh]);
    setActiveChapterIndex(chapters.length);
  };

  const handleInsertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;

    const updated = text.substring(0, start) + replacement + text.substring(end);
    handleContentChange(updated);
  };

  const handleSaveBook = (openReader = false) => {
    // Check 7 public books limit
    if (isPublic && myPublicBooks.length >= MAX_PUBLIC_BOOKS_PER_USER && selectedBookId === 'new') {
      alert(
        `Publication limit reached: You have ${MAX_PUBLIC_BOOKS_PER_USER} public books. You can save this book as a private draft or unpublish an older book.`
      );
      return;
    }

    const bookObj: Book = {
      id: selectedBookId === 'new' ? `book-${Date.now()}` : selectedBookId,
      authorId: currentUser.id,
      authorName: currentUser.penName,
      title: title.trim() || 'Untitled Book',
      description: description.trim() || 'No description provided.',
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      rating,
      status,
      isPublic,
      pageCount: totalBookPages,
      wordCount: totalBookWords,
      createdAt: '2026-09-27',
      publishedAt: isPublic ? '2026-09-27' : undefined,
      reads: 12,
      thumbsUp: 3,
      thumbsDown: 0,
      chapters,
    };

    onSaveBook(bookObj, openReader);
  };

  return (
    <div
      className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 transition-colors"
      style={{ color: isNight ? '#E8E6DE' : '#1C1C1A' }}
    >
      {/* Toast */}
      {pasteToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-amber-900 text-amber-100 shadow-2xl border border-amber-600 flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-300" />
          <p className="text-xs font-semibold">{pasteToast}</p>
        </div>
      )}

      {/* Header bar: limits & actions */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b"
        style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2" style={{ color: '#6E8B5E' }}>
            <span>Markdown Writing Suite</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold">1 Page = {WORDS_PER_PAGE} Words</span>
            <span aria-hidden="true">·</span>
            <span>Public Slots: {myPublicBooks.length} of {MAX_PUBLIC_BOOKS_PER_USER} Used</span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Manuscript Studio</h1>
        </div>

        {/* Top controls: Save Draft, Publish, Autosave status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border"
            style={{
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              color: isNight ? '#8C9087' : '#5C5F58',
            }}
          >
            <Clock className="w-3.5 h-3.5 text-[#6E8B5E]" />
            <span>{saveStatus}</span>
          </div>

          <button
            type="button"
            onClick={() => handleSaveBook(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
            style={{
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => handleSaveBook(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
            style={{ backgroundColor: '#6E8B5E' }}
          >
            <BookOpen className="w-4 h-4" />
            <span>Publish & Open Reader</span>
          </button>
        </div>
      </div>

      {/* 500-Page Limit Warning & Series Next Book Banner */}
      {isBookAtPageLimit ? (
        <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Maximum 500 Pages Reached for this Book</span>
            </h3>
            <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              Jeydahsan books cap at 500 pages ({MAX_PAGES_PER_BOOK * WORDS_PER_PAGE} words) to guarantee optimal reader retention and loading speeds.
            </p>
          </div>
          <button
            onClick={() => {
              const currentBookObj: Book = {
                id: selectedBookId,
                authorId: currentUser.id,
                authorName: currentUser.penName,
                title,
                description,
                coverUrl,
                tags: tagsInput.split(',').map((t) => t.trim()),
                rating,
                status: 'Completed',
                isPublic,
                pageCount: totalBookPages,
                wordCount: totalBookWords,
                createdAt: '2026-09-27',
                reads: 10,
                thumbsUp: 2,
                thumbsDown: 0,
                chapters,
              };
              onStartSeriesBook2(currentBookObj);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            + Start Book 2 in Series
          </button>
        </div>
      ) : (
        /* Live Page Meter Progress Bar */
        <div
          className="mb-8 p-4 rounded-2xl border"
          style={{
            backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
            borderColor: isNight ? '#2C3128' : '#E4E0D4',
          }}
        >
          <div className="flex justify-between items-center text-xs font-mono tabular-nums mb-2">
            <span style={{ color: '#6E8B5E', fontWeight: 700 }}>
              Live Book Progress: Page {totalBookPages} of {MAX_PAGES_PER_BOOK}
            </span>
            <span style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              {totalBookWords.toLocaleString()} total words · {chapters.length} chapters
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: isNight ? '#2C3128' : '#E4E0D4' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (totalBookPages / MAX_PAGES_PER_BOOK) * 100)}%`,
                backgroundColor: '#6E8B5E',
              }}
            />
          </div>
        </div>
      )}

      {/* Editor Grid: Metadata Left, Markdown Workspace Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Book Details & Non-blocking Cover Advice */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className="p-6 rounded-3xl border shadow-xs space-y-4"
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <h3 className="text-base font-bold font-serif">Book Details</h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#E8E6DE' : '#1C1C1A',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold mb-1">Blurb / Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#E8E6DE' : '#1C1C1A',
                }}
              />
            </div>

            {/* Cover Image Upload + Advisory Notice (Section 4) */}
            <div>
              <label className="block text-xs font-bold mb-1">Cover Image URL</label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#E8E6DE' : '#1C1C1A',
                }}
              />

              {/* Exact recommendation notice from spec */}
              <div
                className="mt-2.5 p-3 rounded-xl border text-[11px] leading-relaxed"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#F4F1E8',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#8C9087' : '#5C5F58',
                }}
              >
                <strong className="block text-[#6E8B5E] font-semibold mb-0.5">Cover Recommendation:</strong>
                Recommended: use your own original artwork, a commissioned piece, or an AI-generated image. Please avoid using artwork made by other artists without their permission.
              </div>
            </div>

            {/* Content Rating & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Content Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value as ContentRating)}
                  className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    color: isNight ? '#E8E6DE' : '#1C1C1A',
                  }}
                >
                  <option value="All Ages">All Ages</option>
                  <option value="Teen">Teen</option>
                  <option value="Mature">Mature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookStatus)}
                  className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    color: isNight ? '#E8E6DE' : '#1C1C1A',
                  }}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Hiatus">Hiatus</option>
                </select>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold">Public Publication</span>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isPublic ? 'bg-[#6E8B5E] text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {isPublic ? 'Public Book' : 'Private Draft'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Chapter Tabs & Markdown Writing Desk */}
        <div className="lg:col-span-8 space-y-4">
          {/* Chapter Tabs & Add Chapter */}
          <div
            className="p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 shadow-xs"
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeChapterIndex === idx ? 'bg-[#6E8B5E] text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Part {idx + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={isBookAtPageLimit}
                onClick={handleAddChapter}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-30"
                style={{
                  borderColor: '#6E8B5E',
                  color: '#6E8B5E',
                  backgroundColor: isNight ? 'rgba(163, 184, 153, 0.1)' : 'rgba(110, 139, 94, 0.1)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </button>
            </div>

            {/* Version History Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveSnapshot}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border hover:bg-black/5 cursor-pointer"
                style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                title="Create revision snapshot"
              >
                <Save className="w-3 h-3 text-[#6E8B5E]" />
                <span>Snapshot</span>
              </button>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border hover:bg-black/5 cursor-pointer"
                style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                title="View previous 20 revisions"
              >
                <History className="w-3 h-3 text-[#6E8B5E]" />
                <span>History ({currentChapter.versions?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Version History Drawer (if opened) */}
          {showVersionHistory && (
            <div
              className="p-4 rounded-2xl border space-y-2 text-xs"
              style={{
                backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="flex justify-between items-center font-bold text-[#6E8B5E]">
                <span>Version Snapshots (Last 20)</span>
                <button onClick={() => setShowVersionHistory(false)}>Close</button>
              </div>
              {(!currentChapter.versions || currentChapter.versions.length === 0) ? (
                <p style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                  No snapshots recorded yet. Click "Snapshot" to save a restore point.
                </p>
              ) : (
                <div className="divide-y" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                  {currentChapter.versions.map((ver) => (
                    <div key={ver.id} className="py-2 flex items-center justify-between">
                      <span>Saved at {ver.createdAt} ({ver.wordCount} words)</span>
                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-2 py-1 rounded bg-[#6E8B5E] text-white text-[11px] font-bold"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chapter Title & Formatting Toolbar */}
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4"
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1" style={{ color: '#6E8B5E' }}>
                Chapter Heading
              </label>
              <input
                type="text"
                value={currentChapter.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setChapters((prev) =>
                    prev.map((ch, i) => (i === activeChapterIndex ? { ...ch, title: val } : ch))
                  );
                }}
                className="w-full text-xl sm:text-2xl font-serif font-bold bg-transparent border-b pb-2 focus:outline-none focus:border-[#6E8B5E]"
                style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
              />
            </div>

            {/* Markdown Toolbar */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
              style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
            >
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('### ')}
                  className="p-1.5 rounded-lg border hover:bg-black/5"
                  title="Heading 3"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('**', '**')}
                  className="p-1.5 rounded-lg border hover:bg-black/5 font-bold"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('*', '*')}
                  className="p-1.5 rounded-lg border hover:bg-black/5 italic"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('> ')}
                  className="p-1.5 rounded-lg border hover:bg-black/5"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('- ')}
                  className="p-1.5 rounded-lg border hover:bg-black/5"
                  title="List item"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('[', '](https://example.com)')}
                  className="p-1.5 rounded-lg border hover:bg-black/5"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('```\n', '\n```')}
                  className="p-1.5 rounded-lg border hover:bg-black/5"
                  title="Code block"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdown('\n\n---\n\n')}
                  className="px-2 py-1 rounded-lg border hover:bg-black/5 text-[11px] font-mono"
                  title="Horizontal Rule"
                >
                  HR
                </button>
              </div>

              {/* Live Preview Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    showPreview ? 'bg-[#6E8B5E] text-white border-[#6E8B5E]' : ''
                  }`}
                  style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? 'Editor & Preview' : 'Preview Live'}</span>
                </button>
              </div>
            </div>

            {/* Markdown Textarea with PASTE BLOCKED (Section 5) */}
            <div className={`grid ${showPreview ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
              <div className="relative">
                <textarea
                  id="markdown-editor"
                  rows={18}
                  onPaste={handlePaste}
                  value={currentChapter.contentMd}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Type your manuscript in Markdown here. Note: Pasting is disabled to enforce original composition."
                  className="w-full font-serif text-[16px] leading-[1.7] bg-transparent focus:outline-none resize-y p-1"
                />
                <div className="text-[11px] font-mono opacity-60 pt-2 flex justify-between">
                  <span>Pasting is disabled on Jeydahsan.</span>
                  <span>{currentChapter.wordCount} words in this chapter</span>
                </div>
              </div>

              {/* Side-by-side Markdown Render Preview */}
              {showPreview && (
                <div
                  className="p-4 rounded-2xl border overflow-y-auto max-h-[460px] font-serif text-[16px] leading-[1.7] space-y-4"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#6E8B5E] pb-2 border-b">
                    Live Reader Preview
                  </h4>
                  {currentChapter.contentMd.split(/\n\s*\n/).map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
