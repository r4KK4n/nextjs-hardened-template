# Copilot Prompt: Performance Optimization

## Context

Identify and fix performance bottlenecks in React components, API routes, and application code.

## When to Use

- Application feels slow
- Long load times
- Unresponsive UI
- High memory usage
- Slow API responses
- Poor Core Web Vitals

## Steps

1. **Measure First**
   - Use browser DevTools
   - Check React DevTools Profiler
   - Measure Core Web Vitals
   - Identify bottlenecks

2. **Identify Issues**
   - Unnecessary re-renders
   - Large bundle size
   - Slow API calls
   - Inefficient algorithms
   - Memory leaks

3. **Apply Optimizations**
   - Memoization
   - Code splitting
   - Image optimization
   - API caching
   - Database queries

4. **Measure Again**
   - Compare before/after
   - Verify improvements
   - Check side effects

## Do's

✅ Measure before optimizing
✅ Focus on real bottlenecks
✅ Use React.memo appropriately
✅ Implement code splitting
✅ Optimize images
✅ Use proper caching
✅ Lazy load components
✅ Debounce/throttle events
✅ Optimize database queries
✅ Monitor in production

## Don'ts

❌ Premature optimization
❌ Optimize without measuring
❌ Sacrifice readability
❌ Over-memoize
❌ Ignore user experience
❌ Skip testing after optimization
❌ Optimize the wrong things
❌ Make code unreadable
❌ Ignore bundle size
❌ Forget accessibility

## React Performance

### Prevent Unnecessary Re-renders

```typescript
// Before: Re-renders on every parent update
function ExpensiveComponent({ data }) {
  return <div>{/* Complex rendering */}</div>;
}

// After: Only re-renders when data changes
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data
}: { data: Data }) {
  return <div>{/* Complex rendering */}</div>;
});
```

### Use useMemo for Expensive Calculations

```typescript
// Before: Recalculates on every render
function DataDisplay({ items }) {
  const sortedItems = sortComplexData(items);
  const filteredItems = filterData(sortedItems);

  return <List items={filteredItems} />;
}

// After: Only recalculates when items change
function DataDisplay({ items }: { items: Item[] }) {
  const processedItems = useMemo(() => {
    const sorted = sortComplexData(items);
    return filterData(sorted);
  }, [items]);

  return <List items={processedItems} />;
}
```

### Use useCallback for Event Handlers

```typescript
// Before: Creates new function on every render
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <Child
      onClick={() => setCount(c => c + 1)}
    />
  );
}

// After: Stable function reference
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}
```

### Lazy Load Components

```typescript
// Before: All components loaded upfront
import HeavyComponent from './HeavyComponent';

function App() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}

// After: Load on demand
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### Virtualize Long Lists

```typescript
// Before: Renders all items (slow for 1000+ items)
function LongList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

// After: Only renders visible items
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Next.js Performance

### Image Optimization

```typescript
// Before: Unoptimized images
<img src="/large-image.jpg" alt="Description" />

// After: Next.js Image component
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Font Optimization

```typescript
// Before: External font loading
<link rel="stylesheet" href="https://fonts.googleapis.com/..." />

// After: Next.js font optimization
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Streaming and Suspense

```typescript
// Streaming with loading states
export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<PostsLoadingSkeleton />}>
        <Posts />
      </Suspense>
    </>
  );
}

async function Posts() {
  const posts = await fetchPosts();
  return <PostsList posts={posts} />;
}
```

## API Performance

### Caching

```typescript
// Server-side caching
export async function GET() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  return NextResponse.json(data);
}

// Client-side caching with SWR
import useSWR from 'swr';

function useUserData(userId: string) {
  const { data, error } = useSWR(`/api/users/${userId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  return { data, error, isLoading: !error && !data };
}
```

### Database Query Optimization

```typescript
// Before: N+1 query problem
async function getPostsWithAuthors() {
  const posts = await db.post.findMany();

  for (const post of posts) {
    post.author = await db.user.findUnique({
      where: { id: post.authorId },
    });
  }

  return posts;
}

// After: Single query with includes
async function getPostsWithAuthors() {
  return db.post.findMany({
    include: {
      author: true,
    },
  });
}

// Pagination
async function getPosts(page: number, limit: number) {
  return db.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}
```

## Event Handling Performance

### Debouncing

```typescript
import { debounce } from '@/lib/utils';

function SearchInput() {
  const [query, setQuery] = useState('');

  // Debounce search to reduce API calls
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      performSearch(value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
```

### Throttling

```typescript
import { throttle } from '@/lib/utils';

function ScrollHandler() {
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Handle scroll event
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div>{/* Content */}</div>;
}
```

## Bundle Size Optimization

### Dynamic Imports

```typescript
// Before: Imports all utilities upfront
import { formatDate, formatCurrency, formatNumber } from './utils';

// After: Import only what's needed
import { formatDate } from './utils/format-date';

// Or dynamic import for rarely used code
async function handleExport() {
  const { generatePDF } = await import('./pdf-generator');
  await generatePDF(data);
}
```

### Tree Shaking

```typescript
// Before: Imports entire library
import _ from 'lodash';

const result = _.debounce(fn, 300);

// After: Import specific functions
import debounce from 'lodash/debounce';

const result = debounce(fn, 300);
```

## Performance Monitoring

```typescript
// Web Vitals tracking
import { onCLS, onFID, onLCP } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric);
  const url = 'https://analytics.example.com/vitals';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

## Checklist

- [ ] Performance metrics captured (before)
- [ ] Bottlenecks identified
- [ ] Optimizations applied
- [ ] Performance metrics captured (after)
- [ ] Improvements verified
- [ ] Tests still pass
- [ ] Code is still readable
- [ ] No new bugs introduced
- [ ] Bundle size checked
- [ ] Core Web Vitals improved

## Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 800ms
- **Bundle Size**: < 200KB (gzipped)

## Related Prompts

- `refactor.md` - For refactoring during optimization
- `code-review.md` - For reviewing performance changes
- `unit-tests.md` - For testing optimized code
