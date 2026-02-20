// Users data
export const mockUsers = {
  mshancee: {
    id: "user_1",
    username: "mshancee",
    displayName: "Mshan Cee",
    bio: "Full-stack developer | Building cool stuff with React & Next.js 🚀 | Coffee enthusiast ☕",
    avatarUrl: "/avatar.jpg",
    coverUrl: "/cover.jpg",
    location: "San Francisco, CA",
    joinedDate: "March 2020",
    followingCount: 247,
    followersCount: 1892,
  },
  sarahdev: {
    id: "user_2",
    username: "sarahdev",
    displayName: "Sarah Chen",
    bio: "Senior Frontend Engineer @TechCorp | React & TypeScript enthusiast | Open source contributor | She/Her",
    avatarUrl: "/a1.jpg",
    coverUrl: "/cover.jpg",
    location: "New York, NY",
    joinedDate: "January 2019",
    followingCount: 342,
    followersCount: 5234,
  },
  alexcodes: {
    id: "user_3",
    username: "alexcodes",
    displayName: "Alex Rivera",
    bio: "Full-stack developer | TypeScript advocate | Building in public | Indie hacker | He/Him",
    avatarUrl: "/a2.jpg",
    coverUrl: "/cover.jpg",
    location: "Austin, TX",
    joinedDate: "June 2020",
    followingCount: 189,
    followersCount: 3421,
  },
  mayabuilds: {
    id: "user_4",
    username: "mayabuilds",
    displayName: "Maya Patel",
    bio: "UI/UX Designer & Frontend Dev | Design systems enthusiast | Figma to code | Creating beautiful interfaces ✨",
    avatarUrl: "/a3.jpg",
    coverUrl: "/cover.jpg",
    location: "London, UK",
    joinedDate: "September 2020",
    followingCount: 456,
    followersCount: 4567,
  },
  jordantech: {
    id: "user_5",
    username: "jordantech",
    displayName: "Jordan Lee",
    bio: "Backend Engineer | Node.js & PostgreSQL | API design | Performance optimization | They/Them",
    avatarUrl: "/a4.jpg",
    coverUrl: "/cover.jpg",
    location: "Seattle, WA",
    joinedDate: "April 2019",
    followingCount: 234,
    followersCount: 2890,
  },
  emmawrites: {
    id: "user_6",
    username: "emmawrites",
    displayName: "Emma Wilson",
    bio: "Technical Writer | Developer Advocate | Making complex tech simple | Coffee addict ☕ | She/Her",
    avatarUrl: "/a5.jpg",
    coverUrl: "/cover.jpg",
    location: "Toronto, Canada",
    joinedDate: "February 2021",
    followingCount: 567,
    followersCount: 6789,
  },
  chrismakes: {
    id: "user_7",
    username: "chrismakes",
    displayName: "Chris Martinez",
    bio: "Software Engineer | Testing advocate | CI/CD enthusiast | Building reliable systems | He/Him",
    avatarUrl: "/a6.jpg",
    coverUrl: "/cover.jpg",
    location: "Miami, FL",
    joinedDate: "August 2018",
    followingCount: 345,
    followersCount: 4321,
  },
};

// Posts data
export const mockPostsData = [
  {
    id: 1,
    userId: "user_2",
    content:
      "Just shipped a new feature using Next.js 15 and the performance improvements are incredible! 🚀\n\nThe new caching strategies make everything so much faster.",
    imageUrl: "/1.jpg",
    createdAt: "2h",
    likesCount: 892,
    impressionsCount: 12500,
  },
  {
    id: 2,
    userId: "user_3",
    content:
      "Hot take: TypeScript has made me a better JavaScript developer.\n\nThe type safety catches so many bugs before they reach production.",
    imageUrl: null,
    createdAt: "4h",
    likesCount: 1247,
    impressionsCount: 23400,
  },
  {
    id: 3,
    userId: "user_4",
    content:
      "Working on a new design system with shadcn/ui. The component library is so well thought out!",
    imageUrl: "/2.jpg",
    createdAt: "6h",
    likesCount: 654,
    impressionsCount: 8900,
  },
  {
    id: 4,
    userId: "user_5",
    content:
      "Finally understanding React Server Components. The mental model shift is real but it's worth it.\n\nThe performance benefits are game-changing for data-heavy apps.",
    imageUrl: null,
    createdAt: "8h",
    likesCount: 1456,
    impressionsCount: 18700,
  },
  {
    id: 5,
    userId: "user_6",
    content:
      "Spent the weekend building a side project. There's something magical about coding on a Saturday morning with coffee ☕",
    imageUrl: "/3.jpg",
    createdAt: "10h",
    likesCount: 567,
    impressionsCount: 6800,
  },
  {
    id: 6,
    userId: "user_7",
    content:
      "Pro tip: Always write tests for your critical paths. Future you will thank present you.\n\n#webdev #testing",
    imageUrl: null,
    createdAt: "12h",
    likesCount: 2134,
    impressionsCount: 34200,
  },
  {
    id: 7,
    userId: "user_4",
    content:
      "Design tip: Consistency is more important than perfection. A consistent mediocre design beats an inconsistent great design every time.\n\n#DesignSystems #UIDesign",
    imageUrl: null,
    createdAt: "14h",
    likesCount: 789,
    impressionsCount: 11200,
  },
  {
    id: 8,
    userId: "user_3",
    content:
      "Working on my side project this weekend. There's something special about building something just for yourself, no deadlines, no pressure. Pure creativity. 🎨",
    imageUrl: "/3.jpg",
    createdAt: "16h",
    likesCount: 456,
    impressionsCount: 6700,
  },
  {
    id: 9,
    userId: "user_5",
    content:
      "Optimized our API response time from 800ms to 120ms by adding proper database indexes and implementing Redis caching. Sometimes the simple solutions are the best ones. 🚀",
    imageUrl: null,
    createdAt: "18h",
    likesCount: 1234,
    impressionsCount: 15600,
  },
  {
    id: 10,
    userId: "user_6",
    content:
      "Writing good documentation is a superpower. It's not just about explaining what the code does, it's about helping others understand WHY it does it.\n\n#TechnicalWriting #DevRel",
    imageUrl: null,
    createdAt: "20h",
    likesCount: 890,
    impressionsCount: 12300,
  },
];

// Comments data - separate table (flat structure, no nested replies)
export const mockCommentsData = [
  // Comments on post 1
  {
    id: 1,
    postId: 1,
    userId: "user_3",
    parentCommentId: null, // null means it's a top-level comment
    content:
      "This is amazing! Can you share more details about the caching strategies you used?",
    createdAt: "1h",
    likesCount: 12,
    impressionsCount: 450,
  },
  {
    id: 2,
    postId: 1,
    userId: "user_4",
    parentCommentId: null,
    content: "Congrats on the launch! 🎉 Next.js 15 is a game changer.",
    createdAt: "45m",
    likesCount: 8,
    impressionsCount: 320,
  },
  {
    id: 3,
    postId: 1,
    userId: "user_5",
    parentCommentId: null,
    content:
      "I've been testing Next.js 15 too and the performance gains are real. Great work!",
    createdAt: "30m",
    likesCount: 5,
    impressionsCount: 280,
  },
  // Reply to comment 1
  {
    id: 16,
    postId: 1,
    userId: "user_2",
    parentCommentId: 1,
    content:
      "Sure! I used the new fetch cache options and implemented ISR for dynamic routes. Happy to share more details!",
    createdAt: "50m",
    likesCount: 4,
    impressionsCount: 180,
  },
  {
    id: 17,
    postId: 1,
    userId: "user_3",
    parentCommentId: 1,
    content: "That would be awesome, thanks!",
    createdAt: "40m",
    likesCount: 2,
    impressionsCount: 120,
  },
  // Comments on post 2
  {
    id: 4,
    postId: 2,
    userId: "user_2",
    parentCommentId: null,
    content:
      "Absolutely agree! TypeScript has saved me countless hours of debugging.",
    createdAt: "3h",
    likesCount: 23,
    impressionsCount: 890,
  },
  {
    id: 5,
    postId: 2,
    userId: "user_6",
    parentCommentId: null,
    content:
      "The learning curve was steep but totally worth it. Never going back to plain JS for large projects.",
    createdAt: "2h",
    likesCount: 15,
    impressionsCount: 670,
  },
  // Reply to comment 4
  {
    id: 18,
    postId: 2,
    userId: "user_3",
    parentCommentId: 4,
    content: "Same here! The autocomplete alone is worth the switch.",
    createdAt: "2h",
    likesCount: 7,
    impressionsCount: 340,
  },
  // Comments on post 3
  {
    id: 6,
    postId: 3,
    userId: "user_3",
    parentCommentId: null,
    content: "shadcn/ui is incredible! Love how customizable it is.",
    createdAt: "5h",
    likesCount: 18,
    impressionsCount: 540,
  },
  {
    id: 7,
    postId: 3,
    userId: "user_7",
    parentCommentId: null,
    content:
      "Been using it for a month now. The developer experience is top-notch!",
    createdAt: "4h",
    likesCount: 9,
    impressionsCount: 420,
  },
  {
    id: 8,
    postId: 3,
    userId: "user_1",
    parentCommentId: null,
    content: "This looks great! Definitely trying this on my next project.",
    createdAt: "3h",
    likesCount: 6,
    impressionsCount: 310,
  },
  // Comments on post 4
  {
    id: 9,
    postId: 4,
    userId: "user_2",
    parentCommentId: null,
    content:
      "RSC took me a while to understand but now I can't imagine building without them.",
    createdAt: "7h",
    likesCount: 34,
    impressionsCount: 1200,
  },
  {
    id: 10,
    postId: 4,
    userId: "user_6",
    parentCommentId: null,
    content: "Great explanation! This helped clarify some concepts for me.",
    createdAt: "6h",
    likesCount: 12,
    impressionsCount: 560,
  },
  // Comments on post 5
  {
    id: 11,
    postId: 5,
    userId: "user_7",
    parentCommentId: null,
    content: "Weekend coding sessions are the best! What are you building?",
    createdAt: "9h",
    likesCount: 7,
    impressionsCount: 380,
  },
  {
    id: 12,
    postId: 5,
    userId: "user_4",
    parentCommentId: null,
    content: "Same here! Nothing beats the flow state on a quiet morning.",
    createdAt: "8h",
    likesCount: 11,
    impressionsCount: 450,
  },
  // Comments on post 6
  {
    id: 13,
    postId: 6,
    userId: "user_5",
    parentCommentId: null,
    content: "This! Testing is not optional, it's essential.",
    createdAt: "11h",
    likesCount: 45,
    impressionsCount: 1800,
  },
  {
    id: 14,
    postId: 6,
    userId: "user_2",
    parentCommentId: null,
    content:
      "Learned this the hard way. Now I write tests first whenever possible.",
    createdAt: "10h",
    likesCount: 28,
    impressionsCount: 920,
  },
  {
    id: 15,
    postId: 6,
    userId: "user_3",
    parentCommentId: null,
    content: "What testing framework do you recommend for React apps?",
    createdAt: "9h",
    likesCount: 8,
    impressionsCount: 450,
  },
  // Reply to comment 15
  {
    id: 19,
    postId: 6,
    userId: "user_7",
    parentCommentId: 15,
    content: "I use Vitest for unit tests and Playwright for e2e. Great combo!",
    createdAt: "8h",
    likesCount: 12,
    impressionsCount: 520,
  },
  {
    id: 20,
    postId: 6,
    userId: "user_3",
    parentCommentId: 15,
    content: "Thanks! I'll check those out.",
    createdAt: "7h",
    likesCount: 3,
    impressionsCount: 210,
  },
];

// Helper function to get user by userId
export function getUserById(userId: string) {
  return Object.values(mockUsers).find((user) => user.id === userId);
}

// Helper function to get comments for a post (simple flat list)
export function getCommentsByPostId(postId: number) {
  return mockCommentsData
    .filter((comment) => comment.postId === postId)
    .map((comment) => {
      const user = getUserById(comment.userId);
      return {
        ...comment,
        author: user?.displayName || "Unknown",
        username: user?.username || "unknown",
        avatarUrl: user?.avatarUrl || "/avatar.jpg",
      };
    });
}

// Helper function to get posts with computed counts (including all nested replies)
export function getPostsWithCounts() {
  return mockPostsData.map((post) => {
    const user = getUserById(post.userId);
    // Count all comments including replies
    const commentsCount = mockCommentsData.filter(
      (c) => c.postId === post.id,
    ).length;

    return {
      ...post,
      author: user?.displayName || "Unknown",
      username: user?.username || "unknown",
      avatarUrl: user?.avatarUrl || "/avatar.jpg",
      commentsCount,
    };
  });
}

// Helper function to get posts by username
export function getPostsByUsername(username: string) {
  const user = Object.values(mockUsers).find((u) => u.username === username);
  if (!user) return [];

  return mockPostsData
    .filter((post) => post.userId === user.id)
    .map((post) => {
      // Count all comments including replies
      const commentsCount = mockCommentsData.filter(
        (c) => c.postId === post.id,
      ).length;

      return {
        ...post,
        author: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        commentsCount,
      };
    });
}

// Export for homepage feed
export const mockPosts = getPostsWithCounts();
