# Copilot Prompt: Code Review

## Context

Guidelines for reviewing code to ensure quality, security, and maintainability.

## Review Checklist

### Functionality

- [ ] Code works as intended
- [ ] All requirements are met
- [ ] Edge cases are handled
- [ ] Error scenarios are covered

### Code Quality

- [ ] Code is readable and maintainable
- [ ] Functions are small and focused
- [ ] No unnecessary complexity
- [ ] DRY principle is followed
- [ ] Naming is clear and consistent

### TypeScript

- [ ] Proper types are used
- [ ] No `any` without justification
- [ ] Type guards where needed
- [ ] Interfaces are well-defined

### Testing

- [ ] Tests are included
- [ ] Tests cover edge cases
- [ ] Tests are meaningful
- [ ] Tests pass locally

### Security

- [ ] Input is validated
- [ ] No SQL injection vulnerabilities
- [ ] XSS is prevented
- [ ] Authentication is checked
- [ ] Authorization is verified
- [ ] Sensitive data is protected

### Performance

- [ ] No obvious performance issues
- [ ] Proper use of memoization
- [ ] No unnecessary re-renders
- [ ] Database queries are optimized

### Accessibility

- [ ] Semantic HTML is used
- [ ] ARIA labels are present
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient

### Style & Conventions

- [ ] Follows project conventions
- [ ] ESLint passes
- [ ] Prettier formatted
- [ ] No console.log statements
- [ ] Comments are helpful

## Review Comments Template

### Blocking Issues (Must Fix)

```
🚫 **Blocking**: Security issue
This exposes user passwords in the response. Please exclude
the password field from the user select statement.
```

### Important Suggestions (Should Fix)

```
⚠️ **Important**: Type safety
Consider using a specific type instead of `any` here.
This will help catch errors at compile time.
```

### Nice to Have (Could Fix)

```
💡 **Suggestion**: Code readability
This could be simplified using array methods:
\`\`\`typescript
return items.filter(item => item.active).map(item => item.name);
\`\`\`
```

### Positive Feedback

```
✅ **Great**: Error handling
Excellent error handling with specific error types!
```

### Questions

```
❓ **Question**: Implementation choice
Why was this approach chosen over using the built-in
method? Is there a specific performance benefit?
```

## Common Review Scenarios

### Security Vulnerability

```
🚫 **Blocking**: SQL Injection vulnerability

This code is vulnerable to SQL injection:
\`\`\`typescript
const query = `SELECT * FROM users WHERE id = ${userId}`;
\`\`\`

Please use parameterized queries:
\`\`\`typescript
const user = await db.user.findUnique({ where: { id: userId } });
\`\`\`
```

### Missing Error Handling

```
⚠️ **Important**: Missing error handling

This async operation doesn't handle errors:
\`\`\`typescript
const data = await fetchData();
\`\`\`

Please add try-catch:
\`\`\`typescript
try {
  const data = await fetchData();
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('Data fetch failed');
}
\`\`\`
```

### Type Safety Issue

```
⚠️ **Important**: Type safety

Using `any` defeats the purpose of TypeScript:
\`\`\`typescript
function process(data: any) {
  return data.value;
}
\`\`\`

Please define proper types:
\`\`\`typescript
interface Data {
  value: string;
}

function process(data: Data): string {
  return data.value;
}
\`\`\`
```

### Performance Issue

```
⚠️ **Important**: Performance concern

This creates a new function on every render:
\`\`\`typescript
<Button onClick={() => handleClick(id)} />
\`\`\`

Consider using useCallback:
\`\`\`typescript
const onClick = useCallback(() => handleClick(id), [id]);
<Button onClick={onClick} />
\`\`\`
```

### Code Duplication

```
💡 **Suggestion**: DRY principle

There's duplicate logic here. Consider extracting to a shared function:
\`\`\`typescript
function validateAndProcess(data: Data) {
  validate(data);
  return process(data);
}
\`\`\`
```

### Missing Tests

```
⚠️ **Important**: Missing tests

Please add tests for:
- Happy path
- Error scenarios
- Edge cases (empty array, null values)
```

### Accessibility Issue

```
⚠️ **Important**: Accessibility

This button needs an accessible label:
\`\`\`typescript
<button onClick={handleClose}>
  <X />
</button>
\`\`\`

Add aria-label:
\`\`\`typescript
<button onClick={handleClose} aria-label="Close dialog">
  <X />
</button>
\`\`\`
```

## Review Best Practices

### Be Constructive

```
❌ Bad: "This code is terrible"
✅ Good: "This could be improved by..."

❌ Bad: "You don't know TypeScript"
✅ Good: "Here's a TypeScript pattern that might help..."
```

### Provide Context

```
❌ Bad: "Change this"
✅ Good: "This could cause memory leaks because..."

❌ Bad: "Use this instead"
✅ Good: "Using X instead of Y would improve performance by..."
```

### Offer Solutions

```
❌ Bad: "This is wrong"
✅ Good: "Consider this approach instead: [code example]"

❌ Bad: "Don't do it this way"
✅ Good: "Here's an alternative that handles edge cases better..."
```

### Acknowledge Good Work

```
✅ "Great job on the error handling!"
✅ "Nice use of TypeScript generics here"
✅ "I like how you structured these components"
✅ "Excellent test coverage!"
```

## Review Priority Levels

### P0 - Critical (Must Fix Before Merge)

- Security vulnerabilities
- Data loss risks
- Breaking changes
- Production-breaking bugs

### P1 - Important (Should Fix Before Merge)

- Type safety issues
- Missing error handling
- Performance problems
- Missing tests for critical paths

### P2 - Nice to Have (Can Fix Later)

- Code style improvements
- Refactoring opportunities
- Additional test coverage
- Documentation improvements

### P3 - Informational (Optional)

- Alternative approaches
- Learning opportunities
- Future enhancements
- Questions for discussion

## Code Review Etiquette

### For Reviewers

✅ **Do:**

- Review promptly
- Be specific and constructive
- Explain reasoning
- Suggest alternatives
- Acknowledge good work
- Ask questions for understanding
- Focus on important issues

❌ **Don't:**

- Be vague or dismissive
- Nitpick minor style issues
- Make it personal
- Assume malicious intent
- Block on personal preferences
- Review only at the surface level

### For Authors

✅ **Do:**

- Respond to all comments
- Ask for clarification
- Explain your reasoning
- Accept feedback graciously
- Make requested changes
- Mark conversations as resolved

❌ **Don't:**

- Take feedback personally
- Argue over minor points
- Ignore comments
- Make unrelated changes
- Force merge without approval

## Automated Checks

Before manual review, ensure automated checks pass:

```bash
# Linting
pnpm lint

# Type checking
pnpm type-check

# Tests
pnpm test

# Formatting
pnpm format:check

# Build
pnpm build
```

## Review Template

```markdown
## Summary

Brief description of what was reviewed

## Functionality

- ✅ Works as intended
- ✅ Edge cases handled

## Code Quality

- ✅ Readable and maintainable
- ✅ Follows conventions

## Security

- ✅ Input validated
- ⚠️ Missing rate limiting on API route (see comments)

## Testing

- ✅ Unit tests included
- ⚠️ Missing integration tests

## Performance

- ✅ No obvious issues

## Accessibility

- ✅ Semantic HTML used
- ✅ ARIA labels present

## Overall Assessment

Looks good overall! A few important items to address:

1. [Priority issue 1]
2. [Priority issue 2]

Nice work on [specific thing done well]!

## Approval

- [ ] Approved pending changes
- [ ] Approved as-is
- [ ] Requires significant changes
```

## Related Prompts

- `refactor.md` - For refactoring suggestions
- `security-review.md` - For security-focused reviews
- `performance.md` - For performance reviews
- `docs.md` - For documentation reviews
