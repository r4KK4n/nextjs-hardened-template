# Copilot Prompt: API Route

## Context
Create a new API route handler for Next.js App Router following RESTful principles and project conventions.

## When to Use
- Creating new API endpoints
- Implementing CRUD operations
- Building internal APIs

## Steps

1. **Define Route Structure**
   - Choose appropriate HTTP method (GET, POST, PUT, DELETE, PATCH)
   - Define route path and parameters
   - Plan response format

2. **Implement Handler Function**
   - Export async function with method name
   - Accept Request parameter
   - Return NextResponse

3. **Add Input Validation**
   - Validate query parameters
   - Validate request body
   - Use Zod or similar for schema validation

4. **Implement Business Logic**
   - Keep handler thin, delegate to services
   - Use proper error handling
   - Implement proper data access patterns

5. **Handle Errors**
   - Catch all exceptions
   - Return appropriate status codes
   - Provide meaningful error messages

6. **Add Authentication/Authorization**
   - Check user permissions
   - Validate tokens/sessions
   - Return 401/403 when appropriate

7. **Test the Route**
   - Write integration tests
   - Test success and error cases
   - Test edge cases

## Output Format

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const requestSchema = z.object({
  // Define schema
});

export async function METHOD(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    
    // Business logic
    const result = await performOperation(validatedData);
    
    // Return success response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Do's

✅ Use proper HTTP methods
✅ Return appropriate status codes
✅ Validate all inputs
✅ Implement proper error handling
✅ Use TypeScript for type safety
✅ Keep handlers thin
✅ Add authentication/authorization
✅ Use meaningful error messages
✅ Follow RESTful conventions
✅ Write integration tests

## Don'ts

❌ Skip input validation
❌ Return generic error messages
❌ Expose sensitive information in errors
❌ Use wrong HTTP methods
❌ Ignore authentication
❌ Put business logic in route handlers
❌ Forget to handle edge cases
❌ Return inconsistent response formats
❌ Skip error handling
❌ Hardcode sensitive data

## Example

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { NotFoundError, ValidationError } from '@/lib/errors';

// Request schema
const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(120).optional(),
});

/**
 * GET /api/users/[id]
 * Retrieve a user by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Fetch user from database
    const user = await getUserById(userId);
    
    if (!user) {
      throw new NotFoundError('User');
    }
    
    logger.info('User retrieved', { userId });
    
    return NextResponse.json(user);
  } catch (error) {
    logger.error('Failed to get user', error);
    
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }
    
    // Create user
    const newUser = await createUser(validatedData);
    
    logger.info('User created', { userId: newUser.id });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    logger.error('Failed to create user', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update a user
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const validatedData = createUserSchema.partial().parse(body);
    
    // Update user
    const updatedUser = await updateUser(userId, validatedData);
    
    if (!updatedUser) {
      throw new NotFoundError('User');
    }
    
    logger.info('User updated', { userId });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error('Failed to update user', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    await deleteUser(userId);
    
    logger.info('User deleted', { userId });
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Failed to delete user', error);
    
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Service functions (would be in separate file)
async function getUserById(id: string) {
  // Implementation
}

async function getUserByEmail(email: string) {
  // Implementation
}

async function createUser(data: z.infer<typeof createUserSchema>) {
  // Implementation
}

async function updateUser(id: string, data: Partial<z.infer<typeof createUserSchema>>) {
  // Implementation
}

async function deleteUser(id: string) {
  // Implementation
}
```

## Checklist

- [ ] HTTP method is appropriate
- [ ] Input validation is implemented
- [ ] Error handling is comprehensive
- [ ] Status codes are correct
- [ ] Authentication is checked
- [ ] Authorization is verified
- [ ] Logging is added
- [ ] Tests are written
- [ ] Response format is consistent
- [ ] Edge cases are handled

## Related Prompts
- `server-action.md` - For Server Actions
- `data-access.md` - For database operations
- `unit-tests.md` - For testing routes
