# Copilot Prompt: Security Review

## Context
Review code for security vulnerabilities and implement security best practices.

## When to Use
- Before deploying to production
- After implementing authentication
- When handling sensitive data
- After adding new API endpoints
- Regular security audits

## Security Checklist

### Authentication & Authorization
- [ ] Authentication is required for protected routes
- [ ] Authorization checks are in place
- [ ] Session tokens are secure
- [ ] Password requirements are enforced
- [ ] Password hashing is used (never plain text)
- [ ] Multi-factor authentication is available
- [ ] Account lockout after failed attempts

### Input Validation
- [ ] All user inputs are validated
- [ ] Type checking is enforced
- [ ] Input length is restricted
- [ ] Special characters are handled
- [ ] File uploads are validated
- [ ] SQL injection is prevented
- [ ] NoSQL injection is prevented

### XSS Prevention
- [ ] User content is sanitized
- [ ] Output is properly escaped
- [ ] innerHTML is avoided
- [ ] CSP headers are set
- [ ] Dangerous HTML is stripped

### CSRF Protection
- [ ] CSRF tokens are implemented
- [ ] SameSite cookie attribute is set
- [ ] Origin headers are checked
- [ ] State-changing operations require POST

### API Security
- [ ] Rate limiting is implemented
- [ ] API keys are secured
- [ ] CORS is properly configured
- [ ] Request size limits are set
- [ ] Authentication is required
- [ ] Input is validated

### Data Protection
- [ ] Sensitive data is encrypted
- [ ] HTTPS is enforced
- [ ] Secrets are not in code
- [ ] Environment variables are used
- [ ] Database credentials are secured
- [ ] Personal data is protected (GDPR)

### Error Handling
- [ ] Errors don't expose sensitive info
- [ ] Stack traces are hidden in production
- [ ] Generic error messages for users
- [ ] Errors are logged securely

## Common Vulnerabilities

### SQL Injection

```typescript
// ❌ Vulnerable
async function getUser(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return db.query(query);
}

// ✅ Secure
async function getUser(email: string) {
  return db.user.findUnique({
    where: { email }
  });
}
```

### XSS (Cross-Site Scripting)

```typescript
// ❌ Vulnerable
function UserComment({ comment }: { comment: string }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}

// ✅ Secure
import DOMPurify from 'isomorphic-dompurify';

function UserComment({ comment }: { comment: string }) {
  const sanitized = DOMPurify.sanitize(comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ Better: Avoid dangerouslySetInnerHTML
function UserComment({ comment }: { comment: string }) {
  return <div>{comment}</div>;
}
```

### CSRF (Cross-Site Request Forgery)

```typescript
// ❌ Vulnerable: No CSRF protection
export async function POST(request: Request) {
  const data = await request.json();
  await performAction(data);
  return NextResponse.json({ success: true });
}

// ✅ Secure: Verify origin
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (origin !== `https://${host}`) {
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403 }
    );
  }
  
  const data = await request.json();
  await performAction(data);
  return NextResponse.json({ success: true });
}
```

### Insecure Direct Object Reference

```typescript
// ❌ Vulnerable: No authorization check
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const document = await db.document.findUnique({
    where: { id: params.id }
  });
  
  return NextResponse.json(document);
}

// ✅ Secure: Check ownership
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const document = await db.document.findUnique({
    where: { id: params.id }
  });
  
  if (!document || document.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(document);
}
```

### Sensitive Data Exposure

```typescript
// ❌ Vulnerable: Exposes sensitive data
export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users); // Includes passwords!
}

// ✅ Secure: Exclude sensitive fields
export async function GET() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      // password and other sensitive fields excluded
    }
  });
  
  return NextResponse.json(users);
}
```

### Weak Password Storage

```typescript
// ❌ Vulnerable: Plain text passwords
async function createUser(email: string, password: string) {
  await db.user.create({
    data: { email, password }
  });
}

// ✅ Secure: Hashed passwords
import bcrypt from 'bcrypt';

async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });
}

async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

## Security Headers

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
};
```

## Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }
  
  // Process request
}
```

## Input Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  name: z.string().min(1).max(100).trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = userSchema.parse(body);
    
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
  }
}
```

## File Upload Security

```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    );
  }
  
  // Check file size
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: 'File too large' },
      { status: 400 }
    );
  }
  
  // Check file content (magic bytes)
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Verify it's actually an image
  if (!isValidImageFile(bytes)) {
    return NextResponse.json(
      { error: 'Invalid file content' },
      { status: 400 }
    );
  }
  
  // Process file
}

function isValidImageFile(bytes: Uint8Array): boolean {
  // Check magic bytes for JPEG
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return true;
  }
  
  // Check magic bytes for PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E) {
    return true;
  }
  
  return false;
}
```

## Environment Variables

```typescript
// ❌ Vulnerable: Exposed in client code
const API_KEY = 'sk_live_abc123';

// ✅ Secure: Server-side only
const API_KEY = process.env.API_SECRET_KEY;

// For client-side (public data only)
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
```

## Secure Cookie Settings

```typescript
import { cookies } from 'next/headers';

export async function login(sessionId: string) {
  cookies().set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}
```

## Security Tools

### Dependency Scanning
```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit fix
```

### Static Analysis
```bash
# ESLint security plugin
pnpm add -D eslint-plugin-security

# Run security linter
pnpm eslint --plugin security
```

## Do's

✅ Always validate input
✅ Use prepared statements
✅ Hash passwords
✅ Implement authentication
✅ Check authorization
✅ Use HTTPS in production
✅ Set security headers
✅ Sanitize user content
✅ Log security events
✅ Keep dependencies updated

## Don'ts

❌ Trust user input
❌ Store plain text passwords
❌ Expose sensitive data
❌ Skip authorization checks
❌ Use eval() or Function()
❌ Disable security features
❌ Ignore security warnings
❌ Hardcode secrets
❌ Use weak encryption
❌ Forget error handling

## Related Prompts
- `api-route.md` - For secure API implementation
- `code-review.md` - For security code reviews
- `bugfix.md` - For security-related bugs
