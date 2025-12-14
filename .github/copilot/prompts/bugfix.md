# Copilot Prompt: Bug Fix

## Context
Systematically identify, diagnose, and fix bugs while preventing regression.

## When to Use
- Application is crashing
- Feature not working as expected
- Unexpected error messages
- Edge cases causing issues
- Performance problems

## Steps

1. **Reproduce the Bug**
   - Understand expected behavior
   - Identify actual behavior
   - Create minimal reproduction
   - Document steps to reproduce

2. **Investigate Root Cause**
   - Check error logs
   - Review stack traces
   - Add debugging statements
   - Check related code
   - Review recent changes

3. **Identify the Fix**
   - Locate problematic code
   - Understand why it fails
   - Plan the solution
   - Consider side effects

4. **Implement the Fix**
   - Make minimal changes
   - Follow coding standards
   - Add defensive checks
   - Improve error handling

5. **Write Test**
   - Create test that fails before fix
   - Verify test passes after fix
   - Add edge case tests
   - Check for regression

6. **Verify the Fix**
   - Test original scenario
   - Test edge cases
   - Manual testing
   - Check for side effects

7. **Document**
   - Update comments if needed
   - Document in changelog
   - Update issue tracker

## Bug Report Template

```markdown
### Bug Description
Clear description of the bug

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Environment
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 0.1.0]

### Stack Trace
```
Error stack trace here
```

### Additional Context
Screenshots, logs, etc.
```

## Do's

✅ Reproduce the bug first
✅ Write a failing test
✅ Make minimal changes
✅ Fix root cause, not symptoms
✅ Add defensive checks
✅ Test edge cases
✅ Document the fix
✅ Check for similar bugs
✅ Update error messages
✅ Consider user experience

## Don'ts

❌ Skip reproduction
❌ Apply quick hacks
❌ Fix without understanding
❌ Introduce new bugs
❌ Skip writing tests
❌ Fix symptoms only
❌ Make large changes
❌ Ignore edge cases
❌ Forget documentation
❌ Skip code review

## Example: Null Pointer Bug

```typescript
// Before: Crashes when user is not found
export async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId }
  });
  
  // Bug: user might be null
  return {
    name: user.name,
    email: user.email,
  };
}

// After: Proper null handling
export async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return {
    name: user.name,
    email: user.email,
  };
}

// Test to prevent regression
describe('getUserProfile', () => {
  it('should throw NotFoundError when user does not exist', async () => {
    await expect(getUserProfile('invalid-id'))
      .rejects
      .toThrow(NotFoundError);
  });
  
  it('should return user profile when user exists', async () => {
    const profile = await getUserProfile('valid-id');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('email');
  });
});
```

## Example: Race Condition Bug

```typescript
// Before: Race condition in async operations
function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);
  
  return { data, loading };
}

// After: Cleanup to prevent race condition
function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    fetchData().then(result => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    
    return () => {
      cancelled = true;
    };
  }, []);
  
  return { data, loading };
}
```

## Example: Off-by-One Error

```typescript
// Before: Misses last item
function processBatch(items: string[]) {
  for (let i = 0; i < items.length - 1; i++) {
    processItem(items[i]);
  }
}

// After: Processes all items
function processBatch(items: string[]) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
  }
}

// Better: Use array methods
function processBatch(items: string[]) {
  items.forEach(processItem);
}

// Test
describe('processBatch', () => {
  it('should process all items', () => {
    const mockProcess = vi.fn();
    const items = ['a', 'b', 'c'];
    
    processBatch(items);
    
    expect(mockProcess).toHaveBeenCalledTimes(3);
  });
});
```

## Common Bug Patterns

### Null/Undefined Errors
```typescript
// Check before access
if (user?.profile?.address) {
  // Use address
}

// Use nullish coalescing
const name = user?.name ?? 'Anonymous';
```

### Async/Await Errors
```typescript
// Always handle promise rejections
try {
  const data = await fetchData();
} catch (error) {
  handleError(error);
}
```

### Type Coercion Issues
```typescript
// Be explicit with comparisons
if (value === 0) { } // not: if (value) { }
if (array.length === 0) { } // not: if (!array.length) { }
```

### Memory Leaks
```typescript
// Clean up event listeners
useEffect(() => {
  const handler = () => { };
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

### Mutation Bugs
```typescript
// Don't mutate state directly
// Bad
state.items.push(newItem);

// Good
setState({ ...state, items: [...state.items, newItem] });
```

## Debugging Techniques

### Console Logging
```typescript
console.log('Debug:', variable);
console.table(arrayOfObjects);
console.trace('Function call stack');
```

### Debugger Statement
```typescript
function problematicFunction() {
  debugger; // Execution pauses here
  // Rest of code
}
```

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Checklist

- [ ] Bug is reproduced consistently
- [ ] Root cause is identified
- [ ] Failing test is written
- [ ] Fix is implemented
- [ ] Test passes after fix
- [ ] Edge cases are tested
- [ ] No regression introduced
- [ ] Code is reviewed
- [ ] Documentation is updated
- [ ] Issue is closed with details

## Commit Message Format

```
fix(scope): brief description of fix

Detailed explanation of:
- What was broken
- Why it was broken
- How it's fixed

Fixes #issue_number
```

## Example Commit Messages

```
fix(auth): prevent race condition in login flow

Added cleanup function to useEffect to cancel pending
requests when component unmounts. This prevents state
updates on unmounted components.

Fixes #123
```

```
fix(api): handle null user in getUserProfile

Added null check before accessing user properties.
Throws NotFoundError when user doesn't exist.

Fixes #456
```

## Related Prompts
- `unit-tests.md` - For testing fixes
- `code-review.md` - For reviewing fixes
- `refactor.md` - For larger fixes requiring refactoring
