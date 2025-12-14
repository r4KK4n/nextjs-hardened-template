# Copilot Prompt: Code Refactoring

## Context

Improve existing code structure, readability, and maintainability without changing external behavior.

## When to Use

- Code is difficult to understand
- Functions are too large or complex
- Code has duplication
- Code doesn't follow conventions
- Performance can be improved
- Technical debt needs to be addressed

## Steps

1. **Understand Existing Code**
   - Read and comprehend current implementation
   - Identify pain points and issues
   - Check existing tests

2. **Identify Refactoring Opportunities**
   - Complex functions
   - Code duplication
   - Poor naming
   - Tight coupling
   - Missing types

3. **Plan Refactoring**
   - Define clear goals
   - Identify risks
   - Plan incremental changes
   - Ensure tests exist

4. **Apply Refactoring Techniques**
   - Extract functions/components
   - Rename for clarity
   - Simplify conditionals
   - Remove duplication
   - Improve types

5. **Verify Behavior**
   - Run existing tests
   - Add missing tests
   - Manual testing
   - Check edge cases

6. **Clean Up**
   - Remove dead code
   - Update comments
   - Format code
   - Update documentation

## Common Refactoring Patterns

### Extract Function

```typescript
// Before
function processOrder(order: Order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // Apply discount
  if (order.customer.isPremium) {
    total *= 0.9;
  }

  return total;
}

// After
function processOrder(order: Order): number {
  validateOrder(order);
  const subtotal = calculateSubtotal(order.items);
  return applyDiscount(subtotal, order.customer);
}

function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }
}

function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(amount: number, customer: Customer): number {
  return customer.isPremium ? amount * 0.9 : amount;
}
```

### Extract Component

```typescript
// Before
function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <div>
      <div className="user-profile">
        <img src={user?.avatar} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <button>Edit Profile</button>
      </div>

      <div className="user-posts">
        <h3>Recent Posts</h3>
        {posts.map(post => (
          <div key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.excerpt}</p>
            <span>{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// After
function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <div>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
    </div>
  );
}

function UserProfile({ user }: { user: User | null }) {
  if (!user) return null;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button>Edit Profile</button>
    </div>
  );
}

function UserPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="user-posts">
      <h3>Recent Posts</h3>
      {posts.map(post => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostPreview({ post }: { post: Post }) {
  return (
    <div>
      <h4>{post.title}</h4>
      <p>{post.excerpt}</p>
      <span>{post.date}</span>
    </div>
  );
}
```

### Simplify Conditionals

```typescript
// Before
function getShippingCost(order: Order): number {
  if (order.total > 100) {
    if (order.customer.isPremium) {
      return 0;
    } else {
      return 5;
    }
  } else {
    if (order.customer.isPremium) {
      return 5;
    } else {
      return 10;
    }
  }
}

// After
function getShippingCost(order: Order): number {
  const baseShipping = order.total > 100 ? 5 : 10;
  const discount = order.customer.isPremium ? 5 : 0;
  return Math.max(0, baseShipping - discount);
}
```

### Replace Magic Numbers

```typescript
// Before
function calculateDiscount(price: number, quantity: number): number {
  if (quantity >= 10) {
    return price * 0.2;
  } else if (quantity >= 5) {
    return price * 0.1;
  }
  return 0;
}

// After
const BULK_DISCOUNT_THRESHOLD = 10;
const REGULAR_DISCOUNT_THRESHOLD = 5;
const BULK_DISCOUNT_RATE = 0.2;
const REGULAR_DISCOUNT_RATE = 0.1;

function calculateDiscount(price: number, quantity: number): number {
  if (quantity >= BULK_DISCOUNT_THRESHOLD) {
    return price * BULK_DISCOUNT_RATE;
  }
  if (quantity >= REGULAR_DISCOUNT_THRESHOLD) {
    return price * REGULAR_DISCOUNT_RATE;
  }
  return 0;
}
```

### Improve Type Safety

```typescript
// Before
function processData(data: any) {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
}

// After
interface RawData {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface ProcessedData {
  id: string;
  name: string;
  email: string;
}

function processData(data: RawData): ProcessedData {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
}
```

## Do's

✅ Keep changes small and focused
✅ Run tests after each change
✅ Maintain existing behavior
✅ Improve readability
✅ Follow conventions
✅ Add types where missing
✅ Remove dead code
✅ Extract reusable logic
✅ Simplify complex code
✅ Document why, not what

## Don'ts

❌ Change behavior without tests
❌ Make multiple changes at once
❌ Skip testing
❌ Introduce new bugs
❌ Over-engineer solutions
❌ Refactor without understanding
❌ Ignore edge cases
❌ Break existing APIs
❌ Forget to update documentation
❌ Optimize prematurely

## Refactoring Checklist

- [ ] Understand existing code behavior
- [ ] Ensure tests exist and pass
- [ ] Plan refactoring approach
- [ ] Make small, incremental changes
- [ ] Run tests after each change
- [ ] Verify no behavior changes
- [ ] Update documentation
- [ ] Remove dead code
- [ ] Check code style
- [ ] Get code review

## Code Smells to Look For

### Long Method

- **Problem**: Function does too much
- **Solution**: Extract smaller functions

### Large Class/Component

- **Problem**: Too many responsibilities
- **Solution**: Split into smaller pieces

### Duplicated Code

- **Problem**: Same logic in multiple places
- **Solution**: Extract to shared function

### Long Parameter List

- **Problem**: Function takes too many parameters
- **Solution**: Use object parameter or split function

### Primitive Obsession

- **Problem**: Using primitives instead of objects
- **Solution**: Create proper types/interfaces

### Nested Conditionals

- **Problem**: Deep if/else nesting
- **Solution**: Use early returns or guard clauses

### Dead Code

- **Problem**: Unused code
- **Solution**: Remove it

### Comments Explaining Code

- **Problem**: Code needs explanation
- **Solution**: Make code self-explanatory

## Refactoring Techniques

### Extract Method

Break large functions into smaller ones

### Inline Method

Combine overly fragmented functions

### Extract Variable

Give intermediate results meaningful names

### Rename

Use descriptive names

### Extract Class/Component

Split large classes/components

### Move Method/Function

Place code where it belongs

### Replace Conditional with Polymorphism

Use type system instead of conditionals

### Introduce Parameter Object

Group related parameters

### Remove Dead Code

Delete unused code

### Simplify Conditional

Make conditions easier to understand

## Example: Complete Refactoring

```typescript
// Before: Complex, hard to test, mixed concerns
async function handleUserRegistration(req: Request) {
  const body = await req.json();

  if (!body.email || !body.password || !body.name) {
    return new Response('Missing fields', { status: 400 });
  }

  if (body.password.length < 8) {
    return new Response('Password too short', { status: 400 });
  }

  const existingUser = await db.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return new Response('User exists', { status: 409 });
  }

  const hashedPassword = await hash(body.password);

  const user = await db.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      name: body.name,
    },
  });

  await sendWelcomeEmail(user.email);

  return new Response(JSON.stringify(user), { status: 201 });
}

// After: Clean, testable, separated concerns
import { z } from 'zod';

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

type RegistrationData = z.infer<typeof registrationSchema>;

async function handleUserRegistration(req: Request) {
  try {
    const body = await req.json();
    const data = validateRegistrationData(body);

    await checkUserDoesNotExist(data.email);

    const user = await createUser(data);

    await sendWelcomeEmail(user.email);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleRegistrationError(error);
  }
}

function validateRegistrationData(data: unknown): RegistrationData {
  return registrationSchema.parse(data);
}

async function checkUserDoesNotExist(email: string): Promise<void> {
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ValidationError('User already exists');
  }
}

async function createUser(data: RegistrationData) {
  const hashedPassword = await hash(data.password);

  return db.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });
}

function handleRegistrationError(error: unknown): Response {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

## Related Prompts

- `unit-tests.md` - For testing refactored code
- `performance.md` - For performance refactoring
- `code-review.md` - For review after refactoring
