# Copilot Prompt: Unit Tests

## Context

Write comprehensive unit tests for functions, utilities, and components using Vitest and React Testing Library.

## When to Use

- Testing utility functions
- Testing React components
- Testing custom hooks
- Testing business logic

## Steps

1. **Set Up Test File**
   - Create test file with `.test.ts` or `.test.tsx` extension
   - Import necessary testing utilities
   - Import code to be tested

2. **Organize Tests**
   - Use `describe` blocks for grouping
   - Write descriptive test names
   - Follow Arrange-Act-Assert pattern

3. **Write Test Cases**
   - Test happy path first
   - Test edge cases
   - Test error scenarios
   - Test all branches

4. **Mock Dependencies**
   - Mock external dependencies
   - Mock API calls
   - Mock Next.js modules when needed

5. **Verify Behavior**
   - Use appropriate assertions
   - Check return values
   - Verify side effects
   - Test async operations

## Output Format

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('ComponentName or FunctionName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Do's

✅ Write descriptive test names
✅ Test one thing per test
✅ Use Arrange-Act-Assert pattern
✅ Mock external dependencies
✅ Test edge cases
✅ Test error scenarios
✅ Keep tests independent
✅ Use appropriate matchers
✅ Test accessibility
✅ Aim for high coverage

## Don'ts

❌ Test implementation details
❌ Write flaky tests
❌ Test external libraries
❌ Duplicate test logic
❌ Use vague test names
❌ Skip edge cases
❌ Forget to clean up
❌ Test too many things at once
❌ Hardcode test data unnecessarily
❌ Ignore async operations

## Example: Testing Utility Function

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, truncate, capitalize } from '@/lib/format';

describe('format utilities', () => {
  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBe('January 15, 2024');
    });

    it('should format date string correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('January 15, 2024');
    });

    it('should handle invalid dates', () => {
      const result = formatDate('invalid');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format other currencies', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toBe('€1,234.56');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-100);
      expect(result).toBe('-$100.00');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text';
      const result = truncate(text, 10);
      expect(result).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      const result = truncate(text, 10);
      expect(result).toBe('Short');
    });

    it('should handle empty string', () => {
      const result = truncate('', 10);
      expect(result).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      const result = capitalize('hello');
      expect(result).toBe('Hello');
    });

    it('should handle already capitalized text', () => {
      const result = capitalize('Hello');
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = capitalize('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = capitalize('a');
      expect(result).toBe('A');
    });
  });
});
```

## Example: Testing React Component

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply primary variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-gray-600');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
  });

  it('should render with correct button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should be accessible', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button', { name: 'Accessible Button' });
    expect(button).toBeInTheDocument();
  });
});
```

## Example: Testing Async Operations

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchUserData } from '@/lib/api';

// Mock fetch
global.fetch = vi.fn();

describe('fetchUserData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user data successfully', async () => {
    const mockUser = { id: '1', name: 'John Doe' };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await fetchUserData('1');

    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(result).toEqual(mockUser);
  });

  it('should handle fetch errors', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchUserData('1')).rejects.toThrow('User not found');
  });

  it('should handle network errors', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUserData('1')).rejects.toThrow('Network error');
  });
});
```

## Example: Testing Custom Hook

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/use-counter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

## Vitest Matchers Reference

```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toStrictEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveReturned();
expect(fn).toHaveReturnedWith(value);

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(error);

// DOM (React Testing Library)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveClass('className');
expect(element).toHaveAttribute('attr', 'value');
expect(element).toHaveTextContent('text');
```

## Checklist

- [ ] Tests are descriptive and clear
- [ ] Happy path is tested
- [ ] Edge cases are covered
- [ ] Error scenarios are tested
- [ ] Async operations are handled
- [ ] Dependencies are mocked
- [ ] Tests are independent
- [ ] Cleanup is performed
- [ ] Accessibility is tested
- [ ] Coverage is adequate

## Related Prompts

- `nextjs-component.md` - For creating components
- `api-route.md` - For API testing
- `refactor.md` - When refactoring with tests
