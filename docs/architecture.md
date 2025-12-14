# Architecture

This document describes the architecture and design decisions for this Next.js application.

## Overview

This application follows a modular, layer-based architecture optimized for Next.js App Router with Server Components.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, UI, Pages)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│  (App Router, Server Actions, Routes)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Business Logic Layer            │
│    (Services, Utilities, Validation)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Access Layer               │
│   (Repositories, API Clients, Cache)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Layer                      │
│    (Database, External APIs, Files)     │
└─────────────────────────────────────────┘
```

## Presentation Layer

### Components

Located in `/src/components/`

#### UI Components (`/src/components/ui/`)

- Basic, reusable UI elements
- No business logic
- Accept data via props
- Examples: Button, Card, Input, Modal

```typescript
// ui/button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

#### Feature Components (`/src/components/features/`)

- Feature-specific compositions
- May contain feature logic
- Examples: UserProfile, PostEditor, CommentList

```typescript
// features/user-profile.tsx
export function UserProfile({ userId }: Props) {
  // Feature-specific logic
  return <div>{/* Composed UI */}</div>;
}
```

### Server vs Client Components

**Server Components (Default)**

- Fetch data on server
- No client-side JavaScript
- Better performance
- Cannot use hooks or event handlers

```typescript
// Default - Server Component
export default async function PostsPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}
```

**Client Components**

- Use 'use client' directive
- Interactive features
- React hooks
- Event handlers

```typescript
'use client';

export function SearchBar() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

## Application Layer

### App Router

Located in `/src/app/`

#### Route Structure

```
app/
├── (auth)/          # Route groups (no URL segment)
│   ├── login/
│   └── register/
├── api/             # API routes
│   └── users/
│       └── route.ts
├── dashboard/       # Regular routes
│   ├── page.tsx
│   └── layout.tsx
├── layout.tsx       # Root layout
├── page.tsx         # Home page
├── error.tsx        # Error boundary
├── loading.tsx      # Loading UI
└── not-found.tsx    # 404 page
```

#### Special Files

**layout.tsx** - Shared UI for routes

```typescript
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

**page.tsx** - Route UI

```typescript
export default function DashboardPage() {
  return <div>Dashboard Content</div>;
}
```

**loading.tsx** - Loading UI

```typescript
export default function Loading() {
  return <Spinner />;
}
```

**error.tsx** - Error handling

```typescript
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### API Routes

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const user = await createUser(data);
  return NextResponse.json(user, { status: 201 });
}
```

### Server Actions

```typescript
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');

  // Validation
  // Business logic
  // Data persistence

  revalidatePath('/blog');
  redirect('/blog');
}
```

## Business Logic Layer

### Services

Domain-specific business logic

```typescript
// lib/services/user-service.ts
export class UserService {
  constructor(private repository: UserRepository) {}

  async registerUser(data: RegisterData): Promise<User> {
    // Validation
    await this.validateEmail(data.email);

    // Business rules
    if (await this.repository.existsByEmail(data.email)) {
      throw new ValidationError('Email already registered');
    }

    // Process
    const user = await this.repository.create(data);

    // Side effects
    await this.sendWelcomeEmail(user);

    return user;
  }
}
```

### Utilities

Pure functions, no side effects

```typescript
// lib/format.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```

### Validation

Input validation using Zod

```typescript
// lib/validation/user-schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

export type UserInput = z.infer<typeof userSchema>;
```

## Data Access Layer

### Repositories

Abstract data source operations

```typescript
// lib/repositories/user-repository.ts
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserData): Promise<User> {
    return db.user.create({ data });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return db.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({ where: { id } });
  }
}
```

### API Clients

External API interactions

```typescript
// lib/api/external-api-client.ts
export class ExternalApiClient {
  private baseUrl = 'https://api.example.com';

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  }
}
```

### Caching

Data caching layer

```typescript
// lib/cache.ts
export class Cache {
  private store = new Map();

  get<T>(key: string): T | null {
    return this.store.get(key) ?? null;
  }

  set<T>(key: string, value: T, ttl: number): void {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), ttl);
  }
}
```

## Data Flow

### Read Operation (Server Component)

```
User Request
    ↓
Page Component (Server)
    ↓
Service Layer
    ↓
Repository
    ↓
Database
    ↓
Response to Client
```

### Write Operation (Server Action)

```
User Form Submission
    ↓
Server Action
    ↓
Validation
    ↓
Service Layer
    ↓
Repository
    ↓
Database
    ↓
Revalidate Cache
    ↓
Redirect/Update UI
```

### API Route

```
Client Fetch Request
    ↓
API Route Handler
    ↓
Validation
    ↓
Service Layer
    ↓
Repository
    ↓
Database
    ↓
JSON Response
```

## State Management

### Server State

- Fetched via Server Components
- No client-side state needed
- Automatic caching by Next.js

### Client State

- React hooks (useState, useReducer)
- For UI state only
- Keep minimal

### Form State

- Server Actions with useFormState
- Progressive enhancement
- Server-side validation

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return <ErrorDisplay error={error} onReset={reset} />;
}
```

### Custom Errors

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
  }
}
```

### API Error Responses

```typescript
if (error instanceof ValidationError) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}
```

## Security Architecture

### Authentication

- Handled at route level
- Middleware for protection
- Session/JWT tokens

### Authorization

- Check permissions in Server Actions
- Check permissions in API routes
- Role-based access control

### Input Validation

- Zod schemas for type safety
- Validate on server side
- Sanitize user input

### Data Protection

- Environment variables for secrets
- HTTPS in production
- Security headers configured

## Performance Optimization

### Server Components

- Default for all components
- Reduce JavaScript bundle
- Better initial page load

### Code Splitting

- Automatic by Next.js
- Dynamic imports for heavy components

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

### Caching Strategy

- Next.js automatic caching
- Revalidation with `revalidatePath`
- Custom cache for expensive operations

## Testing Strategy

### Unit Tests

- Test utilities and helpers
- Test business logic
- Mock external dependencies

### Integration Tests

- Test component interactions
- Test API routes
- Test Server Actions

### E2E Tests (Optional)

- Critical user flows
- Authentication flows
- Purchase flows

## Deployment Architecture

```
CDN (Vercel Edge)
    ↓
Next.js Server (Vercel)
    ↓
┌─────────────────┐
│   Application   │
└─────────────────┘
    ↓       ↓
Database   External APIs
```

### Environment-Specific Configs

**Development**

- Local database
- Debug logging
- Hot reload

**Production**

- Production database
- Error tracking (Sentry)
- Optimized builds
- Security headers

## Key Decisions

### Why Next.js App Router?

- Server Components for performance
- Built-in routing and layouts
- Streaming and Suspense
- Server Actions for mutations

### Why TypeScript?

- Type safety at compile time
- Better IDE support
- Self-documenting code
- Catch errors early

### Why Vitest?

- Fast test execution
- Native ESM support
- Better TypeScript support
- Compatible with Vite ecosystem

### Why Tailwind CSS?

- Utility-first approach
- Consistent design system
- Small bundle size
- Rapid development

### Why Zod for Validation?

- TypeScript-first
- Runtime type checking
- Composable schemas
- Excellent error messages

## Future Considerations

### Potential Additions

- Database ORM (Prisma)
- Authentication library (NextAuth.js)
- State management (if needed)
- API documentation (Swagger)
- E2E testing (Playwright)
- Monitoring (Sentry, DataDog)
- Analytics (Google Analytics, Plausible)

### Scalability

- Horizontal scaling on Vercel
- Database connection pooling
- Caching layer (Redis)
- CDN for static assets
- Background jobs (queues)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
