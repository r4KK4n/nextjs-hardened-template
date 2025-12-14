# Copilot Prompt: Next.js Component

## Context

Create a new React component for the Next.js application following project standards and best practices.

## When to Use

- Creating new UI components
- Building reusable component libraries
- Implementing feature-specific components

## Steps

1. **Determine Component Type**
   - Server Component (default) or Client Component
   - Standalone or composite component
   - Stateful or stateless

2. **Define Props Interface**
   - Create TypeScript interface for props
   - Use descriptive names with `Props` suffix
   - Include JSDoc comments for complex props

3. **Implement Component Structure**
   - Use functional component syntax
   - Add 'use client' directive if needed
   - Implement proper TypeScript typing

4. **Add Styling**
   - Use Tailwind CSS utility classes
   - Keep styles consistent with design system
   - Ensure responsive design

5. **Handle States and Events**
   - Use appropriate React hooks
   - Implement proper event handlers
   - Add loading/error states if needed

6. **Add Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation

7. **Create Tests**
   - Write unit tests for component logic
   - Test different prop combinations
   - Test user interactions

## Output Format

````typescript
import { ReactNode } from 'react';

interface ComponentNameProps {
  /**
   * Description of prop
   */
  propName: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Component description
 *
 * @example
 * ```tsx
 * <ComponentName propName="value">
 *   Content
 * </ComponentName>
 * ```
 */
export function ComponentName({
  propName,
  children,
  className = '',
}: ComponentNameProps) {
  // Component logic

  return (
    <div className={`base-styles ${className}`}>
      {children}
    </div>
  );
}
````

## Do's

✅ Use functional components
✅ Define proper TypeScript interfaces
✅ Add JSDoc documentation
✅ Use semantic HTML elements
✅ Implement proper error handling
✅ Make components reusable
✅ Keep components focused and small
✅ Use Tailwind CSS consistently
✅ Add accessibility attributes
✅ Write tests for components

## Don'ts

❌ Use class components
❌ Use `any` type for props
❌ Hardcode values that should be props
❌ Create overly complex components
❌ Mix business logic with presentation
❌ Ignore accessibility
❌ Forget to handle edge cases
❌ Skip prop validation
❌ Use inline styles unnecessarily
❌ Create deeply nested structures

## Example

````typescript
import { ReactNode } from 'react';

interface AlertProps {
  /**
   * Alert variant determines the visual style
   */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /**
   * Alert title (optional)
   */
  title?: string;
  /**
   * Alert content
   */
  children: ReactNode;
  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Alert component for displaying notifications and messages
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success">
 *   Your changes have been saved.
 * </Alert>
 * ```
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}: AlertProps) {
  const variantStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    error: 'bg-red-50 text-red-900 border-red-200',
  };

  return (
    <div
      className={`rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <h3 className="mb-1 font-semibold">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 hover:opacity-70"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
````

## Checklist

- [ ] Component follows naming conventions
- [ ] Props interface is properly defined
- [ ] TypeScript types are strict
- [ ] Component is properly documented
- [ ] Accessibility is implemented
- [ ] Responsive design is considered
- [ ] Error states are handled
- [ ] Tests are written
- [ ] Code follows style guide
- [ ] Component is reusable

## Related Prompts

- `api-route.md` - For API endpoints
- `unit-tests.md` - For testing components
- `refactor.md` - For improving existing components
