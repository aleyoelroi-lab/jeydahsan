import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Coffee,
  CornerDownRight,
  Lock,
  MessageSquare,
  PenTool,
  Pin,
  Plus,
  Send,
  Sparkles,
  ThumbsUp,
  X,
} from 'lucide-react';
import { FORUM_CATEGORIES, INITIAL_FORUM_THREADS } from '../data/mockData';
import { ForumPost, ForumThread, User } from '../types/truewriters';

interface ForumViewProps {
  currentUser: User;
  theme: 'light' | 'night';
  onOpenReport: (targetType: 'forum_post', targetId: string, title: string) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  currentUser,
  theme,
  onOpenReport,
}) => {
  const isNight = theme === 'night';
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [threads, setThreads] = useState<ForumThread[]>(INITIAL_FORUM_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // New thread modal
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>('');
  const [newThreadCategory, setNewThreadCategory] = useState<string>('cat-general');
  const [newThreadBody, setNewThreadBody] = useState<string>('');

  // Reply state
  const [replyBody, setReplyBody] = useState<string>('');
  const [quoteSnippet, setQuoteSnippet] = useState<string | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const filteredThreads = selectedCategoryId === 'all'
    ? threads
    : threads.filter((t) => t.categoryId === selectedCategoryId);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadBody.trim()) return;

    if (!currentUser.emailVerified) {
      alert('You must verify your email with OTP before posting in the community forum.');
      return;
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}-1`,
      threadId: `thread-${Date.now()}`,
      authorId: currentUser.id,
      authorPenName: currentUser.penName,
      contentMd: newThreadBody.trim(),
      createdAt: 'Just now',
      upvotes: 1,
    };

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      categoryId: newThreadCategory,
      title: newThreadTitle.trim(),
      authorId: currentUser.id,
      authorPenName: currentUser.penName,
      createdAt: 'Just now',
      posts: [newPost],
      upvotes: 1,
    };

    setThreads([newThread, ...threads]);
    setShowNewThreadModal(false);
    setNewThreadTitle('');
    setNewThreadBody('');
    setActiveThreadId(newThread.id);
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !activeThread) return;

    if (!currentUser.emailVerified) {
      alert('You must verify your email with OTP before posting in the community forum.');
      return;
    }

    const fullContent = quoteSnippet
      ? `> ${quoteSnippet}\n\n${replyBody.trim()}`
      : replyBody.trim();

    const replyPost: ForumPost = {
      id: `post-${Date.now()}`,
      threadId: activeThread.id,
      authorId: currentUser.id,
      authorPenName: currentUser.penName,
      contentMd: fullContent,
      createdAt: 'Just now',
      upvotes: 1,
    };

    setThreads(
      threads.map((t) =>
        t.id === activeThread.id ? { ...t, posts: [...t.posts, replyPost] } : t
      )
    );

    setReplyBody('');
    setQuoteSnippet(null);
  };

  const handleToggleUpvoteThread = (threadId: string) => {
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t
      )
    );
  };

  const handleToggleLock = (threadId: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') return;
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, isLocked: !t.isLocked } : t
      )
    );
  };

  const handleTogglePin = (threadId: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') return;
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, isPinned: !t.isPinned } : t
      )
    );
  };

  return (
    <div
      className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 transition-colors"
      style={{ color: isNight ? '#E8E6DE' : '#1C1C1A' }}
    >
      {/* Forum Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b"
        style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1" style={{ color: '#6E8B5E' }}>
            <span>Jeydahsan Community</span>
            <span aria-hidden="true">·</span>
            <span>Discussions, Feedback & Book Clubs</span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">The Writer's Lounge</h1>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
          style={{ backgroundColor: '#6E8B5E' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Main Forum Split: Categories Left, Threads / Active Thread Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Category Boards */}
        <div className="lg:col-span-4 space-y-3">
          <button
            onClick={() => {
              setSelectedCategoryId('all');
              setActiveThreadId(null);
            }}
            className={`w-full p-4 rounded-2xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
              selectedCategoryId === 'all' && !activeThreadId
                ? 'font-bold'
                : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: selectedCategoryId === 'all' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <span>All Community Boards</span>
            <span className="text-xs font-mono opacity-60">{threads.length} threads</span>
          </button>

          {FORUM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setActiveThreadId(null);
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                selectedCategoryId === cat.id && !activeThreadId
                  ? 'border-[#6E8B5E] font-bold'
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: selectedCategoryId === cat.id ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold">{cat.name}</h3>
                <span className="text-xs font-mono text-[#6E8B5E]">{cat.threadCount}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                {cat.description}
              </p>
            </button>
          ))}
        </div>

        {/* Right 8 Cols: Thread View OR Threads List */}
        <div className="lg:col-span-8">
          {activeThread ? (
            /* Active Thread Detail View */
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                <button
                  onClick={() => setActiveThreadId(null)}
                  className="text-xs font-bold text-[#6E8B5E] hover:underline cursor-pointer"
                >
                  ← Back to threads list
                </button>

                {/* Moderator Controls */}
                {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <button
                      onClick={() => handleTogglePin(activeThread.id)}
                      className="px-2 py-1 rounded border text-[11px] cursor-pointer"
                      style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                    >
                      {activeThread.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={() => handleToggleLock(activeThread.id)}
                      className="px-2 py-1 rounded border text-[11px] cursor-pointer"
                      style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                    >
                      {activeThread.isLocked ? 'Unlock' : 'Lock'}
                    </button>
                  </div>
                )}
              </div>

              {/* Thread Title */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono" style={{ color: '#6E8B5E' }}>
                  {activeThread.isPinned && <span className="flex items-center gap-1 font-bold"><Pin className="w-3 h-3" /> Pinned</span>}
                  {activeThread.isLocked && <span className="flex items-center gap-1 font-bold text-amber-600"><Lock className="w-3 h-3" /> Locked</span>}
                  <span>Started by {activeThread.authorPenName} · {activeThread.createdAt}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold tracking-tight">{activeThread.title}</h2>
              </div>

              {/* Posts in Thread */}
              <div className="space-y-6 divide-y" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                {activeThread.posts.map((post, pIdx) => (
                  <div key={post.id} className={`${pIdx > 0 ? 'pt-6' : ''} space-y-3`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <div className="w-6 h-6 rounded-full bg-[#6E8B5E] text-white flex items-center justify-center text-xs">
                          {post.authorPenName.slice(0, 1)}
                        </div>
                        <span>{post.authorPenName}</span>
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                        {post.createdAt}
                      </span>
                    </div>

                    <div className="text-sm font-serif leading-[1.7] whitespace-pre-line pl-8">
                      {post.contentMd}
                    </div>

                    <div className="flex items-center justify-end gap-3 text-xs pt-1">
                      <button
                        onClick={() => setQuoteSnippet(post.contentMd.slice(0, 120))}
                        className="text-[11px] hover:text-[#6E8B5E] cursor-pointer flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Quote</span>
                      </button>
                      <button
                        onClick={() => onOpenReport('forum_post', post.id, `Forum post by ${post.authorPenName}`)}
                        className="text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form (if not locked) */}
              {activeThread.isLocked ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 font-semibold text-center">
                  This discussion thread is locked by a moderator. No further replies can be posted.
                </div>
              ) : (
                <form onSubmit={handlePostReply} className="pt-6 border-t space-y-3" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                  {quoteSnippet && (
                    <div
                      className="p-3 rounded-xl border text-xs italic flex justify-between items-center"
                      style={{
                        backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                        borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <span className="line-clamp-2">“{quoteSnippet}”</span>
                      <button onClick={() => setQuoteSnippet(null)} className="ml-2 font-bold text-red-500">×</button>
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write your reply in Markdown..."
                    className="w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      color: isNight ? '#E8E6DE' : '#1C1C1A',
                    }}
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-[11px]" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                      {!currentUser.emailVerified ? '🔒 Email verification required' : 'Markdown formatting enabled'}
                    </span>
                    <button
                      type="submit"
                      disabled={!currentUser.emailVerified}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-40"
                      style={{ backgroundColor: '#6E8B5E' }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Threads Listing */
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className="p-5 rounded-3xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs flex items-center justify-between gap-4"
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#6E8B5E' }}>
                      {thread.isPinned && <Pin className="w-3 h-3 text-[#6E8B5E]" />}
                      {thread.isLocked && <Lock className="w-3 h-3 text-amber-600" />}
                      <span>By {thread.authorPenName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{thread.createdAt}</span>
                    </div>

                    <h3 className="text-base font-serif font-bold truncate">{thread.title}</h3>

                    <p className="text-xs line-clamp-1" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                      {thread.posts[0]?.contentMd}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                    <span className="inline-flex items-center gap-1" style={{ color: '#6E8B5E' }}>
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{thread.posts.length}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleUpvoteThread(thread.id);
                      }}
                      className="inline-flex items-center gap-1 hover:text-[#6E8B5E] cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{thread.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowNewThreadModal(false)}
        >
          <div
            className="w-full max-w-xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              <h3 className="text-lg font-serif font-bold">Start a Community Discussion</h3>
              <button onClick={() => setShowNewThreadModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Board Category</label>
                <select
                  value={newThreadCategory}
                  onChange={(e) => setNewThreadCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  {FORUM_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Thread Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="What is your question or topic?"
                  className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Initial Post Content (Markdown)</label>
                <textarea
                  rows={6}
                  value={newThreadBody}
                  onChange={(e) => setNewThreadBody(e.target.value)}
                  placeholder="Share your thoughts, ask questions, or provide context..."
                  className="w-full p-3 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: '#6E8B5E' }}
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
