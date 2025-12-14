# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Do NOT:

- Open a public issue
- Disclose the vulnerability publicly until it has been addressed

### DO:

1. **Email us directly** at: SECURITY_EMAIL@example.com
2. Include:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Any suggested fixes (if available)

### What to Expect:

- **Initial Response**: Within 48 hours
- **Status Updates**: Every 7 days until resolved
- **Resolution Time**: Varies based on severity and complexity

### Severity Levels:

- **Critical**: Response within 24 hours, patch within 7 days
- **High**: Response within 48 hours, patch within 14 days
- **Medium**: Response within 72 hours, patch within 30 days
- **Low**: Response within 1 week, patch in next release

## Security Best Practices

When using this template:

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for documentation
   - Rotate secrets regularly

2. **Dependencies**
   - Keep dependencies up to date
   - Enable Dependabot alerts
   - Review security advisories

3. **Authentication**
   - Use strong password policies
   - Implement rate limiting
   - Enable 2FA where possible

4. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS in production
   - Implement proper CORS policies

5. **Code Review**
   - Require reviews for all PRs
   - Run security linters
   - Perform regular security audits

## Security Features in Template

This template includes:

- Security headers in `next.config.ts`
- ESLint security rules
- Dependabot configuration
- GitHub Actions security scanning
- Input validation examples

## Disclosure Policy

Once a vulnerability is fixed:

1. We will notify reporters
2. Release a security patch
3. Publish a security advisory
4. Update this policy if needed

## Contact

For security concerns: SECURITY_EMAIL@example.com

For general issues: Use GitHub Issues
