# Copilot Prompt: Data Access Layer

## Context

Create clean, efficient data access patterns for database operations and external APIs.

## When to Use

- Implementing database queries
- Creating API clients
- Building data repositories
- Abstracting data sources

## Patterns

### Repository Pattern

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

// lib/repositories/user-repository.ts
import { db } from '@/lib/db';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    const { password, ...userData } = data;
    const hashedPassword = await hash(password);

    return db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }

  async list(page: number = 1, limit: number = 10): Promise<User[]> {
    return db.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const userRepository = new UserRepository();
```

### API Client Pattern

```typescript
// lib/api-client.ts
import { logger } from '@/lib/logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class ApiClient {
  constructor(
    private baseUrl: string,
    private defaultHeaders: HeadersInit = {}
  ) {}

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = 10000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.message || 'Request failed', response.status, errorData);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if ((error as Error).name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      logger.error('API request failed', error);
      throw new ApiError('Network error', 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Usage
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || '', {
  Authorization: `Bearer ${process.env.API_TOKEN}`,
});
```

### Caching Layer

```typescript
// lib/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache {
  private store: Map<string, CacheEntry<unknown>> = new Map();

  set<T>(key: string, data: T, ttl: number = 3600000): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.store.delete(key);
      return false;
    }

    return true;
  }
}

export const cache = new Cache();

// Cached repository wrapper
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 3600000
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttl);

    return result;
  }) as T;
}
```

## Do's

✅ Separate data access from business logic
✅ Use repository pattern for consistency
✅ Handle errors appropriately
✅ Implement proper caching
✅ Use transactions when needed
✅ Validate data before persistence
✅ Use connection pooling
✅ Log database operations
✅ Implement retry logic for failures
✅ Use prepared statements

## Don'ts

❌ Put business logic in repositories
❌ Expose database details to consumers
❌ Ignore connection limits
❌ Skip error handling
❌ Cache everything
❌ Use raw queries without sanitization
❌ Forget to close connections
❌ Skip input validation
❌ Ignore N+1 query problems
❌ Hardcode connection strings

## Checklist

- [ ] Data access is abstracted
- [ ] Error handling is implemented
- [ ] Transactions are used appropriately
- [ ] Queries are optimized
- [ ] Caching is implemented where beneficial
- [ ] Connection pooling is configured
- [ ] Input validation is performed
- [ ] Logging is in place
- [ ] Types are properly defined
- [ ] Tests cover data operations

## Related Prompts

- `api-route.md` - For API implementation
- `server-action.md` - For Server Actions
- `unit-tests.md` - For testing data access
