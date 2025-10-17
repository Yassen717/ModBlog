# Modern Blog (ModBlog)

A full-featured, modern blog platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS. This project demonstrates a complete blog solution with both public-facing pages and an admin dashboard for content management.

## Features

- **Public Blog**: Homepage with featured posts, category browsing, and search functionality
- **Admin Dashboard**: Complete content management system with posts, categories, comments, users, and analytics
- **Authentication**: Role-based access control (Admin/Editor roles)
- **Responsive Design**: Mobile-first design that works on all device sizes
- **Dark Mode**: Theme switching with system preference detection
- **Client-Side Storage**: Uses localStorage for data persistence (no database required)
- **SEO Optimized**: Proper metadata and semantic HTML structure

## Tech Stack

- **Framework**: [Next.js 15.5.3](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Radix UI primitives
- **Build Tool**: Turbopack for fast development and builds
- **Fonts**: Geist font family via `next/font`
- **State Management**: React Context API

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the public blog.

To access the admin dashboard, navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and log in with:

- **Admin**: admin@modernblog.com / admin123
- **Editor**: editor@modernblog.com / editor123

## Project Structure

```
app/                 # Next.js App Router structure
├── admin/          # Admin dashboard pages
├── api/            # API routes for authentication and CRUD operations
├── blog/           # Public blog pages
├── login/          # Authentication pages
├── layout.tsx      # Root layout with metadata
├── page.tsx        # Homepage
components/         # Reusable UI components
├── blog/           # Blog-specific components
├── layout/         # Site layout components
├── ui/             # Generic UI components
hooks/              # Custom React hooks
lib/                # Utility functions and data storage
types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint for code quality checks

## Data Management

This project uses localStorage for data persistence instead of a traditional database. All blog posts, categories, users, and comments are stored in the browser's localStorage, making it easy to run without any backend setup.

Key storage utilities:
- `getPosts()` / `savePost()` - Manage blog posts
- `getCategories()` / `saveCategory()` - Manage categories
- `getUsers()` / `saveUser()` - Manage users
- `getComments()` / `saveComment()` - Manage comments

## Admin Dashboard

The admin dashboard provides a complete content management system:

- **Posts**: Create, edit, and manage blog posts
- **Categories**: Organize content with categories
- **Comments**: Moderate user comments
- **Users**: Manage user accounts and roles
- **Analytics**: View blog statistics and metrics
- **Settings**: Configure site-wide settings

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.