# GitHub Copilot System Instructions

## Overview

This document defines the global rules and standards for GitHub Copilot when assisting with this Next.js + TypeScript project. All code generation should follow these guidelines.

---

## Core Principles

### 1. Code Quality Standards

- Write clean, maintainable, and self-documenting code
- Follow SOLID principles and DRY (Don't Repeat Yourself)
- Prefer composition over inheritance
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names

### 2. TypeScript Standards

- Always use strict TypeScript typing
- Avoid `any` type; use `unknown` if type is truly unknown
- Define proper interfaces and types for all data structures
- Use type guards for runtime type checking
- Leverage discriminated unions for complex state management

### 3. React Best Practices

- Prefer functional components over class components
- Use hooks appropriately (useState, useEffect, useCallback, useMemo)
- Implement proper error boundaries
- Follow React Server Components patterns (App Router)
- Separate business logic from presentation components

### 4. Next.js Conventions

- Use App Router structure (`/app` directory)
- Implement proper loading and error states
- Use Server Components by default, Client Components when needed
- Follow file-based routing conventions
- Implement proper metadata and SEO

---

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- **Utilities/Libs**: kebab-case (e.g., `format-date.ts`, `api-client.ts`)
- **Routes**: kebab-case (e.g., `user-profile/page.tsx`)
- **Types**: kebab-case (e.g., `user-types.ts`, `api-types.ts`)

### Code Elements

- **Variables/Functions**: camelCase (e.g., `userName`, `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Enums**: PascalCase (e.g., `UserRole`, `HttpStatus`)
- **Private members**: prefix with underscore (e.g., `_handleError`)

### React Specific

- **Component Props**: PascalCase + `Props` suffix (e.g., `ButtonProps`)
- **Hook functions**: prefix with `use` (e.g., `useAuth`, `useFetch`)
- **Event handlers**: prefix with `handle` (e.g., `handleClick`, `handleSubmit`)
- **Boolean props/vars**: prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (routes)/          # Page routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   └── features/         # Feature-specific components
├── lib/                   # Utility functions and helpers
│   ├── utils.ts          # General utilities
│   ├── format.ts         # Formatting functions
│   ├── validation.ts     # Validation logic
│   ├── logger.ts         # Logging utilities
│   └── errors.ts         # Error handling
├── types/                 # TypeScript type definitions
├── styles/                # Global styles and Tailwind config
└── test/                  # Test utilities and setup
```

---

## Definition of Done

Before considering any code complete, ensure:

### Functionality

- [ ] Code works as expected with no known bugs
- [ ] All edge cases are handled
- [ ] Error states are properly managed
- [ ] Loading states are implemented where applicable

### Code Quality

- [ ] TypeScript types are properly defined
- [ ] No `any` types without justification
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting is applied
- [ ] Code is self-documenting with clear naming

### Testing

- [ ] Unit tests are written for business logic
- [ ] Tests pass locally
- [ ] Edge cases are covered in tests
- [ ] Test coverage meets project standards (>80%)

### Documentation

- [ ] Complex logic has explanatory comments
- [ ] Public APIs are documented
- [ ] README is updated if needed
- [ ] Type definitions serve as documentation

### Performance

- [ ] No unnecessary re-renders
- [ ] Proper use of memoization (useMemo, useCallback)
- [ ] Images are optimized
- [ ] Bundle size impact is considered

### Accessibility

- [ ] Semantic HTML is used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards

### Security

- [ ] No sensitive data in client code
- [ ] Input is properly validated
- [ ] XSS vulnerabilities are prevented
- [ ] API routes have proper authentication/authorization
- [ ] No postinstall/prepare scripts that execute arbitrary code
- [ ] Dependencies are from trusted sources only

---

## Supply-Chain Security

### Package Management Rules

- **NEVER use `npm install` in CI** - always use `npm ci --ignore-scripts`
- **NEVER use `pnpm install` in CI** - always use `pnpm install --frozen-lockfile --ignore-scripts`
- **DO NOT add postinstall/install/prepare scripts** that download or execute external code
- **DO NOT trust dependencies blindly** - review new packages before adding
- **ALWAYS pin exact versions** of critical dependencies in package.json

### Lifecycle Scripts Policy

- postinstall/install/preinstall scripts are **disabled by default in CI**
- Scripts that run on install must be:
  - Explicitly documented in docs/npm-scripts-policy.md
  - Reviewed for security implications
  - Enabled only in controlled environments
- The only exception: `prepare` script for Husky (runs locally, not in CI)

### When Adding Dependencies

1. Check package reputation (downloads, maintainers, recent updates)
2. Review package source code if adding privileged operations
3. Verify package doesn't have install scripts that download external resources
4. Document the dependency purpose in the commit message
5. Update lockfile: `pnpm install` (generates pnpm-lock.yaml)

---

## Do's and Don'ts

### ✅ DO

- Use Server Components by default
- Implement proper error boundaries
- Use environment variables for configuration
- Write descriptive commit messages (conventional commits)
- Keep components small and focused
- Use TypeScript utility types (Partial, Pick, Omit, etc.)
- Implement proper loading states
- Handle errors gracefully
- Use Tailwind classes consistently
- Write tests for critical functionality
- Use `npm ci --ignore-scripts` in all CI/CD pipelines
- Review dependencies before adding them to package.json
- Keep lockfiles (pnpm-lock.yaml) committed and up-to-date

### ❌ DON'T

- Use `any` type without good reason
- Ignore TypeScript errors
- Commit console.log statements
- Hardcode sensitive data
- Create deeply nested component structures
- Ignore accessibility
- Skip error handling
- Write overly complex functions
- Mix business logic with UI code
- Forget to handle loading/error states
- Use `npm install` in CI workflows (use `npm ci --ignore-scripts`)
- Add postinstall scripts that download external code
- Install packages without reviewing their install scripts
- Ignore Dependabot security alerts

---

## Code Review Checklist

When reviewing code (or generating code), verify:

1. **Type Safety**: All types are properly defined
2. **Error Handling**: Errors are caught and handled appropriately
3. **Performance**: No obvious performance issues
4. **Security**: No security vulnerabilities
5. **Accessibility**: Basic accessibility requirements met
6. **Testing**: Adequate test coverage
7. **Documentation**: Code is well-documented
8. **Consistency**: Follows project conventions
9. **Simplicity**: Code is as simple as possible
10. **Maintainability**: Easy to understand and modify

---

## Common Patterns

### API Route Pattern

```typescript
export async function GET(request: Request) {
  try {
    // Logic here
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}
```

### Server Component Pattern

```typescript
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Component Pattern

```typescript
'use client';

export function Component({ data }: ComponentProps) {
  const [state, setState] = useState(data);
  // Component logic
  return <div>{/* JSX */}</div>;
}
```

---

## Error Handling Strategy

1. **API Routes**: Always wrap in try-catch, return appropriate status codes
2. **Components**: Use error boundaries for React errors
3. **Async Operations**: Handle promise rejections
4. **User Input**: Validate and sanitize all inputs
5. **External APIs**: Handle network failures gracefully

---

## Performance Guidelines

1. **Images**: Use Next.js Image component
2. **Fonts**: Use Next.js font optimization
3. **Code Splitting**: Use dynamic imports for large components
4. **Memoization**: Use React.memo, useMemo, useCallback appropriately
5. **API Calls**: Implement proper caching strategies

---

## Security Guidelines

1. **Environment Variables**: Use for all sensitive data
2. **Input Validation**: Validate all user input
3. **Authentication**: Implement on both client and server
4. **Authorization**: Check permissions before operations
5. **Headers**: Security headers configured in next.config.ts
6. **Dependencies**: Keep updated, scan for vulnerabilities

---

## Accessibility Requirements

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA**: Add labels where needed
3. **Keyboard Navigation**: All interactive elements accessible
4. **Focus Management**: Proper focus indicators
5. **Color Contrast**: Meet WCAG AA standards
6. **Screen Readers**: Test with screen reader software

---

## Comments and Documentation

### When to Comment

- Complex algorithms or business logic
- Non-obvious decisions or workarounds
- Public API functions
- Regular expressions
- Performance optimizations

### When NOT to Comment

- Obvious code (let the code speak)
- Redundant information
- Outdated information (remove old comments)

### Comment Style

```typescript
/**
 * Brief description of function
 *
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
function example(param1: string): number {
  // Implementation
}
```

---

## Testing Strategy

### Unit Tests

- Test business logic in isolation
- Test utility functions
- Test custom hooks
- Mock external dependencies

### Integration Tests

- Test component interactions
- Test API route handlers
- Test data flow

### Test Naming

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

---

## Version Control

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Testing
- `chore`: Maintenance

---

## Questions to Ask Before Coding

1. Is this the simplest solution?
2. Is it properly typed?
3. Have I handled errors?
4. Is it testable?
5. Is it accessible?
6. Is it performant?
7. Is it secure?
8. Does it follow conventions?

---

## Contact and Resources

- **Project Conventions**: See `/docs/conventions.md`
- **Architecture**: See `/docs/architecture.md`
- **API Documentation**: See `/docs/api.md`
- **Copilot Usage**: See `/docs/copilot-usage.md`
