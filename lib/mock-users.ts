import { mockUsers as users, getPostsByUsername } from "./mock-data";

export const mockUsers = users;

export type MockUser = (typeof mockUsers)[keyof typeof mockUsers] & {
  posts: ReturnType<typeof getPostsByUsername>;
  postsCount: number;
};

export function getUserData(username: string): MockUser | null {
  const user = mockUsers[username as keyof typeof mockUsers];
  if (!user) return null;

  const posts = getPostsByUsername(username);
  return {
    ...user,
    posts,
    postsCount: posts.length,
  };
}
