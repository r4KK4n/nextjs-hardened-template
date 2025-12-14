# Security Guidelines

This document outlines security best practices for this project.

## General Guidelines

### Authentication & Authorization

1. **Always verify authentication** before accessing protected resources
2. **Check authorization** before performing actions
3. **Use secure session management**
4. **Implement rate limiting** on authentication endpoints

### Input Validation

1. **Validate all inputs** on the server side
2. **Use Zod schemas** for type-safe validation
3. **Sanitize user content** before rendering
4. **Limit input lengths** to prevent DoS

### Data Protection

1. **Use HTTPS** in production
2. **Encrypt sensitive data** at rest
3. **Never log sensitive information**
4. **Use environment variables** for secrets
5. **Set secure cookie flags**

### API Security

1. **Implement rate limiting**
2. **Validate request origins**
3. **Use CSRF tokens** for state-changing operations
4. **Return appropriate error messages** (no sensitive info)

### XSS Prevention

1. **Escape user content** before rendering
2. **Use Content Security Policy** headers
3. **Avoid dangerouslySetInnerHTML**
4. **Sanitize HTML** if absolutely necessary

### SQL/NoSQL Injection Prevention

1. **Use parameterized queries**
2. **Use ORM/query builders** (Prisma, etc.)
3. **Validate input types**
4. **Limit query complexity**

## Implementation Examples

### Secure API Route

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ratelimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    // Validate input
    const body = await request.json();
    const validated = schema.parse(body);

    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process request
    const result = await processData(validated);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }

    // Don't expose internal errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Secure Password Handling

```typescript
import bcrypt from 'bcrypt';

// Hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Secure Cookie Settings

```typescript
cookies().set('session', sessionId, {
  httpOnly: true,  // Prevent JavaScript access
  secure: process.env.NODE_ENV === 'production',  // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 60 * 60 * 24 * 7,  // 1 week
});
```

## Security Checklist

Use this checklist for code reviews:

### Authentication
- [ ] Password hashing used (bcrypt, argon2)
- [ ] Session tokens are cryptographically secure
- [ ] Sessions expire appropriately
- [ ] Rate limiting on login attempts
- [ ] Account lockout after failed attempts

### Authorization
- [ ] User permissions checked
- [ ] Resource ownership verified
- [ ] Admin-only routes protected
- [ ] API endpoints require auth

### Input Validation
- [ ] All inputs validated on server
- [ ] Type checking enforced
- [ ] Length limits applied
- [ ] Special characters handled
- [ ] File uploads validated

### XSS Prevention
- [ ] User content escaped
- [ ] CSP headers configured
- [ ] No dangerouslySetInnerHTML
- [ ] Proper React rendering

### CSRF Protection
- [ ] CSRF tokens implemented
- [ ] SameSite cookies used
- [ ] Origin headers checked
- [ ] State-changing ops use POST

### Data Protection
- [ ] Sensitive data encrypted
- [ ] HTTPS enforced
- [ ] Secrets in environment vars
- [ ] No secrets in client code
- [ ] Secure cookie flags set

### Error Handling
- [ ] No sensitive info in errors
- [ ] Stack traces hidden in prod
- [ ] Generic error messages
- [ ] Errors logged securely

### Dependencies
- [ ] No known vulnerabilities (pnpm audit)
- [ ] Dependencies up to date
- [ ] Minimal dependencies
- [ ] Trusted sources only

## Reporting Security Issues

**Do NOT open public issues for security vulnerabilities.**

Instead, email: SECURITY_EMAIL@example.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

## Security Tools

### Dependency Scanning
```bash
pnpm audit
pnpm audit fix
```

### ESLint Security
```bash
pnpm add -D eslint-plugin-security
```

### TypeScript
Enable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [React Security](https://react.dev/learn/keeping-components-pure)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Updates

This document should be reviewed and updated:
- Quarterly (minimum)
- When adding new features
- After security incidents
- When dependencies change significantly

Last updated: 2024-01-15
