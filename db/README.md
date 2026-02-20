# Database Setup Guide - Neon PostgreSQL + Drizzle ORM

This guide will help you set up the database for the X (Twitter) clone when you're ready to go live.

## Prerequisites

- Node.js installed
- A Neon account (https://neon.tech)

## Installation

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

Get your connection string from Neon dashboard.

## Database Schema

Create `drizzle/schema.ts`:

```typescript
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  commentsCount: integer("comments_count").default(0),
  likesCount: integer("likes_count").default(0),
  impressionsCount: integer("impressions_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  followerId: uuid("follower_id")
    .references(() => users.id)
    .notNull(),
  followingId: uuid("following_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Drizzle Configuration

Create `drizzle.config.ts` in the root:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## Database Client

Create `lib/db.ts`:

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## Migration Commands

Add to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Running Migrations

1. Generate migration files:

```bash
npm run db:generate
```

2. Apply migrations to database:

```bash
npm run db:migrate
```

Or push schema directly (for development):

```bash
npm run db:push
```

## Drizzle Studio

View and edit your database with a GUI:

```bash
npm run db:studio
```

## Usage Example

```typescript
import { db } from "@/lib/db";
import { posts, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// Get all posts with user info
const allPosts = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id))
  .orderBy(posts.createdAt);

// Create a new post
await db.insert(posts).values({
  userId: "user-uuid",
  content: "Hello World!",
  imageUrl: "/image.jpg",
});

// Update likes count
await db
  .update(posts)
  .set({ likesCount: posts.likesCount + 1 })
  .where(eq(posts.id, "post-uuid"));
```

## Next Steps

1. Set up authentication (NextAuth.js recommended)
2. Create API routes for CRUD operations
3. Add real-time features with WebSockets
4. Implement image upload (Cloudinary/S3)
5. Add search functionality
6. Set up caching (Redis)

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Neon Docs](https://neon.tech/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
