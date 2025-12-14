# Copilot Prompt: Documentation

## Context

Create clear, comprehensive, and maintainable documentation for code, APIs, and features.

## When to Use

- Documenting new features
- Creating API documentation
- Writing user guides
- Updating README files
- Documenting complex logic

## Types of Documentation

### Code Comments

````typescript
/**
 * Calculates the total price including tax and discounts
 *
 * @param basePrice - The original price before modifications
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param discountPercent - Discount percentage (e.g., 20 for 20% off)
 * @returns The final calculated price
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.1, 20);
 * // Returns: 88 (100 - 20% discount + 10% tax)
 * ```
 */
function calculateTotal(basePrice: number, taxRate: number, discountPercent: number): number {
  const discountAmount = basePrice * (discountPercent / 100);
  const subtotal = basePrice - discountAmount;
  const tax = subtotal * taxRate;
  return subtotal + tax;
}
````

### API Documentation

````typescript
/**
 * GET /api/users/[id]
 *
 * Retrieves a user by their ID
 *
 * @route GET /api/users/:id
 * @access Private
 * @auth Required
 *
 * @param {string} id - User ID (UUID format)
 *
 * @returns {200} User object
 * @returns {401} Unauthorized - No valid session
 * @returns {404} User not found
 * @returns {500} Internal server error
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/users/123e4567-e89b-12d3-a456-426614174000');
 * const user = await response.json();
 * ```
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Implementation
}
````

### Component Documentation

````typescript
/**
 * A reusable button component with multiple variants and sizes
 *
 * @component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // With variant and size
 * <Button variant="primary" size="lg" disabled={isLoading}>
 *   {isLoading ? 'Loading...' : 'Submit'}
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS classes */
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  // Implementation
}
````

## README Structure

```markdown
# Project Name

Brief description of what this project does and who it's for.

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Vitest

## Prerequisites

- Node.js >= 18.17.0
- pnpm >= 8.0.0

## Getting Started

### Installation

\`\`\`bash

# Clone the repository

git clone https://github.com/username/repo-name.git

# Install dependencies

pnpm install

# Copy environment variables

cp .env.example .env

# Run development server

pnpm dev
\`\`\`

### Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Project Structure

\`\`\`
src/
├── app/ # Next.js App Router
├── components/ # React components
├── lib/ # Utility functions
├── types/ # TypeScript types
└── styles/ # Global styles
\`\`\`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm type-check` - Check TypeScript types

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contact

Your Name - [@twitter](https://twitter.com/handle)

Project Link: [https://github.com/username/repo](https://github.com/username/repo)
```

## API Documentation Template

```markdown
# API Documentation

## Authentication

All API endpoints require authentication using JWT tokens.

\`\`\`typescript
headers: {
'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
\`\`\`

## Endpoints

### Get User

Retrieves a user by ID.

**URL**: `/api/users/:id`

**Method**: `GET`

**Auth required**: Yes

**Permissions required**: None

**URL Parameters**:

- `id` (string, required) - User ID

**Success Response**:

- **Code**: 200
- **Content**:
  \`\`\`json
  {
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
  }
  \`\`\`

**Error Responses**:

- **Code**: 401 UNAUTHORIZED
  \`\`\`json
  {
  "error": "Authentication required"
  }
  \`\`\`

- **Code**: 404 NOT FOUND
  \`\`\`json
  {
  "error": "User not found"
  }
  \`\`\`

**Example**:
\`\`\`typescript
const response = await fetch('/api/users/123', {
headers: {
'Authorization': `Bearer ${token}`
}
});
const user = await response.json();
\`\`\`
```

## Architecture Documentation

```markdown
# Architecture

## Overview

This application follows a modular architecture with clear separation of concerns.

## Layers

### Presentation Layer (Components)

- React components in `/src/components`
- Handles UI rendering and user interactions
- Should be pure and reusable when possible

### Application Layer (App Router)

- Pages and routes in `/src/app`
- Server and Client Components
- Route handlers for API endpoints

### Business Logic Layer (Lib)

- Utility functions in `/src/lib`
- Business logic and data transformations
- Independent of framework

### Data Access Layer

- Database queries
- External API calls
- Data validation

## Data Flow

1. User interacts with UI
2. Component calls Server Action or API route
3. Server validates input
4. Business logic processes request
5. Data layer retrieves/updates data
6. Response sent back to client
7. UI updates with new data

## Key Decisions

### Why Next.js App Router?

- Server Components for better performance
- Built-in routing and layouts
- Streaming and Suspense support

### Why Vitest over Jest?

- Faster test execution
- Better ESM support
- Native TypeScript support

### Why Tailwind CSS?

- Utility-first approach
- Consistent design system
- Small bundle size with purging
```

## Do's

✅ Write clear, concise documentation
✅ Include code examples
✅ Keep documentation up to date
✅ Document complex logic
✅ Use proper formatting (Markdown)
✅ Include error scenarios
✅ Document assumptions
✅ Explain WHY, not just WHAT
✅ Use diagrams when helpful
✅ Link to related documentation

## Don'ts

❌ Document obvious code
❌ Write outdated documentation
❌ Use unclear terminology
❌ Skip examples
❌ Over-document simple code
❌ Use vague descriptions
❌ Forget to update docs when code changes
❌ Write documentation for yourself only
❌ Use jargon without explanation
❌ Duplicate information

## JSDoc Tags Reference

```typescript
/**
 * @param {Type} name - Description
 * @returns {Type} Description
 * @throws {ErrorType} Description
 * @example Code example
 * @see Related function or docs
 * @deprecated Use newFunction instead
 * @since Version 2.0.0
 * @todo Future improvements
 * @link https://example.com
 * @internal Private implementation
 */
```

## Markdown Formatting

```markdown
# H1 Title

## H2 Heading

### H3 Subheading

**Bold text**
_Italic text_
`inline code`

- Unordered list item
- Another item

1. Ordered list item
2. Another item

[Link text](https://url.com)

![Alt text](image.url)

> Blockquote

\`\`\`typescript
// Code block
const example = 'value';
\`\`\`

| Column 1 | Column 2 |
| -------- | -------- |
| Value 1  | Value 2  |
```

## Checklist

- [ ] Documentation is clear and concise
- [ ] Code examples are included
- [ ] API endpoints are documented
- [ ] Edge cases are mentioned
- [ ] Error handling is documented
- [ ] Examples are runnable
- [ ] Links are working
- [ ] Formatting is correct
- [ ] Technical terms are explained
- [ ] Documentation is up to date

## Related Prompts

- `nextjs-component.md` - For component documentation
- `api-route.md` - For API documentation
- `code-review.md` - For documentation review
