import { Book, ContactRequest, ForumCategory, ForumThread, Report, User } from '../types/truewriters';

export const CURRENT_USER: User = {
  id: 'usr-rowan-101',
  fullName: 'Rowan Eleanor Vance',
  nickname: 'Rowan Vance',
  displayNamePreference: 'nickname',
  penName: 'Rowan Vance',
  email: 'rowan.vance@gmail.com',
  showEmailPublicly: true,
  emailVerified: true,
  role: 'writer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  bio: 'Writing speculative eco-fiction and slow-burn stories. Nature archivist by day, novelist by dusk.',
  joinedDate: 'January 2026',
  followersCount: 1420,
  followingCount: 38,
  ageVerified13Plus: true,
};

export const ADMIN_USERS = {
  jeydah: {
    id: 'usr-admin-jeydah',
    penName: 'Jeydah',
    email: 'jeydahsan@gmail.com',
    emailVerified: true,
    role: 'admin' as const,
    bio: 'Platform administrator and founder.',
    joinedDate: 'December 2025',
    followersCount: 1480,
    followingCount: 15,
    ageVerified13Plus: true,
  },
  chyrine: {
    id: 'usr-admin-chyrine',
    penName: 'Chyrine',
    email: 'chyrine.admin@jeydahsan.com',
    emailVerified: true,
    role: 'admin' as const,
    bio: 'Platform administrator & safety lead.',
    joinedDate: 'December 2025',
    followersCount: 920,
    followingCount: 18,
    ageVerified13Plus: true,
  },
};

export const ADMIN_USER: User = ADMIN_USERS.jeydah;

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-verdigris-sanctum',
    authorId: 'usr-rowan-101',
    authorName: 'Rowan Vance',
    authorEmail: 'rowan.vance@gmail.com',
    showAuthorEmail: true,
    seriesId: 'series-verdigris',
    seriesTitle: 'The Verdigris Annals',
    seriesOrder: 1,
    title: 'The Verdigris Sanctum',
    description:
      'In a quiet alpine valley, an abandoned botanical greenhouse holds the memories of the people who cultivated its rarest nocturnal orchids. When apprentice archivist Linnea uncovers her late grandmother’s ledger, she discovers the garden is waking up.',
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    tags: ['Botanical', 'Slow Burn', 'Mystery', 'Found Family'],
    rating: 'All Ages',
    status: 'Ongoing',
    isPublic: true,
    pageCount: 214, // 214 of 500 pages
    wordCount: 64200,
    createdAt: '2026-02-14',
    publishedAt: '2026-02-14',
    reads: 48920,
    thumbsUp: 3410,
    thumbsDown: 14,
    chapters: [
      {
        id: 'ch-vs-1',
        bookId: 'book-verdigris-sanctum',
        order: 1,
        title: 'Chapter 1: The Glass Ribs in the Fog',
        contentMd: `The brass key to Ward Seven smelled unmistakably of crushed cardamom and wet ironstone.

Linnea turned it twice in the corroded lock while mountain rain drummed an impatient rhythm against the arched iron ribs overhead. Inside the conservatory, the air was twenty degrees warmer than the Scottish autumn outside.

Giant silver-veined ferns unfurled across the checkered limestone walkway, their fronds trembling despite the absence of any draft.

> "A plant never forgets the hand that watered it in drought," her grandmother had written on the flyleaf of the ledger. "Nor does it forgive the one that severed its taproot."

Julian stepped from behind the curtain of hanging Spanish moss, his linen sleeves rolled to the elbows and stained with chlorophyll. In his palm rested a single bell jar containing an emerald orchid that pulsed with a slow, faint light.

"You're seventeen minutes late, Miss Vance," he murmured. "And the third bloom has already opened."`,
        wordCount: 1420,
        pageCount: 5,
        updatedAt: '2026-09-20',
        publishedAt: '2026-02-14',
      },
      {
        id: 'ch-vs-2',
        bookId: 'book-verdigris-sanctum',
        order: 2,
        title: 'Chapter 2: The Cardamom Ledger',
        contentMd: `By midnight, the fog had completely swallowed the valley floor. Only the pale green phosphorescence of the nocturnal specimens lit the glass catwalks.

Julian laid out the antique brass calipers on the potting bench. "Every flower in this ward was cultivated from seeds recovered from unsent correspondence. When someone writes a confession and burns it, the smoke settles into the soil."

Linnea touched the dried ink of her grandfather's last entry. The botanical Latin was shaky, written under failing lantern light.

"He wasn't cataloging plants," she whispered, looking up at the high vaulted dome. "He was archiving secrets."`,
        wordCount: 1580,
        pageCount: 6,
        updatedAt: '2026-09-22',
        publishedAt: '2026-02-21',
      },
    ],
  },
  {
    id: 'book-hollow-spire',
    authorId: 'usr-author-2',
    authorName: 'Caleb Sterling',
    title: 'Echoes of the Hollow Spire',
    description:
      'Towering four miles above the cloud deck, the Hollow Spire was supposed to be humanity’s silent atmospheric observatory. Radio officer Maya just intercepted a transmission originating from inside its sealed foundation.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    tags: ['Sci-Fi', 'Isolation', 'Solarpunk', 'Atmospheric'],
    rating: 'Teen',
    status: 'Completed',
    isPublic: true,
    pageCount: 380,
    wordCount: 114000,
    createdAt: '2026-01-10',
    publishedAt: '2026-01-10',
    reads: 92450,
    thumbsUp: 7890,
    thumbsDown: 35,
    chapters: [
      {
        id: 'ch-hs-1',
        bookId: 'book-hollow-spire',
        order: 1,
        title: 'Chapter 1: The 400-Hertz Harmonic',
        contentMd: `The anemometer on the western strut spun so fast it sang a continuous Bb.

Maya pressed her headphones tighter against her ears, watching the oscilloscope trace a shape that should not have existed: a recursive Fibonacci spiral drawn in radio static.

"Station Four to Relay Hub," she spoke into the copper microphone. "I have a ping on frequency eleven. Confirm if maintenance is running a diagnostic in the keel."

The speaker popped twice.

*There is no maintenance team in the keel, Maya. The keel was flooded with liquid nitrogen thirty years ago.*`,
        wordCount: 1650,
        pageCount: 6,
        updatedAt: '2026-08-15',
        publishedAt: '2026-01-10',
      },
    ],
  },
  {
    id: 'book-cedar-and-clay',
    authorId: 'usr-rowan-101',
    authorName: 'Rowan Vance',
    title: 'Cedar and Clay',
    description:
      'A grieving tea house restorer in Kyoto receives a delivery of six celadon bowls signed with the crescent moon kiln mark of a potter who vanished seven winters ago.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    tags: ['Romance', 'Quiet', 'Kyoto', 'Artisan'],
    rating: 'All Ages',
    status: 'Completed',
    isPublic: true,
    pageCount: 185,
    wordCount: 55500,
    createdAt: '2026-03-01',
    publishedAt: '2026-03-01',
    reads: 31200,
    thumbsUp: 2450,
    thumbsDown: 8,
    chapters: [
      {
        id: 'ch-cc-1',
        bookId: 'book-cedar-and-clay',
        order: 1,
        title: 'Chapter 1: The Rain in Arashiyama',
        contentMd: `Old hinoki wood never truly forgets the forest. When you plane away a single millimeter of weathered gray grain, the room smells instantly of high mountain shrines after thunder.

Aoi set her hand plane on the woven straw mat and slid open the cedar screen. The bamboo stalks of Arashiyama were knocking together in the wind, a dry, wooden rhythm that steadied her pulse.

On the veranda stood a wooden crate wrapped in indigo cotton cloth. Inside were six celadon tea bowls—each marked at the foot with an unglazed crescent moon.`,
        wordCount: 1390,
        pageCount: 5,
        updatedAt: '2026-07-20',
        publishedAt: '2026-03-01',
      },
    ],
  },
  {
    id: 'book-saltwood-maze',
    authorId: 'usr-author-3',
    authorName: 'Eleanor Finch',
    title: 'The Saltwood Labyrinth',
    description:
      'Hired to survey a cliffside yew hedge maze before auction, surveyor Gideon Locke realizes the living hedges are trimmed each midnight to match the exact floorplan of an estate that burned down in 1889.',
    coverUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80',
    tags: ['Gothic', 'Mystery', 'Cartography', 'Historical'],
    rating: 'Mature',
    status: 'Ongoing',
    isPublic: true,
    pageCount: 498, // Demo book showing near the 500-page limit!
    wordCount: 149400,
    createdAt: '2025-11-01',
    publishedAt: '2025-11-01',
    reads: 114500,
    thumbsUp: 10200,
    thumbsDown: 42,
    chapters: [
      {
        id: 'ch-sm-1',
        bookId: 'book-saltwood-maze',
        order: 1,
        title: 'Chapter 1: Bearings at Saltwood Bluff',
        contentMd: `No magnetic needle holds true within three hundred yards of the Saltwood cliff edge.

The fishermen in the cove blame the ironstone strata below the foam. Yet Gideon observed that his transit needle settled perfectly until he carried the tripod past the wrought-iron gate of the yew maze.

The hedges towered fourteen feet high, dense and dark as midnight spruce. Not even the North Sea gale could whistle through their braided boughs.

"My grandfather kept six gardeners on wage," Lady Catherine murmured from the terrace, her emerald shawl held close. "Today we employ none. Yet you will not discover a single stray leaf on the gravel."`,
        wordCount: 1800,
        pageCount: 6,
        updatedAt: '2026-09-25',
        publishedAt: '2025-11-01',
      },
    ],
  },
];

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'cat-general',
    name: 'General Discussion',
    description: 'Talk about books, favorite genres, reading routines, and the platform.',
    iconName: 'MessageSquare',
    threadCount: 142,
  },
  {
    id: 'cat-writing-help',
    name: 'Writing Help & Prompts',
    description: 'Worldbuilding advice, dialogue pacing, overcoming blocks, and weekly prompts.',
    iconName: 'PenTool',
    threadCount: 289,
  },
  {
    id: 'cat-book-clubs',
    name: 'Book Clubs & Read-Alongs',
    description: 'Community-led reading groups exploring serials chapter by chapter.',
    iconName: 'BookOpen',
    threadCount: 64,
  },
  {
    id: 'cat-critique',
    name: 'Feedback & Critique',
    description: 'Share opening hooks or chapter drafts for gentle, constructive reader critique.',
    iconName: 'Sparkles',
    threadCount: 175,
  },
  {
    id: 'cat-promotions',
    name: 'New Releases & Milestones',
    description: 'Announce newly published books, completed serials, or milestone chapters.',
    iconName: 'Award',
    threadCount: 310,
  },
  {
    id: 'cat-off-topic',
    name: 'The Tea Room (Off-Topic)',
    description: 'Casual chatter, playlists, cozy workspaces, and tea recommendations.',
    iconName: 'Coffee',
    threadCount: 98,
  },
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    categoryId: 'cat-writing-help',
    title: 'How do you structure cliffhangers without feeling cheap?',
    authorId: 'usr-author-2',
    authorPenName: 'Caleb Sterling',
    createdAt: '2026-09-24',
    isPinned: true,
    upvotes: 42,
    posts: [
      {
        id: 'post-1-1',
        threadId: 'thread-1',
        authorId: 'usr-author-2',
        authorPenName: 'Caleb Sterling',
        contentMd: `When writing serialized stories, keeping momentum between chapters is essential. But there is a fine line between a genuine emotional revelation and a synthetic shock that gets undone in the next sentence.

How do you craft chapter endings that leave readers needing the next page while keeping the emotional stakes grounded?`,
        createdAt: '2026-09-24 14:20',
        upvotes: 28,
      },
      {
        id: 'post-1-2',
        threadId: 'thread-1',
        authorId: 'usr-rowan-101',
        authorPenName: 'Rowan Vance',
        contentMd: `I like to end chapters on a character making an irreversible decision rather than an external explosion.

For instance: not a gun going off, but someone voluntarily handing over the key they promised never to touch. The curiosity shifts from "Did they survive?" to "How will their soul survive what they just chose?"`,
        createdAt: '2026-09-24 16:45',
        upvotes: 39,
      },
    ],
  },
  {
    id: 'thread-2',
    categoryId: 'cat-general',
    title: 'Appreciation post for Jeydahsan being 100% free and ad-free',
    authorId: 'usr-reader-9',
    authorPenName: 'Maya Lin',
    createdAt: '2026-09-25',
    isPinned: false,
    upvotes: 88,
    posts: [
      {
        id: 'post-2-1',
        threadId: 'thread-2',
        authorId: 'usr-reader-9',
        authorPenName: 'Maya Lin',
        contentMd: `Just wanted to say thank you to the team and community. No coin unlocks, no 30-second video ads between chapters, no premium tiers. Just pure reading and writing the way the web used to be. It feels so peaceful here!`,
        createdAt: '2026-09-25 09:12',
        upvotes: 64,
      },
    ],
  },
];

export const INITIAL_CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: 'req-001',
    bookId: 'book-verdigris-sanctum',
    bookTitle: 'The Verdigris Sanctum',
    buyerId: 'usr-buyer-8',
    authorId: 'usr-rowan-101',
    buyerName: 'Aria Sterling',
    buyerEmail: 'asterling@hearthstoneliterary.com',
    organization: 'Hearthstone Literary Agency & Media',
    rightsInterestedIn: ['Print Publishing Rights', 'Audiobook Option', 'Translation Rights'],
    message:
      'Dear Rowan, I have been following The Verdigris Sanctum since Chapter 1. The atmospheric prose and botanical worldbuilding are exceptional. Our agency represents speculative fiction for major publishing imprints in North America and the UK. We would love to discuss potential representation or print rights if you are open to an introduction.',
    status: 'pending',
    authorConsent: false,
    createdAt: '2026-09-26 11:30',
  },
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-001',
    reporterId: 'usr-anon-5',
    targetType: 'book',
    targetId: 'book-sample-flagged',
    targetTitle: 'Whispers of Midnight',
    category: 'Plagiarism — this same story exists on another website',
    description: 'The prologue and Chapter 1 appear to be identical to a published novella from 2021.',
    sourceUrl: 'https://example-archive.org/works/2021-midnight-whispers',
    status: 'pending',
    createdAt: '2026-09-26 08:15',
  },
  {
    id: 'rep-002',
    reporterId: 'usr-anon-7',
    targetType: 'comment',
    targetId: 'com-8812',
    targetTitle: 'Comment on Chapter 3',
    category: 'Spam or advertising',
    description: 'User repeatedly posting external telegram links in the chapter comments.',
    status: 'reviewing',
    assignedTo: 'Jeydah',
    createdAt: '2026-09-25 19:40',
  },
];
