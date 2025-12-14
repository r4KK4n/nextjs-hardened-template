# 🔒 Next.js Hardened Template

> A modern, production-ready Next.js 15 + TypeScript template with **supply-chain security**, automated initialization, comprehensive tooling, GitHub automation, and GitHub Copilot integration.

[![CI](https://github.com/r4KK4n/nextjs-hardened-template/workflows/CI/badge.svg)](https://github.com/r4KK4n/nextjs-hardened-template/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Template](https://img.shields.io/badge/template-ready-brightgreen)](https://github.com/r4KK4n/nextjs-hardened-template/generate)

## ✨ Features

- ⚡ **Next.js 15** - App Router with Server Components
- 🔷 **TypeScript** - Strict mode enabled, full type safety
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧪 **Vitest** - Fast unit testing with React Testing Library
- 📏 **ESLint + Prettier** - Code quality and formatting
- 🤖 **GitHub Actions** - Automated CI/CD pipeline with security scanning
- 🔒 **Supply-Chain Security** - `npm ci --ignore-scripts`, npm audit, Snyk scanning
- 🛡️ **Security Hardened** - CSP headers, input validation, best practices
- 🔄 **Template Initialization** - Interactive wizard to replace placeholders
- ✅ **Verification System** - Ensure proper initialization before development
- 📝 **GitHub Copilot System** - Comprehensive prompt library
- 📚 **Documentation** - Architecture, conventions, security guides
- 🎯 **VS Code** - Optimized settings and extensions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0

```bash
# Check versions
node --version
npm --version
```

## 🎯 Getting Started

### Option 1: Use This Template (Recommended)

Click the **"Use this template"** button at the top of this repository, or:

```bash
# GitHub CLI
gh repo create my-project --template r4KK4n/nextjs-hardened-template
cd my-project
```

### Option 2: Clone and Initialize

```bash
git clone https://github.com/r4KK4n/nextjs-hardened-template.git my-project
cd my-project
```

### Step 1: Initialize Template

```bash
# Interactive initialization wizard
# Replaces all placeholders and detects defaults from git config
npm run template:init
```

The wizard will prompt for:
- **Project Name** (detected from directory name)
- **Description**
- **Author** (detected from git config)
- **GitHub Repository** (detected from git remote)

### Step 2: Install Dependencies

```bash
# Install with security best practices
# --ignore-scripts prevents execution of postinstall hooks
npm ci
```

⚠️ **Why `npm ci`?** See [docs/npm-scripts-policy.md](./docs/npm-scripts-policy.md) for supply-chain security details.

### Step 3: Verify Initialization

```bash
# Ensure all placeholders were replaced
npm run template:check
```

### Step 4: Set Up Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
```

### Step 5: Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
npm run dev              # Start development server (http://localhost:3000)

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Check TypeScript types

# Security
npm audit                # Audit npm dependencies (also runs in CI)

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Template
npm run template:init    # Initialize template (interactive wizard)
npm run template:check   # Verify template initialization
```

## 🧪 Testing

This template uses Vitest and React Testing Library for testing.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
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
# Add a package (local development only)
npm install package-name

# After testing, commit both package.json and package-lock.json
git add package.json package-lock.json
git commit -m "deps: add package-name"
```

⚠️ **Important:** Always review package security and avoid scripts in lifecycle hooks. See [docs/npm-scripts-policy.md](./docs/npm-scripts-policy.md).

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Dependabot will automatically create PRs for updates
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
npm install --save-dev prisma
npm install @prisma/client

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

- 🐛 Issues: [GitHub Issues](https://github.com/r4KK4n/nextjs-hardened-template/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/r4KK4n/nextjs-hardened-template/discussions)
- 🔒 Security: See [SECURITY.md](./.github/SECURITY.md)

---

## 📖 Additional Resources

- [Template Placeholders](./.template/PLACEHOLDERS.md) - All placeholder variables
- [NPM Scripts Policy](./docs/npm-scripts-policy.md) - Supply-chain security
- [Secrets Management](./docs/secrets.md) - GitHub secrets setup
- [Architecture](./docs/architecture.md) - System design patterns
- [Coding Conventions](./docs/conventions.md) - Development standards

---

**Built with ❤️ using Next.js 15 + TypeScript**

⭐ If you find this template useful, please give it a star! It helps others discover this resource.

---

## 🚀 Quick Links

- [Use This Template](https://github.com/r4KK4n/nextjs-hardened-template/generate) - Create your project
- [GitHub Repository](https://github.com/r4KK4n/nextjs-hardened-template) - View source
- [Issues](https://github.com/r4KK4n/nextjs-hardened-template/issues) - Report bugs
