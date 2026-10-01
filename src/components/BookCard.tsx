import React from 'react';
import { BookOpen, Bookmark, Check, Mail, MessageSquare, ShieldAlert, ThumbsDown, ThumbsUp } from 'lucide-react';
import { MAX_PAGES_PER_BOOK } from '../constants/platform';
import { Book } from '../types/truewriters';

interface BookCardProps {
  book: Book;
  theme: 'light' | 'night';
  isSaved?: boolean;
  onRead: (bookId: string, chapterIndex?: number) => void;
  onToggleSave: (bookId: string) => void;
  onOpenContactBuyer: (book: Book) => void;
  onVote: (bookId: string, type: 'up' | 'down') => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  theme,
  isSaved = false,
  onRead,
  onToggleSave,
  onOpenContactBuyer,
  onVote,
}) => {
  const isNight = theme === 'night';
  const pagePercent = Math.min(100, Math.round((book.pageCount / MAX_PAGES_PER_BOOK) * 100));

  const ratingColors: Record<string, { bg: string; text: string }> = {
    'All Ages': { bg: 'rgba(110, 139, 94, 0.15)', text: '#6E8B5E' },
    Teen: { bg: 'rgba(217, 119, 6, 0.15)', text: '#D97706' },
    Mature: { bg: 'rgba(225, 29, 72, 0.15)', text: '#E11D48' },
  };

  const ratingStyle = ratingColors[book.rating] || ratingColors['All Ages'];

  return (
    <article
      className="rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xs"
      style={{
        backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
        borderColor: isNight ? '#2C3128' : '#E4E0D4',
        color: isNight ? '#E8E6DE' : '#1C1C1A',
      }}
    >
      <div>
        {/* Top: Cover + Meta */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Cover Art */}
          <div
            onClick={() => onRead(book.id, 0)}
            className="col-span-4 aspect-[3/4] rounded-lg overflow-hidden relative cursor-pointer group shadow-xs border"
            style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
          >
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {book.seriesTitle && (
              <span className="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono px-1 py-0.5 rounded text-center truncate">
                {book.seriesTitle} #{book.seriesOrder || 1}
              </span>
            )}
          </div>

          {/* Book Info */}
          <div className="col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs mb-1">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                  style={{ backgroundColor: ratingStyle.bg, color: ratingStyle.text }}
                >
                  {book.rating}
                </span>
                <span className="text-[11px] font-medium" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                  {book.status}
                </span>
              </div>

              <h3
                onClick={() => onRead(book.id, 0)}
                className="text-base font-serif font-bold cursor-pointer transition-colors leading-snug line-clamp-2"
                style={{ color: isNight ? '#E8E6DE' : '#1C1C1A' }}
              >
                {book.title}
              </h3>

              <p className="text-xs mt-0.5" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                by <strong className="font-semibold">{book.authorName}</strong>
              </p>

              {book.showAuthorEmail && book.authorEmail && (
                <div
                  className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border max-w-full truncate"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#F0FDF4',
                    borderColor: isNight ? '#2C3128' : '#DCFCE7',
                    color: '#6E8B5E',
                  }}
                  title="Direct contact email enabled by author for producers/scouts. Disclaimer: Be careful with direct deals negotiated without our knowledge; protect yourself at all times."
                >
                  <Mail className="w-2.5 h-2.5 shrink-0 text-[#6E8B5E]" />
                  <span className="truncate">{book.authorEmail}</span>
                </div>
              )}
            </div>

            {/* Page Count Progress Meter */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-[11px] font-mono tabular-nums mb-1">
                <span style={{ color: '#6E8B5E', fontWeight: 600 }}>
                  Page {book.pageCount} of {MAX_PAGES_PER_BOOK}
                </span>
                <span style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                  {book.wordCount.toLocaleString()} words
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: isNight ? '#2C3128' : '#E4E0D4' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pagePercent}%`,
                    backgroundColor: book.pageCount >= MAX_PAGES_PER_BOOK ? '#D97706' : '#6E8B5E',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <p
          className="text-xs leading-relaxed line-clamp-3 mb-4"
          style={{ color: isNight ? '#8C9087' : '#5C5F58' }}
        >
          {book.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-4">
          {book.tags.map((tag, idx) => (
            <span
              key={tag}
              className="text-[11px]"
              style={{ color: isNight ? '#A3B899' : '#6E8B5E' }}
            >
              #{tag} {idx < book.tags.length - 1 ? '·' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div
        className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
        style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
      >
        <div className="flex items-center gap-2">
          {/* Read Free Button */}
          <button
            onClick={() => onRead(book.id, 0)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
            style={{ backgroundColor: '#6E8B5E' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Free</span>
          </button>

          {/* Save to Shelf */}
          <button
            onClick={() => onToggleSave(book.id)}
            className="p-1.5 rounded-xl border text-xs transition-colors cursor-pointer"
            style={{
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              color: isSaved ? '#6E8B5E' : isNight ? '#8C9087' : '#5C5F58',
              backgroundColor: isSaved
                ? isNight ? 'rgba(163, 184, 153, 0.15)' : 'rgba(110, 139, 94, 0.15)'
                : 'transparent',
            }}
            title={isSaved ? 'In your library' : 'Save to reading list'}
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          {/* Buyer Request Inquiry */}
          <button
            onClick={() => onOpenContactBuyer(book)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap"
            style={{
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
              color: isNight ? '#A3B899' : '#6E8B5E',
              backgroundColor: isNight ? '#12140F' : '#FDFBF4',
            }}
            title="Literary buyer / adaptation rights inquiry (0% platform fee)"
          >
            Contact Author
          </button>
        </div>

        {/* Thumbs up / down feedback */}
        <div className="flex items-center gap-2 text-xs font-mono tabular-nums" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
          <button
            onClick={() => onVote(book.id, 'up')}
            className="inline-flex items-center gap-1 hover:text-[#6E8B5E] cursor-pointer"
            title="Thumbs up"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{book.thumbsUp}</span>
          </button>
          <button
            onClick={() => onVote(book.id, 'down')}
            className="inline-flex items-center gap-1 hover:text-red-500 cursor-pointer"
            title="Thumbs down"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{book.thumbsDown}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
