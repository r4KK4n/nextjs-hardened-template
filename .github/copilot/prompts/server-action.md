# Copilot Prompt: Server Action

## Context
Create a Server Action for Next.js App Router to handle form submissions and mutations directly from components.

## When to Use
- Handling form submissions
- Performing mutations from client components
- Progressive enhancement scenarios

## Steps

1. **Create Server Action File**
   - Create file with 'use server' directive
   - Export async functions
   - Place in `/app/actions/` or colocate with route

2. **Define Action Function**
   - Accept FormData or typed parameters
   - Validate inputs
   - Perform mutations

3. **Add Validation**
   - Use Zod for schema validation
   - Return validation errors
   - Handle edge cases

4. **Implement Business Logic**
   - Call database or external APIs
   - Handle transactions properly
   - Implement proper error handling

5. **Return Results**
   - Return success/error state
   - Include relevant data or messages
   - Use consistent response format

6. **Revalidate Cache**
   - Use revalidatePath or revalidateTag
   - Clear relevant caches
   - Update UI state

## Output Format

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  // Define schema
});

type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function actionName(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Validate input
    const validatedFields = schema.safeParse({
      field: formData.get('field'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Perform mutation
    await performMutation(validatedFields.data);

    // Revalidate
    revalidatePath('/path');

    return {
      success: true,
      message: 'Success message',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error message',
    };
  }
}
```

## Do's

✅ Use 'use server' directive
✅ Validate all inputs
✅ Return consistent response format
✅ Revalidate caches appropriately
✅ Handle errors gracefully
✅ Use TypeScript for type safety
✅ Keep actions focused
✅ Add authentication checks
✅ Log important operations
✅ Write tests for actions

## Don'ts

❌ Skip input validation
❌ Expose sensitive data
❌ Forget to revalidate caches
❌ Return inconsistent formats
❌ Ignore authentication
❌ Mix business logic with validation
❌ Use actions for data fetching (use RSC)
❌ Forget error handling
❌ Make actions too complex
❌ Skip logging

## Example

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { getServerSession } from '@/lib/auth';

// Validation schema
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  published: z.boolean().optional(),
});

// Action state type
type CreatePostState = {
  success: boolean;
  message?: string;
  errors?: {
    title?: string[];
    content?: string[];
    published?: string[];
  };
  data?: {
    id: string;
    slug: string;
  };
};

/**
 * Server action to create a new blog post
 */
export async function createPost(
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: 'You must be logged in to create a post',
      };
    }

    // Extract and validate form data
    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      published: formData.get('published') === 'true',
    };

    const validatedFields = createPostSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed',
      };
    }

    const { title, content, published } = validatedFields.data;

    // Create post in database
    const post = await db.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId: session.user.id,
        slug: generateSlug(title),
      },
    });

    logger.info('Post created', {
      postId: post.id,
      userId: session.user.id,
    });

    // Revalidate relevant paths
    revalidatePath('/blog');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Post created successfully',
      data: {
        id: post.id,
        slug: post.slug,
      },
    };
  } catch (error) {
    logger.error('Failed to create post', error);
    
    return {
      success: false,
      message: 'Failed to create post. Please try again.',
    };
  }
}

/**
 * Server action to update a post
 */
export async function updatePost(
  postId: string,
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    // Validate input
    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      published: formData.get('published') === 'true',
    };

    const validatedFields = createPostSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Check authorization
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== session.user.id) {
      return {
        success: false,
        message: 'Post not found or unauthorized',
      };
    }

    // Update post
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: validatedFields.data,
    });

    logger.info('Post updated', { postId });

    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Post updated successfully',
    };
  } catch (error) {
    logger.error('Failed to update post', error);
    
    return {
      success: false,
      message: 'Failed to update post',
    };
  }
}

/**
 * Server action to delete a post
 */
export async function deletePost(postId: string): Promise<CreatePostState> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    // Check authorization
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== session.user.id) {
      return {
        success: false,
        message: 'Post not found or unauthorized',
      };
    }

    // Delete post
    await db.post.delete({
      where: { id: postId },
    });

    logger.info('Post deleted', { postId });

    revalidatePath('/blog');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  } catch (error) {
    logger.error('Failed to delete post', error);
    
    return {
      success: false,
      message: 'Failed to delete post',
    };
  }
}

// Helper function
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

## Usage in Component

```typescript
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, {
    success: false,
  });

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
        {state.errors?.title && (
          <p className="text-red-500">{state.errors.title[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" required />
        {state.errors?.content && (
          <p className="text-red-500">{state.errors.content[0]}</p>
        )}
      </div>
      
      <div>
        <label>
          <input type="checkbox" name="published" value="true" />
          Publish immediately
        </label>
      </div>
      
      <SubmitButton />
      
      {state.message && (
        <p className={state.success ? 'text-green-500' : 'text-red-500'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

## Checklist

- [ ] 'use server' directive is present
- [ ] Input validation is implemented
- [ ] Authentication is checked
- [ ] Authorization is verified
- [ ] Errors are handled properly
- [ ] Cache is revalidated
- [ ] Logging is added
- [ ] Response format is consistent
- [ ] TypeScript types are defined
- [ ] Tests are written

## Related Prompts
- `api-route.md` - For API endpoints
- `data-access.md` - For database operations
- `nextjs-component.md` - For components using actions
