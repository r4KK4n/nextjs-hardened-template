# Project Conventions

This document outlines the coding conventions and standards for this project.

## File Naming

### Components
- **Format**: PascalCase
- **Examples**: `Button.tsx`, `UserProfile.tsx`, `NavigationMenu.tsx`
- **Location**: `/src/components/`

### Utilities and Libraries
- **Format**: kebab-case
- **Examples**: `format-date.ts`, `api-client.ts`, `user-repository.ts`
- **Location**: `/src/lib/`

### Routes and Pages
- **Format**: kebab-case
- **Examples**: `user-profile/page.tsx`, `about-us/page.tsx`
- **Location**: `/src/app/`

### Types
- **Format**: kebab-case with appropriate suffix
- **Examples**: `user-types.ts`, `api-types.ts`
- **Location**: `/src/types/`

### Tests
- **Format**: Match source file with `.test.ts` or `.test.tsx` extension
- **Examples**: `button.test.tsx`, `format-date.test.ts`
- **Location**: Next to the file being tested

## Code Naming

### Variables and Functions
```typescript
// camelCase for variables and functions
const userName = 'John';
const userAge = 25;

function calculateTotal(amount: number): number {
  return amount * 1.1;
}

async function fetchUserData(id: string): Promise<User> {
  // Implementation
}
```

### Constants
```typescript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;
```

### Types and Interfaces
```typescript
// PascalCase for types and interfaces
interface User {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'user' | 'guest';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}
```

### Enums
```typescript
// PascalCase for enum name, UPPER_SNAKE_CASE for values
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
```

### React Specific

#### Component Names
```typescript
// PascalCase, descriptive names
function UserProfile() { }
function NavigationBar() { }
function SearchResults() { }
```

#### Props Interfaces
```typescript
// Component name + Props suffix
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}
```

#### Hooks
```typescript
// Prefix with 'use'
function useAuth() { }
function useLocalStorage<T>(key: string) { }
function useFetch<T>(url: string) { }
```

#### Event Handlers
```typescript
// Prefix with 'handle'
function handleClick() { }
function handleSubmit(e: FormEvent) { }
function handleInputChange(value: string) { }
```

#### Boolean Props/Variables
```typescript
// Prefix with is/has/should/can
const isLoading = false;
const hasError = false;
const shouldRender = true;
const canEdit = true;
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading UI
│   └── not-found.tsx      # 404 page
│
├── components/            # React components
│   ├── ui/               # Basic UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── features/         # Feature-specific components
│   │   └── user-profile.tsx
│   └── index.ts          # Barrel exports
│
├── lib/                   # Utility functions
│   ├── utils.ts          # General utilities
│   ├── format.ts         # Formatting functions
│   ├── validation.ts     # Validation logic
│   ├── logger.ts         # Logging
│   ├── errors.ts         # Error classes
│   └── constants.ts      # Constants
│
├── types/                 # TypeScript definitions
│   ├── index.ts          # Common types
│   └── env.d.ts          # Environment variables
│
├── styles/                # Styles
│   └── globals.css       # Global styles
│
└── test/                  # Test utilities
    └── setup.ts          # Test setup
```

## Import Order

```typescript
// 1. React and Next.js
import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. External libraries
import { z } from 'zod';
import clsx from 'clsx';

// 3. Internal - absolute imports using @/ alias
import { Button } from '@/components';
import { formatDate } from '@/lib/format';
import { User } from '@/types';

// 4. Relative imports
import { helper } from './helper';
import styles from './styles.module.css';

// 5. Type imports (if separate)
import type { Props } from './types';
```

## TypeScript Guidelines

### Prefer Explicit Types
```typescript
// ❌ Avoid
const data = getData();

// ✅ Prefer
const data: User[] = getData();
```

### Use Interface for Objects, Type for Unions
```typescript
// ✅ Interface for object shapes
interface User {
  id: string;
  name: string;
}

// ✅ Type for unions and primitives
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;
```

### Avoid Any
```typescript
// ❌ Avoid
function process(data: any) { }

// ✅ Use unknown or specific types
function process(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
}

// ✅ Or define proper types
interface ProcessData {
  id: string;
  value: number;
}

function process(data: ProcessData) { }
```

### Use Type Guards
```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  // TypeScript knows data is User here
  console.log(data.name);
}
```

## Component Patterns

### Server Component (Default)
```typescript
// No 'use client' directive
export default async function UserPage({ params }: Props) {
  const user = await getUser(params.id);
  return <div>{user.name}</div>;
}
```

### Client Component
```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Component with Props
```typescript
interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

## API Route Patterns

```typescript
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fetchData(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Error Handling

### Try-Catch for Async Operations
```typescript
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw new AppError('Data fetch failed');
  }
}
```

### Custom Error Classes
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
```

## Testing Conventions

### Test File Location
Place test files next to the code they test:
```
src/
├── components/
│   ├── button.tsx
│   └── button.test.tsx
├── lib/
│   ├── format.ts
│   └── format.test.ts
```

### Test Structure
```typescript
describe('ComponentName or FunctionName', () => {
  describe('specific behavior', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Test Naming
```typescript
// ✅ Descriptive test names
it('should return formatted date when given valid date string', () => {});
it('should throw error when email is invalid', () => {});
it('should render loading state when data is fetching', () => {});

// ❌ Vague test names
it('works', () => {});
it('test 1', () => {});
```

## Comments

### When to Comment
```typescript
// ✅ Complex business logic
// Calculate discount based on customer tier and purchase history
// Bronze: 5%, Silver: 10%, Gold: 15%, Platinum: 20%
const discount = calculateTierDiscount(customer);

// ✅ Non-obvious decisions
// Using setTimeout instead of requestAnimationFrame
// because we need precise timing for the animation
setTimeout(animate, 16);

// ✅ Workarounds
// TODO: Remove this workaround when library v2.0 is released
// Current version doesn't support async validation
const validated = validateSync(data);
```

### When NOT to Comment
```typescript
// ❌ Obvious code
// Set name to user name
const name = user.name;

// ❌ Redundant comments
// Increment counter by 1
counter += 1;
```

## Git Commit Messages

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add password reset functionality

Implements password reset flow with email verification.
Users can request a reset link that expires after 1 hour.

Closes #123
```

```
fix(api): handle null user in getUserProfile

Added null check before accessing user properties.
Throws NotFoundError when user doesn't exist.

Fixes #456
```

## Environment Variables

### Naming
```bash
# Client-side (public)
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_API_KEY=pk_live_abc123

# Server-side (private)
DATABASE_URL=postgresql://...
API_SECRET_KEY=sk_live_xyz789
NEXTAUTH_SECRET=secret123
```

### Usage
```typescript
// ✅ Type-safe environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

// ✅ Access with confidence
const dbUrl = process.env.DATABASE_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

## Code Formatting

- Use Prettier for formatting (configured in `.prettierrc.json`)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas (ES5)
- Max line length: 100 characters

## ESLint Rules

Key rules enforced:
- No unused variables (except prefixed with `_`)
- No console.log in production (use logger)
- Prefer const over let
- No any without justification
- React hooks rules enforced

## Documentation

### JSDoc for Public APIs
```typescript
/**
 * Formats a date to a human-readable string
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date()); // "January 15, 2024"
 * formatDate('2024-01-15'); // "January 15, 2024"
 * ```
 */
export function formatDate(date: Date | string): string {
  // Implementation
}
```

## Additional Resources

- **EditorConfig**: `.editorconfig`
- **ESLint Config**: `.eslintrc.json`
- **Prettier Config**: `.prettierrc.json`
- **TypeScript Config**: `tsconfig.json`
- **Copilot System**: `.github/copilot/system.md`
