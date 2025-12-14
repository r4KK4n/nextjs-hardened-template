# How to Use GitHub Copilot Prompts

This guide explains how to effectively use the Copilot prompt system in this repository.

## Overview

The `.github/copilot/` directory contains a comprehensive prompt system designed to help GitHub Copilot generate better, more consistent code for this project.

## System File

### `.github/copilot/system.md`

This is the global instruction file that Copilot reads automatically. It contains:

- Project conventions and standards
- Naming conventions
- Code quality guidelines
- Definition of Done
- Do's and Don'ts

You don't need to reference this file explicitly - Copilot reads it automatically.

## Prompt Files

The `.github/copilot/prompts/` directory contains task-specific prompts:

- `nextjs-component.md` - Creating React components
- `api-route.md` - Creating API endpoints
- `server-action.md` - Creating Server Actions
- `data-access.md` - Database and data operations
- `unit-tests.md` - Writing tests
- `refactor.md` - Refactoring code
- `bugfix.md` - Fixing bugs
- `performance.md` - Performance optimization
- `security-review.md` - Security review
- `docs.md` - Writing documentation
- `code-review.md` - Code review guidelines

## How to Reference Prompts

### Method 1: In Code Comments

Reference prompts directly in your code using comments:

```typescript
// @copilot: Use the nextjs-component.md prompt to create a Button component
// that supports primary, secondary, and outline variants
```

```typescript
// @copilot: Follow api-route.md to create a GET endpoint for fetching user posts
// Include pagination and filtering
```

### Method 2: In Chat

When using GitHub Copilot Chat, reference prompts explicitly:

```
@workspace Using the patterns from .github/copilot/prompts/nextjs-component.md,
create a Card component with title, content, and optional footer
```

```
@workspace Following .github/copilot/prompts/api-route.md, create an API route
for updating user profiles with proper validation
```

### Method 3: In Commit Messages or PR Descriptions

```
feat: add user profile component

Created following nextjs-component.md guidelines:
- TypeScript interfaces defined
- Accessibility implemented
- Tests included
```

## Common Workflows

### Creating a New Component

1. Reference the component prompt in a comment:

```typescript
// @copilot: Create a Modal component using nextjs-component.md
// Requirements:
// - Controlled visibility
// - Overlay backdrop
// - Close button
// - Keyboard support (ESC key)
```

2. Let Copilot generate the component structure
3. Review and refine

### Creating an API Endpoint

1. Create the file `src/app/api/your-endpoint/route.ts`
2. Add a comment:

```typescript
// @copilot: Using api-route.md, create a POST endpoint for creating blog posts
// - Validate title (1-100 chars)
// - Validate content (min 10 chars)
// - Check authentication
// - Return created post
```

3. Let Copilot generate the implementation
4. Verify all error cases are handled

### Writing Tests

1. Create test file alongside your code
2. Reference the test prompt:

```typescript
// @copilot: Following unit-tests.md, create tests for the Button component
// Test cases:
// - Renders with children
// - Calls onClick handler
// - Applies variant styles correctly
// - Disabled state works
```

3. Review generated tests for completeness

### Refactoring

1. Select the code to refactor
2. Open Copilot Chat
3. Use the refactor prompt:

```
@workspace Using refactor.md patterns, improve this code by:
- Extracting reusable functions
- Improving type safety
- Reducing complexity

[paste code]
```

### Security Review

1. Open Copilot Chat
2. Reference the security prompt:

```
@workspace Using security-review.md, review this API endpoint for
security issues:
- Input validation
- Authentication
- Authorization
- XSS prevention
- SQL injection

[paste code]
```

## Best Practices

### Be Specific

❌ Bad:

```typescript
// @copilot: Create a form
```

✅ Good:

```typescript
// @copilot: Using nextjs-component.md, create a contact form with:
// - Name field (required, 1-100 chars)
// - Email field (required, valid email)
// - Message field (required, min 10 chars)
// - Submit button with loading state
// - Form validation using Zod
// - Error display for each field
```

### Provide Context

❌ Bad:

```typescript
// @copilot: Make this faster
```

✅ Good:

```typescript
// @copilot: Using performance.md, optimize this component:
// Current issue: Re-renders on every parent update
// Data: Array of 1000+ items
// Expected: Only re-render when items change
```

### Reference Multiple Prompts

```typescript
// @copilot: Create an authenticated API endpoint (api-route.md)
// with proper data access patterns (data-access.md) and
// comprehensive tests (unit-tests.md)
```

## Prompt Categories

### Creation Prompts

Use when building new features:

- `nextjs-component.md`
- `api-route.md`
- `server-action.md`
- `data-access.md`

### Quality Prompts

Use when improving existing code:

- `refactor.md`
- `performance.md`
- `security-review.md`
- `code-review.md`

### Testing Prompts

Use when writing tests:

- `unit-tests.md`

### Maintenance Prompts

Use for ongoing work:

- `bugfix.md`
- `docs.md`

## Examples by Feature

### Building a Blog Feature

1. **Data Layer**

```typescript
// @copilot: Using data-access.md, create a PostRepository with:
// - findById(id)
// - findAll(page, limit)
// - create(data)
// - update(id, data)
// - delete(id)
```

2. **API Routes**

```typescript
// @copilot: Following api-route.md, create CRUD endpoints for blog posts
// GET /api/posts - List posts with pagination
// GET /api/posts/[id] - Get single post
// POST /api/posts - Create post (auth required)
// PUT /api/posts/[id] - Update post (auth required)
// DELETE /api/posts/[id] - Delete post (auth required)
```

3. **Components**

```typescript
// @copilot: Using nextjs-component.md, create:
// - PostList component (displays array of posts)
// - PostCard component (single post preview)
// - PostForm component (create/edit form)
```

4. **Tests**

```typescript
// @copilot: Following unit-tests.md, test PostRepository:
// - CRUD operations
// - Pagination
// - Error handling
// - Edge cases (empty results, invalid IDs)
```

## Tips for Success

1. **Start with System Understanding**
   - Read `system.md` to understand project conventions
   - Follow established patterns

2. **Use Appropriate Prompts**
   - Match prompt to task type
   - Reference multiple prompts when needed

3. **Be Specific in Comments**
   - Include requirements
   - Specify edge cases
   - Mention constraints

4. **Review Generated Code**
   - Verify it follows conventions
   - Check error handling
   - Ensure tests are included

5. **Iterate and Refine**
   - Start with basic implementation
   - Use refactor.md to improve
   - Add tests after implementation

## Troubleshooting

### Copilot Not Following Conventions

Try being more explicit:

```typescript
// @copilot: IMPORTANT - Follow ALL conventions from system.md
// Specifically:
// - PascalCase for component names
// - Props interface with Props suffix
// - Tailwind for styling
// - TypeScript strict mode
```

### Generated Code Missing Tests

Explicitly request tests:

```typescript
// @copilot: Create MyComponent following nextjs-component.md
// MUST INCLUDE: Unit tests as shown in unit-tests.md
```

### Security Concerns

Always run security review:

```
@workspace Use security-review.md to audit this code
for common vulnerabilities before I commit it.
```

## Integration with Workflow

### Before Coding

1. Review relevant prompt files
2. Understand patterns and conventions
3. Plan your approach

### During Coding

1. Reference prompts in comments
2. Let Copilot suggest implementations
3. Review and refine suggestions

### After Coding

1. Use code-review.md for self-review
2. Run security-review.md checks
3. Ensure tests are included
4. Update documentation

### During Review

1. Share prompt files with reviewers
2. Reference conventions in PR descriptions
3. Use code-review.md guidelines

## Advanced Usage

### Custom Prompts

Create project-specific prompts in the same directory:

```markdown
<!-- .github/copilot/prompts/feature-x.md -->

# Copilot Prompt: Feature X Implementation

## Context

[Your specific feature context]

## Pattern

[Your established pattern]

## Example

[Your example code]
```

### Chaining Prompts

```typescript
// @copilot: Multi-step task:
// 1. Create data model (data-access.md)
// 2. Create API routes (api-route.md)
// 3. Create React component (nextjs-component.md)
// 4. Add tests (unit-tests.md)
// All following conventions from system.md
```

## Resources

- **Global Instructions**: `.github/copilot/system.md`
- **All Prompts**: `.github/copilot/prompts/`
- **Project Docs**: `/docs/`
- **Examples**: Look at existing code in `/src/`

## Feedback

If you find prompts that need improvement:

1. Open an issue describing the problem
2. Suggest improvements
3. Update prompt files in your PR

---

Remember: These prompts are guides, not rules. Use your judgment and adapt as needed for your specific use case.
