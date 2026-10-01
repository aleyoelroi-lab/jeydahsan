import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Check,
  FolderPlus,
  Mail,
  MessageSquare,
  ShieldAlert,
  Star,
  X,
} from 'lucide-react';
import { ReadingList, Story } from '../types/story';
import { BookCoverArt } from './BookCoverArt';

interface StoryDetailModalProps {
  story: Story;
  readingLists: ReadingList[];
  onClose: () => void;
  onReadChapter: (storyId: string, chapterIndex: number) => void;
  onToggleSave: (storyId: string) => void;
  onToggleStoryVote: (storyId: string) => void;
  onAssignToReadingList: (listId: string, storyId: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  readingLists,
  onClose,
  onReadChapter,
  onToggleSave,
  onToggleStoryVote,
  onAssignToReadingList,
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(
    readingLists[0]?.id || ''
  );
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const totalWords = story.chapters.reduce((acc, ch) => acc + ch.wordCount, 0);
  const totalNotes = story.chapters.reduce((acc, ch) => {
    const sum = (
      Object.values(ch.inlineComments) as Array<Array<unknown>>
    ).reduce((s, arr) => s + arr.length, 0);
    return acc + sum;
  }, 0);

  const handleAddToList = () => {
    if (!selectedListId) return;
    onAssignToReadingList(selectedListId, story.id);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#062418]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#E2ECE5] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close story details"
          className="absolute right-5 top-5 p-2 rounded-full text-[#4B6356] hover:text-[#064E3B] hover:bg-[#F2F8F4] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Story Header Split */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 pb-8 border-b border-[#E2ECE5]">
          <div className="sm:col-span-4 max-w-[200px] sm:max-w-none mx-auto w-full">
            <BookCoverArt
              title={story.title}
              author={story.author.name}
              theme={story.coverTheme}
            />
          </div>

          <div className="sm:col-span-8 flex flex-col justify-between">
            <div>
              {/* Category, Status, Ranking */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B6356] mb-2 font-medium">
                <span className="text-[#059669] font-bold">{story.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{story.status}</span>
                {story.ranking && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#047857] font-semibold">
                      #{story.ranking} in {story.genre}
                    </span>
                  </>
                )}
                {story.contestBadge && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#059669] font-bold">
                      {story.contestBadge}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0C2417] tracking-tight mb-2">
                {story.title}
              </h2>

              <p className="text-xs text-[#4B6356] mb-4">
                By <span className="font-bold text-[#0C2417]">{story.author.name}</span>{' '}
                ({story.author.handle}) · {story.author.followers} readers
              </p>

              {/* Tabular Stats Pill Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#0C2417] font-mono tabular-nums py-2.5 px-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] mb-4">
                <span>{story.reads.toLocaleString()} Reads</span>
                <span className="text-[#059669]/40" aria-hidden="true">·</span>
                <span>{story.votes.toLocaleString()} Votes</span>
                <span className="text-[#059669]/40" aria-hidden="true">·</span>
                <span>{story.chapters.length} Parts</span>
                <span className="text-[#059669]/40" aria-hidden="true">·</span>
                <span>{totalWords.toLocaleString()} Words</span>
                <span className="text-[#059669]/40" aria-hidden="true">·</span>
                <span>{totalNotes} Inline Notes</span>
              </div>

              <p className="text-sm text-[#0C2417] leading-relaxed mb-4">
                {story.synopsis}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#4B6356] mb-6">
                <span className="font-semibold text-[#0C2417]">Tags:</span>
                {story.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>#{tag}</span>
                    {idx < story.tags.length - 1 && (
                      <span aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Producer Direct Contact & Safety Notice */}
              <div className="mb-6 p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#059669]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Producer & Scout Inquiries</span>
                </div>
                <p className="text-xs text-[#0C2417] opacity-85">
                  Direct inquiry contact: <strong className="font-mono text-[#059669]">rowan.vance@gmail.com</strong>
                </p>
                <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> Authors and producers must be careful with any direct deals negotiated without platform mediation. All parties must take care of themselves and protect their legal, publishing, and financial interests at all times.
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onReadChapter(story.id, 0)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Reading Part 1</span>
                </button>

                <button
                  onClick={() => onToggleSave(story.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    story.isSaved
                      ? 'border-[#059669] bg-[#ECFDF5] text-[#059669]'
                      : 'border-[#E2ECE5] bg-white text-[#0C2417] hover:border-[#059669]'
                  }`}
                >
                  {story.isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In Library</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Add to Library</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleStoryVote(story.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    story.isVoted
                      ? 'border-[#059669] bg-[#059669] text-white shadow-xs'
                      : 'border-[#E2ECE5] bg-white text-[#0C2417] hover:border-[#059669]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${story.isVoted ? 'fill-current' : ''}`} />
                  <span>{story.isVoted ? 'Voted' : 'Vote'}</span>
                </button>
              </div>

              {/* Add to custom list */}
              <div className="flex items-center gap-2 pt-2">
                <select
                  aria-label="Add to reading shelf"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                >
                  {readingLists.map((rl) => (
                    <option key={rl.id} value={rl.id}>
                      Add to: {rl.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddToList}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#059669] bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{addedToast ? 'Added to Shelf!' : 'Save to Shelf'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Table */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0C2417]">
              Table of Contents ({story.chapters.length} Parts)
            </h3>
            <span className="text-xs text-[#4B6356]">Click any part to read</span>
          </div>

          <div className="divide-y divide-[#E2ECE5] border border-[#E2ECE5] rounded-2xl bg-white overflow-hidden shadow-xs">
            {story.chapters.map((ch, idx) => {
              const notesCount = (
                Object.values(ch.inlineComments) as Array<Array<unknown>>
              ).reduce((acc, arr) => acc + arr.length, 0);

              return (
                <button
                  key={ch.id}
                  onClick={() => onReadChapter(story.id, idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F0FDF4] transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0C2417] group-hover:text-[#059669] transition-colors truncate">
                      {ch.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#4B6356] mt-0.5">
                      <span>{ch.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{ch.wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{ch.readTimeMinutes} min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#4B6356] font-mono tabular-nums shrink-0">
                    <span className="inline-flex items-center gap-1 text-[#059669] font-medium">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {notesCount}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#059669] font-medium">
                      <Star className="w-3.5 h-3.5" />
                      {ch.votes.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
