import type { UserProfile } from "../../types/user";
import type { FeedPost } from "../../types/post";

export const MOCK_CURRENT_USER: UserProfile = {
  id: "user-1",
  username: "tonyray",
  email: "tony@example.com",
  displayName: "Tony Ray",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony",
  coverImage:
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  bio: "Full-stack developer & Otaku. Building cool stuff!",
  location: "Ho Chi Minh City, Vietnam",
  website: "https://tonyray.dev",
  joinedAt: "2023-01-15T10:00:00Z",
  createdAt: "2023-01-15T10:00:00Z",
  updatedAt: "2023-12-20T15:30:00Z",
  followersCount: 1250,
  followingCount: 89,
  postsCount: 42,
  isFollowing: false,
};

export const MOCK_OTHER_USER: UserProfile = {
  id: "user-2",
  username: "narutofan99",
  email: "naruto@example.com",
  displayName: "Naruto Fan",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naruto",
  coverImage:
    "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  bio: "Dattebayo! Biggest Naruto fan locally.",
  location: "Konoha",
  joinedAt: "2023-03-20T08:00:00Z",
  createdAt: "2023-03-20T08:00:00Z",
  updatedAt: "2023-11-10T11:20:00Z",
  followersCount: 500,
  followingCount: 1200,
  postsCount: 156,
  isFollowing: true,
};

export const MOCK_USER_POSTS: FeedPost[] = [
  {
    id: "post-1",
    title: "Rewatching Naruto",
    content:
      "Just finished re-watching Naruto Shippuden for the 3rd time! Still cries at Jiraiya sensei death 😭 #naruto #anime",
    author: {
      id: "user-1",
      name: "Tony Ray",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony",
    },
    media: [
      {
        id: "media-1",
        mediaType: "IMAGE",
        mediaUrl:
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        order: 0,
      },
    ],
    topics: [{ id: "1", name: "Anime" }],
    likeCount: 120,
    commentCount: 45,
    createdAt: "2023-12-21T09:00:00Z",
  },
  {
    id: "post-2",
    title: "Manga Convention",
    content: "Anyone going to the manga convention this weekend?",
    author: {
      id: "user-1",
      name: "Tony Ray",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony",
    },
    media: [],
    topics: [{ id: "2", name: "Events" }],
    likeCount: 56,
    commentCount: 12,
    createdAt: "2023-12-20T14:30:00Z",
  },
  {
    id: "post-3",
    title: "Figure Collection",
    content: "My new figure collection setup! What do you guys think?",
    author: {
      id: "user-1",
      name: "Tony Ray",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony",
    },
    media: [
      {
        id: "media-2",
        mediaType: "IMAGE",
        mediaUrl:
          "https://images.unsplash.com/photo-1626085521921-65715494d13c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        order: 0,
      },
    ],
    topics: [{ id: "3", name: "Figures" }],
    likeCount: 342,
    commentCount: 89,
    createdAt: "2023-12-18T18:45:00Z",
  },
];
