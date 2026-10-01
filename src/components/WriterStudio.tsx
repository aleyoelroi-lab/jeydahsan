import React, { useState } from 'react';
import { BookOpen, Check, Plus, Sparkles, Trash2 } from 'lucide-react';
import { CoverTheme, Story, StoryGenre } from '../types/story';
import { BookCoverArt } from './BookCoverArt';

interface WriterStudioProps {
  existingStories: Story[];
  onPublishStory: (story: Story, openReaderAfter: boolean) => void;
}

const GENRES: StoryGenre[] = [
  'Romance',
  'Fantasy',
  'Teen Fiction',
  'Mystery',
  'Sci-Fi',
  'Paranormal',
  'Poetry',
];

const COVER_THEMES: { id: CoverTheme; label: string }[] = [
  { id: 'emerald-botanical', label: 'Emerald Botanical' },
  { id: 'mint-constellation', label: 'Mint Constellation' },
  { id: 'forest-silhouette', label: 'Forest Pine Silhouette' },
  { id: 'jade-arch', label: 'Jade Archway' },
  { id: 'sage-minimal', label: 'Sage Minimalist' },
  { id: 'pine-vintage', label: 'Vintage Pine Crest' },
];

export const WriterStudio: React.FC<WriterStudioProps> = ({
  existingStories,
  onPublishStory,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('new');
  const [title, setTitle] = useState<string>('Leaves of Saint Jude');
  const [authorName, setAuthorName] = useState<string>('Jeyda Hasan');
  const [genre, setGenre] = useState<StoryGenre>('Romance');
  const [status, setStatus] = useState<'Ongoing' | 'Completed'>('Ongoing');
  const [coverTheme, setCoverTheme] = useState<CoverTheme>('emerald-botanical');
  const [synopsis, setSynopsis] = useState<string>(
    'In a forgotten greenhouse bordering an ancient estate, two rivals find common ground in the language of rare orchids and late night letters.'
  );
  const [tagsInput, setTagsInput] = useState<string>(
    'Greenhouse, Slow Burn, Botanist, Rivals, Romance'
  );

  const [chapters, setChapters] = useState<
    { id: string; title: string; bodyText: string }[]
  >([
    {
      id: 'draft-ch-1',
      title: 'Part 1: The Midnight Conservatory',
      bodyText: `The scent of damp fern and cold rain filled the air as the key turned in the padlock.\n\nShe pulled her emerald coat tighter around herself, her flashlight beam cutting through the misty air of Saint Jude's north wing.\n\n"You weren't supposed to find this place," he said quietly from the iron catwalk above.`,
    },
  ]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSelectStory = (id: string) => {
    setSelectedStoryId(id);
    if (id === 'new') {
      setTitle('Leaves of Saint Jude');
      setAuthorName('Jeyda Hasan');
      setGenre('Romance');
      setStatus('Ongoing');
      setCoverTheme('emerald-botanical');
      setSynopsis(
        'In a forgotten greenhouse bordering an ancient estate, two rivals find common ground in the language of rare orchids and late night letters.'
      );
      setTagsInput('Greenhouse, Slow Burn, Botanist, Rivals, Romance');
      setChapters([
        {
          id: 'draft-ch-1',
          title: 'Part 1: The Midnight Conservatory',
          bodyText: `The scent of damp fern and cold rain filled the air as the key turned in the padlock.\n\nShe pulled her emerald coat tighter around herself, her flashlight beam cutting through the misty air of Saint Jude's north wing.\n\n"You weren't supposed to find this place," he said quietly from the iron catwalk above.`,
        },
      ]);
      setActiveChapterIdx(0);
      return;
    }

    const s = existingStories.find((item) => item.id === id);
    if (!s) return;
    setTitle(s.title);
    setAuthorName(s.author.name);
    setGenre(s.genre);
    setStatus(s.status);
    setCoverTheme(s.coverTheme);
    setSynopsis(s.synopsis);
    setTagsInput(s.tags.join(', '));
    setChapters(
      s.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        bodyText: ch.paragraphs.join('\n\n'),
      }))
    );
    setActiveChapterIdx(0);
  };

  const currChapter = chapters[activeChapterIdx] || chapters[0];
  const wordCount = currChapter.bodyText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));

  const updateChapterField = (field: 'title' | 'bodyText', val: string) => {
    setChapters((prev) =>
      prev.map((c, i) => (i === activeChapterIdx ? { ...c, [field]: val } : c))
    );
  };

  const handleAddChapter = () => {
    const nextNum = chapters.length + 1;
    const newCh = {
      id: `ch-user-${Date.now()}`,
      title: `Part ${nextNum}: New Chapter`,
      bodyText: `Write the story for Part ${nextNum} here. Separate your paragraphs with double line breaks so readers on Jeydahsan can comment directly on your lines.`,
    };
    setChapters((prev) => [...prev, newCh]);
    setActiveChapterIdx(chapters.length);
  };

  const handleDeleteChapter = (idx: number) => {
    if (chapters.length <= 1) return;
    const filtered = chapters.filter((_, i) => i !== idx);
    setChapters(filtered);
    setActiveChapterIdx(Math.max(0, idx - 1));
  };

  const insertPromptSnippet = () => {
    const snippet = `"The rain won't stop until morning," he murmured, his fingers brushing against hers on the edge of the wooden bench.`;
    updateChapterField(
      'bodyText',
      `${currChapter.bodyText.trimEnd()}\n\n${snippet}`
    );
  };

  const handleSaveAndPublish = (openReaderAfter: boolean) => {
    const existing = existingStories.find((s) => s.id === selectedStoryId);
    const id = existing ? existing.id : `story-user-${Date.now()}`;

    const builtChapters = chapters.map((ch, idx) => {
      const existingCh = existing?.chapters.find((c) => c.id === ch.id);
      const paragraphs = ch.bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      const words = ch.bodyText.trim().split(/\s+/).filter(Boolean).length;

      return {
        id: ch.id,
        number: idx + 1,
        title: ch.title.trim() || `Part ${idx + 1}`,
        publishedAt: existingCh ? existingCh.publishedAt : 'Just now',
        wordCount: words,
        readTimeMinutes: Math.max(1, Math.ceil(words / 220)),
        votes: existingCh ? existingCh.votes : 1,
        isVoted: true,
        paragraphs:
          paragraphs.length > 0 ? paragraphs : ['Awaiting first paragraph.'],
        inlineComments: existingCh ? existingCh.inlineComments : {},
        chapterDiscussion: existingCh ? existingCh.chapterDiscussion : [],
      };
    });

    const newStory: Story = {
      id,
      title: title.trim() || 'Untitled Story',
      author: {
        name: authorName.trim() || 'Jeyda Hasan',
        handle: `@${(authorName || 'jeydahsan').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        bio: 'Published author on Jeydahsan.',
        followers: existing ? existing.author.followers : '1.4k',
      },
      genre,
      status,
      reads: existing ? existing.reads : 140,
      votes: existing ? existing.votes : 18,
      isVoted: true,
      isSaved: true,
      readingProgress: {
        chapterIndex: 0,
        percentage: 100,
      },
      updatedAt: 'Updated moments ago',
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      synopsis:
        synopsis.trim() || 'An original serialized story written on Jeydahsan.',
      coverTheme,
      chapters: builtChapters,
    };

    onPublishStory(newStory, openReaderAfter);
    setSelectedStoryId(newStory.id);
    setSavedNotice(`Published "${newStory.title}" to Jeydahsan!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#E2ECE5]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#059669] font-bold uppercase tracking-wider mb-2">
            <span>Jeydahsan Writer Studio</span>
            <span aria-hidden="true">·</span>
            <span>Publish Your Web Novels</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#0C2417]">
            Create & Serialized Publishing
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Select draft to edit"
            value={selectedStoryId}
            onChange={(e) => handleSelectStory(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2ECE5] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669] cursor-pointer"
          >
            <option value="new">+ Start New Story</option>
            {existingStories.map((s) => (
              <option key={s.id} value={s.id}>
                Edit: {s.title} ({s.chapters.length} parts)
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleSaveAndPublish(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#064E3B] text-[#064E3B] hover:bg-[#F0FDF4] transition-colors cursor-pointer whitespace-nowrap"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveAndPublish(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Publish & Open Reader</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="mb-6 p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#064E3B] font-semibold">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#059669]" />
            <span>{savedNotice}</span>
          </div>
        </div>
      )}

      {/* Main Studio 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Book Cover & Metadata Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2ECE5] shadow-xs">
            <div className="w-44 mx-auto mb-6">
              <BookCoverArt
                title={title || 'Story Title'}
                author={authorName || 'Author Name'}
                theme={coverTheme}
                badge="JEYDAHSAN"
              />
            </div>

            {/* Cover Theme Picker */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
                Cover Art Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COVER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setCoverTheme(theme.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-colors cursor-pointer truncate ${
                      coverTheme === theme.id
                        ? 'border-[#059669] bg-[#ECFDF5] text-[#064E3B] font-bold shadow-xs'
                        : 'border-[#E2ECE5] text-[#4B6356] hover:text-[#0C2417]'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0C2417] mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0C2417] mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0C2417] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'Ongoing' | 'Completed')
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2417] mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as StoryGenre)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2417] mb-1">
                  Synopsis / Blurb
                </label>
                <textarea
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2417] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2ECE5] bg-[#F8FAF8] text-[#0C2417] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Manuscript Writing Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chapter Tabs & Add Part */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2ECE5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeChapterIdx === idx
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-[#F0FDF4] text-[#064E3B] hover:bg-[#DCFCE7]'
                  }`}
                >
                  Part {idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddChapter}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#059669] bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Part</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#4B6356] font-mono tabular-nums">
              <span>{wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span>~{readTime} min read</span>
              {chapters.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteChapter(activeChapterIdx)}
                  className="text-red-600 hover:text-red-700 ml-2 cursor-pointer"
                  title="Delete chapter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Chapter Editor Canvas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2ECE5] shadow-xs">
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B6356] mb-1">
                Chapter Title
              </label>
              <input
                type="text"
                value={currChapter.title}
                onChange={(e) => updateChapterField('title', e.target.value)}
                className="w-full text-xl sm:text-2xl font-serif font-bold text-[#0C2417] bg-transparent border-b border-[#E2ECE5] pb-2 focus:outline-none focus:border-[#059669]"
              />
            </div>

            {/* Quick Prompts Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E2ECE5]">
              <button
                type="button"
                onClick={insertPromptSnippet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F0FDF4] text-[#064E3B] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>+ Insert Romantic Prompt Line</span>
              </button>
              <span className="text-xs text-[#4B6356]">
                Tip: Press Enter twice between paragraphs to enable reader inline comments!
              </span>
            </div>

            <textarea
              rows={16}
              value={currChapter.bodyText}
              onChange={(e) => updateChapterField('bodyText', e.target.value)}
              placeholder="Start writing your serialized novel here..."
              className="w-full font-serif text-[17px] leading-[1.8] text-[#0C2417] bg-transparent focus:outline-none resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
