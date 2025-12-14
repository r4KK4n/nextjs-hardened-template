# PROJECT_NAME

> A modern, production-ready Next.js + TypeScript template with comprehensive tooling, GitHub automation, and GitHub Copilot integration.

[![CI](https://github.com/USERNAME/REPO_NAME/workflows/CI/badge.svg)](https://github.com/USERNAME/REPO_NAME/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- ⚡ **Next.js 15** - App Router with Server Components
- 🔷 **TypeScript** - Strict mode enabled, full type safety
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧪 **Vitest** - Fast unit testing with React Testing Library
- 📏 **ESLint + Prettier** - Code quality and formatting
- 🐶 **Husky + lint-staged** - Git hooks for quality gates
- 🤖 **GitHub Actions** - Automated CI/CD pipeline
- 🔒 **Security** - Headers, input validation, and best practices
- 📝 **GitHub Copilot System** - Comprehensive prompt library
- 📚 **Documentation** - Architecture, conventions, and guides
- 🎯 **VS Code** - Optimized settings and extensions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.17.0
- **pnpm** >= 8.0.0 (recommended) or npm

```bash
# Check versions
node --version
pnpm --version

# Install pnpm if needed
npm install -g pnpm
```

## 🎯 First-Time Setup

### For Template Users (First Time Only)

If you're using this as a template for a new project:

```bash
# 1. Initialize the template (replaces placeholders)
npm run template:init

# 2. Install dependencies
npm ci

# 3. Verify initialization
npm run template:check

# 4. Set up GitHub secrets (see docs/secrets.md)
#    Go to: Repository Settings → Secrets and variables → Actions
#    Add: CODECOV_TOKEN, etc.

# 5. Start development
npm run dev
```

**What does `template:init` do?**
- Replaces `__PROJECT_NAME__`, `__AUTHOR__`, and other placeholders
- Creates `.env.local` from `.env.example`
- Detects defaults from git and file system
- Interactive prompts for project details

**See:** `.template/PLACEHOLDERS.md` for all placeholders and `docs/secrets.md` for GitHub secrets.

---

## 🚀 Quick Start

### 1. Use This Template

Click the "Use this template" button on GitHub or:

```bash
# Clone the repository
git clone https://github.com/USERNAME/REPO_NAME.git my-project
cd my-project

# Remove git history (start fresh)
rm -rf .git
git init
```

### 2. Customize the Template

Replace placeholders throughout the project:

- `PROJECT_NAME` → Your project name
- `DESCRIPTION` → Your project description
- `AUTHOR` → Your name or organization
- `USERNAME/REPO_NAME` → Your GitHub username and repo name
- `YOUR_DOMAIN` → Your domain name
- Email addresses in security and contact sections

**Key files to update:**
- `package.json` - name, description, author
- `README.md` - this file
- `LICENSE` - copyright holder
- `.github/CODEOWNERS` - team members
- `.github/ISSUE_TEMPLATE/*.yml` - assignees
- `.github/SECURITY.md` - security contact
- `public/robots.txt` - sitemap URL

### 3. Install Dependencies

```bash
# Local development (recommended - executes prepare scripts for git hooks)
pnpm install

# Alternative: Maximum security (skips all lifecycle scripts)
pnpm install --ignore-scripts
# Note: If using --ignore-scripts, manually run: pnpm prepare
```

**⚠️ Supply-Chain Security Note:**
- In CI/CD environments, always use `--ignore-scripts` to prevent malicious postinstall scripts
- For local development, review `package.json` scripts before first install
- See [docs/npm-scripts-policy.md](./docs/npm-scripts-policy.md) for details

### 4. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
```

### 5. Set Up Git Hooks

```bash
# Initialize Husky
pnpm prepare
```

### 6. Start Development

```bash
# Run development server
pnpm dev

# Open http://localhost:3000
```

## 📦 Project Structure

```
├── .github/                    # GitHub configuration
│   ├── copilot/               # Copilot prompt system
│   │   ├── system.md          # Global instructions
│   │   └── prompts/           # Task-specific prompts
│   ├── workflows/             # GitHub Actions
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   ├── CODEOWNERS             # Code ownership
│   ├── pull_request_template.md
│   └── SECURITY.md
├── .husky/                     # Git hooks
├── .vscode/                    # VS Code settings
├── docs/                       # Documentation
│   ├── architecture.md        # System architecture
│   ├── conventions.md         # Coding conventions
│   └── copilot-usage.md       # Copilot guide
├── public/                     # Static files
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── error.tsx         # Error boundary
│   │   ├── loading.tsx       # Loading UI
│   │   └── not-found.tsx     # 404 page
│   ├── components/            # React components
│   │   ├── ui/               # Basic UI components
│   │   └── index.ts          # Barrel exports
│   ├── lib/                   # Utilities and helpers
│   │   ├── constants.ts      # Constants
│   │   ├── errors.ts         # Error classes
│   │   ├── format.ts         # Formatting functions
│   │   ├── logger.ts         # Logging utility
│   │   ├── utils.ts          # General utilities
│   │   └── validation.ts     # Validation schemas
│   ├── styles/                # Global styles
│   │   └── globals.css       # Tailwind imports
│   ├── test/                  # Test setup
│   │   └── setup.ts          # Test configuration
│   └── types/                 # TypeScript types
│       ├── index.ts          # Common types
│       └── env.d.ts          # Environment types
├── .editorconfig              # Editor configuration
├── .env.example               # Environment template
├── .eslintrc.json            # ESLint configuration
├── .gitattributes            # Git attributes
├── .gitignore                # Git ignore rules
├── .lintstagedrc.json        # Lint-staged config
├── .prettierrc.json          # Prettier configuration
├── LICENSE                    # License file
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Vitest configuration
```

## 🛠️ Available Scripts

> **Security Note:** See [npm Scripts Policy](./docs/npm-scripts-policy.md) for supply-chain security guidelines.

```bash
# Development
pnpm dev              # Start development server (http://localhost:3000)

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm type-check       # Check TypeScript types

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report

# Complete Check
pnpm ci               # Run all checks (lint + type-check + test)
```

## 🧪 Testing

This template uses Vitest and React Testing Library for testing.

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

See [`docs/copilot-usage.md`](./docs/copilot-usage.md) for testing with Copilot.

## 🤖 GitHub Copilot Integration

This template includes a comprehensive Copilot prompt system to help you write better code faster.

### Global Instructions

The `.github/copilot/system.md` file contains global guidelines that Copilot reads automatically.

### Task-Specific Prompts

Located in `.github/copilot/prompts/`:

- **nextjs-component.md** - Creating React components
- **api-route.md** - Creating API endpoints
- **server-action.md** - Creating Server Actions
- **data-access.md** - Database operations
- **unit-tests.md** - Writing tests
- **refactor.md** - Refactoring code
- **bugfix.md** - Fixing bugs
- **performance.md** - Performance optimization
- **security-review.md** - Security review
- **docs.md** - Writing documentation
- **code-review.md** - Code review guidelines

### Usage Example

```typescript
// @copilot: Using nextjs-component.md, create a Modal component with:
// - Controlled visibility
// - Overlay backdrop
// - Close button
// - Keyboard support (ESC key)
```

📖 **Full Guide**: See [`docs/copilot-usage.md`](./docs/copilot-usage.md)

## 📚 Documentation

- **[Architecture](./docs/architecture.md)** - System design and patterns
- **[Conventions](./docs/conventions.md)** - Coding standards and naming
- **[Copilot Usage](./docs/copilot-usage.md)** - How to use Copilot prompts

## 🔒 Security

### Security Headers

Configured in `next.config.ts`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Content-Security-Policy

### Environment Variables

Never commit secrets. Use environment variables:

```bash
# .env (gitignored)
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret_key_here
```

### Reporting Vulnerabilities

See [SECURITY.md](./.github/SECURITY.md) for our security policy.

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment Variables for Production

Set these in your deployment platform:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Database URLs
- API keys and secrets

## 🔧 Customization

### Adding Dependencies

```bash
# Add a package
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name
```

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update

# Update interactive
pnpm up -i
```

### Modifying Tailwind

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#...',
          // ...
        },
      },
    },
  },
};
```

### Adding Database

Example with Prisma:

```bash
# Install Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
npx prisma init

# Create schema in prisma/schema.prisma
# Run migrations
npx prisma migrate dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): format code
refactor(scope): refactor code
test(scope): add tests
chore(scope): update build tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vitest](https://vitest.dev/) - Fast unit testing
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [GitHub Copilot](https://github.com/features/copilot) - AI pair programmer

## 📞 Support

- 📧 Email: SUPPORT_EMAIL@example.com
- 💬 Discussions: [GitHub Discussions](https://github.com/USERNAME/REPO_NAME/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/USERNAME/REPO_NAME/issues)

---

**Built with ❤️ using Next.js + TypeScript**

⭐ If you find this template useful, please consider giving it a star!
