# X (Twitter) Clone

A modern Twitter/X clone built with Next.js 15, TypeScript, and shadcn/ui components.

## Features

- 🌙 Dark mode by default
- 📱 Responsive layout with sidebar navigation
- 🎨 Built with shadcn/ui components
- ⚡ Next.js 15 with App Router
- 🎭 Mocked data for tweets and trending topics
- 🖼️ Image support for tweets

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/components/ui` - shadcn/ui components
- `/lib` - Utilities and mock data
- `/public` - Static assets (images)

## Components

- **Sidebar** - Navigation with Home, Explore, Notifications, Messages, Profile
- **Tweet** - Individual tweet component with interactions
- **TweetComposer** - Create new tweets
- **Trending** - Trending topics sidebar

## Customization

The app uses dark mode by default. Mock data can be found in `/lib/mock-data.ts`.
