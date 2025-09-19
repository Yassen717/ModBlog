import { Post, Author, Category } from '@/types/blog'
import { generateSlug, calculateReadingTime } from './utils'

// Sample author
export const sampleAuthor: Author = {
  id: '1',
  name: 'John Doe',
  bio: 'Full-stack developer passionate about modern web technologies, clean code, and creating amazing user experiences.',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
  social: {
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.dev',
  },
}

// Sample categories
export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Articles about modern web development techniques and best practices',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Deep dives into JavaScript, TypeScript, and related technologies',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'React',
    slug: 'react',
    description: 'React tutorials, tips, and advanced patterns',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Next.js features, optimization, and deployment strategies',
    color: '#8B5CF6',
  },
  {
    id: '5',
    name: 'CSS',
    slug: 'css',
    description: 'Modern CSS techniques, animations, and design systems',
    color: '#EF4444',
  },
]

// Sample blog posts
const samplePostsData = [
  {
    title: 'Getting Started with Next.js 14 and the App Router',
    excerpt: 'Learn how to build modern web applications with Next.js 14, exploring the new App Router, server components, and improved performance features.',
    content: `# Getting Started with Next.js 14 and the App Router

Next.js 14 introduces significant improvements to the App Router, making it easier than ever to build performant, scalable web applications. In this comprehensive guide, we'll explore the key features and best practices.

## What's New in Next.js 14

The latest version of Next.js brings several exciting features:

- **Improved App Router**: Better performance and developer experience
- **Server Actions**: Simplified server-side logic
- **Enhanced Image Optimization**: Faster loading and better user experience
- **Turbopack**: Faster development builds

## Setting Up Your First App Router Project

Let's start by creating a new Next.js project with the App Router:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app
npm run dev
\`\`\`

## Understanding the App Directory Structure

The App Router uses a file-system based routing approach:

- \`app/page.tsx\` - Home page
- \`app/about/page.tsx\` - About page
- \`app/blog/[slug]/page.tsx\` - Dynamic blog post pages

## Server Components vs Client Components

One of the most powerful features of the App Router is the distinction between Server and Client Components:

### Server Components (Default)
- Render on the server
- Can access databases and APIs directly
- Smaller bundle sizes
- Better SEO

### Client Components
- Render in the browser
- Can use hooks and event handlers
- Interactive features
- Use "use client" directive

## Best Practices

1. **Use Server Components by default** - Only use Client Components when you need interactivity
2. **Leverage streaming** - Use loading.tsx files for better UX
3. **Optimize images** - Always use the Next.js Image component
4. **Implement proper error handling** - Use error.tsx files

## Conclusion

Next.js 14 with the App Router provides a powerful foundation for building modern web applications. The combination of Server Components, improved routing, and enhanced performance makes it an excellent choice for your next project.`,
    categoryId: '4',
    tags: ['Next.js', 'React', 'Web Development', 'App Router'],
  },
  {
    title: 'Mastering TypeScript: Advanced Types and Patterns',
    excerpt: 'Dive deep into TypeScript\'s advanced type system, exploring utility types, conditional types, and powerful patterns for better code quality.',
    content: `# Mastering TypeScript: Advanced Types and Patterns

TypeScript's type system is incredibly powerful, offering features that go far beyond basic type annotations. In this article, we'll explore advanced types and patterns that will elevate your TypeScript skills.

## Utility Types

TypeScript provides several built-in utility types that help you transform existing types:

### Partial<T>
Makes all properties of T optional:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }
\`\`\`

### Pick<T, K>
Creates a type by picking specific properties from T:

\`\`\`typescript
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
\`\`\`

### Omit<T, K>
Creates a type by omitting specific properties from T:

\`\`\`typescript
type CreateUser = Omit<User, 'id'>;
// { name: string; email: string; }
\`\`\`

## Conditional Types

Conditional types allow you to create types that depend on a condition:

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type UserResponse = ApiResponse<User>; // { data: User }
\`\`\`

## Mapped Types

Create new types by transforming properties of existing types:

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }
\`\`\`

## Template Literal Types

Combine string literals in powerful ways:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>; // 'onClick'
type HoverEvent = EventName<'hover'>; // 'onHover'
\`\`\`

## Advanced Patterns

### Branded Types
Create distinct types from primitives:

\`\`\`typescript
type UserId = string & { __brand: 'UserId' };
type Email = string & { __brand: 'Email' };

function createUserId(id: string): UserId {
  return id as UserId;
}
\`\`\`

### Builder Pattern
Type-safe builder pattern implementation:

\`\`\`typescript
class QueryBuilder<T = {}> {
  private query: T = {} as T;

  select<K extends string>(fields: K[]): QueryBuilder<T & Record<K, any>> {
    return this as any;
  }

  where<K extends keyof T>(field: K, value: T[K]): QueryBuilder<T> {
    return this;
  }

  build(): T {
    return this.query;
  }
}
\`\`\`

## Conclusion

These advanced TypeScript features enable you to write more expressive, type-safe code. By leveraging utility types, conditional types, and advanced patterns, you can create robust applications with excellent developer experience.`,
    categoryId: '2',
    tags: ['TypeScript', 'Advanced Types', 'Programming', 'Type Safety'],
  },
  {
    title: 'Building Responsive Layouts with CSS Grid and Flexbox',
    excerpt: 'Learn how to create modern, responsive layouts using CSS Grid and Flexbox. Discover when to use each technique and how to combine them effectively.',
    content: `# Building Responsive Layouts with CSS Grid and Flexbox

Modern CSS provides powerful layout tools that make creating responsive designs easier than ever. In this guide, we'll explore CSS Grid and Flexbox, learning when and how to use each technique.

## CSS Grid: The Two-Dimensional Layout System

CSS Grid excels at creating complex, two-dimensional layouts:

### Basic Grid Setup

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
\`\`\`

### Named Grid Lines

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 
    [sidebar-start] 250px 
    [sidebar-end main-start] 1fr 
    [main-end];
  grid-template-rows: 
    [header-start] 60px 
    [header-end content-start] 1fr 
    [content-end];
}
\`\`\`

## Flexbox: The One-Dimensional Layout System

Flexbox is perfect for distributing space along a single axis:

### Flexible Navigation

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
\`\`\`

### Centering Content

\`\`\`css
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}
\`\`\`

## Combining Grid and Flexbox

The real power comes from using both techniques together:

### Card Layout Example

\`\`\`css
/* Grid for overall layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Flexbox for card content */
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
  padding: 1.5rem;
}

.card-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
\`\`\`

## Responsive Design Patterns

### Holy Grail Layout

\`\`\`css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .holy-grail {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Responsive Card Grid

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  padding: clamp(1rem, 4vw, 2rem);
}
\`\`\`

## Best Practices

1. **Use Grid for 2D layouts** - When you need to control both rows and columns
2. **Use Flexbox for 1D layouts** - When you need to distribute space along one axis
3. **Combine both techniques** - Use Grid for page layout, Flexbox for components
4. **Think mobile-first** - Start with mobile layouts and enhance for larger screens
5. **Use logical properties** - \`margin-inline\`, \`padding-block\` for better internationalization

## Modern CSS Features

### Container Queries

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

### Subgrid

\`\`\`css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child-grid {
  display: grid;
  grid-column: span 3;
  grid-template-columns: subgrid;
}
\`\`\`

## Conclusion

CSS Grid and Flexbox are complementary technologies that, when used together, provide incredible flexibility for creating responsive layouts. Understanding when to use each technique will help you build better, more maintainable CSS.`,
    categoryId: '5',
    tags: ['CSS', 'Grid', 'Flexbox', 'Responsive Design', 'Layout'],
  },
  {
    title: 'React Server Components: The Future of React',
    excerpt: 'Explore React Server Components and how they\'re changing the way we build React applications, offering better performance and developer experience.',
    content: `# React Server Components: The Future of React

React Server Components represent a paradigm shift in how we build React applications. They enable us to render components on the server while maintaining the interactivity we love about React.

## What are Server Components?

Server Components are React components that render on the server and send their output to the client. Unlike traditional SSR, Server Components can:

- Access backend resources directly
- Reduce bundle size
- Improve initial page load performance
- Maintain zero JavaScript footprint

## Server vs Client Components

### Server Components
- Render on the server
- Can access databases, file systems, and APIs directly
- Cannot use browser-only APIs
- Cannot use state or effects
- Reduce client-side JavaScript

### Client Components
- Render in the browser
- Can use hooks, state, and effects
- Can access browser APIs
- Handle user interactions
- Marked with "use client" directive

## Basic Example

\`\`\`tsx
// Server Component (default)
async function BlogPost({ slug }: { slug: string }) {
  // This runs on the server
  const post = await fetchPost(slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={post.id} />
    </article>
  );
}

// Client Component
'use client';
import { useState } from 'react';

function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} Like
    </button>
  );
}
\`\`\`

## Data Fetching Patterns

### Direct Database Access

\`\`\`tsx
import { db } from '@/lib/database';

async function UserProfile({ userId }: { userId: string }) {
  // Direct database access in Server Component
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { posts: true }
  });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Posts: {user.posts.length}</p>
    </div>
  );
}
\`\`\`

### Parallel Data Fetching

\`\`\`tsx
async function Dashboard() {
  // These fetch in parallel
  const [user, posts, analytics] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchAnalytics()
  ]);

  return (
    <div>
      <UserInfo user={user} />
      <PostList posts={posts} />
      <Analytics data={analytics} />
    </div>
  );
}
\`\`\`

## Streaming and Suspense

Server Components work seamlessly with Suspense for streaming:

\`\`\`tsx
import { Suspense } from 'react';

function BlogPage() {
  return (
    <div>
      <h1>My Blog</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

async function Posts() {
  const posts = await fetchPosts();
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

## Best Practices

### 1. Keep Server Components Pure
Server Components should be pure functions without side effects:

\`\`\`tsx
// ✅ Good
async function ProductList({ category }: { category: string }) {
  const products = await fetchProducts(category);
  return <div>{/* render products */}</div>;
}

// ❌ Avoid
async function ProductList({ category }: { category: string }) {
  const products = await fetchProducts(category);
  // Don't modify global state
  globalCache.set(category, products);
  return <div>{/* render products */}</div>;
}
\`\`\`

### 2. Use Client Components for Interactivity
Move interactive parts to Client Components:

\`\`\`tsx
// Server Component
async function ProductPage({ id }: { id: string }) {
  const product = await fetchProduct(id);
  
  return (
    <div>
      <ProductInfo product={product} />
      <AddToCartButton productId={id} />
    </div>
  );
}

// Client Component
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  };
  
  return (
    <button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
\`\`\`

### 3. Optimize Data Fetching
Fetch data as close to where it's needed:

\`\`\`tsx
// ✅ Good - fetch data in the component that needs it
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  return (
    <div>
      <UserInfo user={user} />
      <UserPosts userId={userId} />
    </div>
  );
}

async function UserPosts({ userId }: { userId: string }) {
  const posts = await fetchUserPosts(userId);
  return <PostList posts={posts} />;
}
\`\`\`

## Common Patterns

### Layout with Server Components

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// Server Component
async function Header() {
  const user = await getCurrentUser();
  return (
    <header>
      <Logo />
      <Navigation user={user} />
    </header>
  );
}
\`\`\`

### Error Handling

\`\`\`tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

## Conclusion

React Server Components represent a significant evolution in React development. They offer better performance, improved developer experience, and new architectural possibilities. As the ecosystem matures, Server Components will become an essential tool for building modern React applications.`,
    categoryId: '3',
    tags: ['React', 'Server Components', 'Performance', 'Next.js'],
  },
  {
    title: 'Modern JavaScript: ES2024 Features You Should Know',
    excerpt: 'Discover the latest JavaScript features in ES2024, including new array methods, improved error handling, and enhanced async programming capabilities.',
    content: `# Modern JavaScript: ES2024 Features You Should Know

JavaScript continues to evolve rapidly, with ES2024 bringing exciting new features that improve developer productivity and code quality. Let's explore the most important additions.

## Array Grouping Methods

### Array.prototype.group()
Group array elements by a key function:

\`\`\`javascript
const products = [
  { name: 'Laptop', category: 'Electronics', price: 999 },
  { name: 'Shirt', category: 'Clothing', price: 29 },
  { name: 'Phone', category: 'Electronics', price: 699 },
  { name: 'Jeans', category: 'Clothing', price: 79 }
];

const grouped = products.group(product => product.category);
console.log(grouped);
// {
//   Electronics: [
//     { name: 'Laptop', category: 'Electronics', price: 999 },
//     { name: 'Phone', category: 'Electronics', price: 699 }
//   ],
//   Clothing: [
//     { name: 'Shirt', category: 'Clothing', price: 29 },
//     { name: 'Jeans', category: 'Clothing', price: 79 }
//   ]
// }
\`\`\`

### Array.prototype.groupToMap()
Similar to group(), but returns a Map:

\`\`\`javascript
const groupedMap = products.groupToMap(product => product.category);
console.log(groupedMap.get('Electronics'));
\`\`\`

## Promise.withResolvers()

A new static method that returns a promise with its resolve and reject functions:

\`\`\`javascript
function createDeferredPromise() {
  const { promise, resolve, reject } = Promise.withResolvers();
  
  // You can resolve/reject from outside the promise constructor
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
  
  return promise;
}

// Usage
const deferred = createDeferredPromise();
deferred.then(console.log); // 'Success!' after 1 second
\`\`\`

## Temporal API (Stage 3)

The new Temporal API provides better date and time handling:

\`\`\`javascript
import { Temporal } from '@js-temporal/polyfill';

// Create precise dates
const date = Temporal.PlainDate.from('2024-03-15');
const time = Temporal.PlainTime.from('14:30:00');
const dateTime = Temporal.PlainDateTime.from('2024-03-15T14:30:00');

// Duration calculations
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const newDateTime = dateTime.add(duration);

// Time zone handling
const zonedDateTime = Temporal.ZonedDateTime.from('2024-03-15T14:30:00[America/New_York]');
const inTokyo = zonedDateTime.withTimeZone('Asia/Tokyo');
\`\`\`

## Improved Error Handling

### Error.cause
Chain errors with better context:

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (originalError) {
    throw new Error('User data retrieval failed', {
      cause: originalError
    });
  }
}

// Usage
try {
  await fetchUserData('123');
} catch (error) {
  console.log(error.message); // 'User data retrieval failed'
  console.log(error.cause); // Original fetch error
}
\`\`\`

## RegExp Match Indices

Get the start and end positions of regex matches:

\`\`\`javascript
const text = 'Hello world, hello universe';
const regex = /hello/gi;

const match = text.match(regex);
console.log(match); // ['Hello', 'hello']

// With indices flag
const regexWithIndices = /hello/gid;
const matchWithIndices = text.match(regexWithIndices);
console.log(matchWithIndices.indices);
// [[0, 5], [13, 18]] - start and end positions
\`\`\`

## Top-Level Await

Use await at the top level of modules:

\`\`\`javascript
// config.js
const config = await fetch('/api/config').then(r => r.json());
export default config;

// main.js
import config from './config.js';
console.log(config); // Config is already loaded
\`\`\`

## Private Fields and Methods

True privacy in JavaScript classes:

\`\`\`javascript
class BankAccount {
  #balance = 0;
  #accountNumber;
  
  constructor(accountNumber) {
    this.#accountNumber = accountNumber;
  }
  
  #validateAmount(amount) {
    return amount > 0 && typeof amount === 'number';
  }
  
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      return this.#balance;
    }
    throw new Error('Invalid amount');
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount('123456');
account.deposit(100);
console.log(account.getBalance()); // 100

// These will throw errors:
// console.log(account.#balance); // SyntaxError
// account.#validateAmount(50); // SyntaxError
\`\`\`

## Logical Assignment Operators

Combine logical operators with assignment:

\`\`\`javascript
// Nullish coalescing assignment
let user = { name: 'John' };
user.email ??= 'john@example.com'; // Only assign if email is null/undefined

// Logical OR assignment
let config = {};
config.theme ||= 'dark'; // Assign if theme is falsy

// Logical AND assignment
let settings = { notifications: true };
settings.notifications &&= checkPermissions(); // Assign if notifications is truthy
\`\`\`

## Numeric Separators

Make large numbers more readable:

\`\`\`javascript
const million = 1_000_000;
const binary = 0b1010_0001;
const hex = 0xFF_EC_DE_5E;
const bigInt = 123_456n;

console.log(million); // 1000000
\`\`\`

## WeakRefs and FinalizationRegistry

Advanced memory management:

\`\`\`javascript
class Cache {
  constructor() {
    this.cache = new Map();
    this.cleanup = new FinalizationRegistry((key) => {
      console.log(\`Cleaning up cache entry: \${key}\`);
      this.cache.delete(key);
    });
  }
  
  set(key, value) {
    this.cache.set(key, new WeakRef(value));
    this.cleanup.register(value, key);
  }
  
  get(key) {
    const ref = this.cache.get(key);
    if (ref) {
      const value = ref.deref();
      if (value) {
        return value;
      } else {
        this.cache.delete(key);
      }
    }
    return undefined;
  }
}
\`\`\`

## Best Practices

1. **Use array grouping** for data organization instead of reduce
2. **Leverage Promise.withResolvers()** for complex async patterns
3. **Adopt Temporal API** for robust date/time handling
4. **Chain errors** with Error.cause for better debugging
5. **Use private fields** for true encapsulation in classes

## Conclusion

ES2024 brings powerful new features that make JavaScript more expressive and robust. These additions help write cleaner, more maintainable code while providing better developer experience. Start incorporating these features into your projects to take advantage of modern JavaScript capabilities.`,
    categoryId: '2',
    tags: ['JavaScript', 'ES2024', 'Modern JavaScript', 'Features'],
  },
]

// Generate sample posts with proper structure
export const samplePosts: Post[] = samplePostsData.map((postData, index) => {
  const category = sampleCategories.find(cat => cat.id === postData.categoryId)!
  const publishedAt = new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)) // Each post 1 week apart
  
  return {
    id: (index + 1).toString(),
    title: postData.title,
    slug: generateSlug(postData.title),
    excerpt: postData.excerpt,
    content: postData.content,
    featuredImage: `https://images.unsplash.com/photo-${1600000000000 + index * 100000}?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80`,
    author: sampleAuthor,
    category,
    tags: postData.tags,
    publishedAt,
    updatedAt: publishedAt,
    status: 'published',
    readingTime: calculateReadingTime(postData.content),
  }
})

// Initialize sample data
export function initializeSampleData() {
  if (typeof window === 'undefined') return
  
  // Check if data already exists
  const existingPosts = localStorage.getItem('blog_posts')
  const existingAuthors = localStorage.getItem('blog_authors')
  const existingCategories = localStorage.getItem('blog_categories')
  
  // Only initialize if no data exists
  if (!existingPosts) {
    localStorage.setItem('blog_posts', JSON.stringify(samplePosts))
  }
  
  if (!existingAuthors) {
    localStorage.setItem('blog_authors', JSON.stringify([sampleAuthor]))
  }
  
  if (!existingCategories) {
    localStorage.setItem('blog_categories', JSON.stringify(sampleCategories))
  }
}