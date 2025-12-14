# 📦 Complete Next.js + TypeScript Template Repository

## Table of Contents

1. [Complete File Tree](#complete-file-tree)
2. [Rationale for Major Groups](#rationale-for-major-groups)
3. [How to Use This Template](#how-to-use-this-template)

---

## Complete File Tree

```
nextjs-ts-template/
├── .github/
│   ├── copilot/
│   │   ├── system.md                    # Global Copilot instructions
│   │   └── prompts/
│   │       ├── api-route.md            # API route creation prompt
│   │       ├── bugfix.md               # Bug fixing prompt
│   │       ├── code-review.md          # Code review guidelines
│   │       ├── data-access.md          # Data access patterns
│   │       ├── docs.md                 # Documentation prompt
│   │       ├── nextjs-component.md     # Component creation prompt
│   │       ├── performance.md          # Performance optimization
│   │       ├── refactor.md             # Refactoring guidelines
│   │       ├── security-review.md      # Security review checklist
│   │       ├── server-action.md        # Server Actions prompt
│   │       └── unit-tests.md           # Testing guidelines
│   ├── workflows/
│   │   └── ci.yml                      # CI/CD pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml              # Bug report template
│   │   └── feature_request.yml         # Feature request template
│   ├── CODEOWNERS                      # Code ownership
│   ├── dependabot.yml                  # Dependency updates
│   ├── pull_request_template.md        # PR template
│   └── SECURITY.md                     # Security policy
├── .husky/
│   └── pre-commit                      # Pre-commit hook
├── .vscode/
│   ├── extensions.json                 # Recommended extensions
│   ├── launch.json                     # Debug configuration
│   └── settings.json                   # Workspace settings
├── docs/
│   ├── architecture.md                 # System architecture
│   ├── conventions.md                  # Coding conventions
│   ├── copilot-usage.md               # Copilot usage guide
│   ├── npm-scripts-policy.md          # Supply-chain security policy
│   └── security.md                     # Security guidelines
├── public/
│   └── robots.txt                      # SEO robots file
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts           # Health check endpoint
│   │   ├── error.tsx                   # Error boundary
│   │   ├── layout.tsx                  # Root layout
│   │   ├── loading.tsx                 # Loading UI
│   │   ├── not-found.tsx              # 404 page
│   │   └── page.tsx                    # Home page
│   ├── components/
│   │   ├── button.test.tsx            # Button tests
│   │   ├── button.tsx                  # Button component
│   │   ├── card.tsx                    # Card component
│   │   └── index.ts                    # Component exports
│   ├── lib/
│   │   ├── constants.ts                # App constants
│   │   ├── errors.ts                   # Custom error classes
│   │   ├── format.test.ts             # Format tests
│   │   ├── format.ts                   # Formatting utilities
│   │   ├── logger.ts                   # Logging utility
│   │   ├── utils.ts                    # General utilities
│   │   └── validation.ts               # Validation schemas
│   ├── styles/
│   │   └── globals.css                 # Global styles
│   ├── test/
│   │   └── setup.ts                    # Test setup
│   └── types/
│       ├── env.d.ts                    # Environment types
│       └── index.ts                    # Common types
├── .editorconfig                       # Editor configuration
├── .env.example                        # Environment template
├── .eslintrc.json                     # ESLint configuration
├── .gitattributes                     # Git attributes
├── .gitignore                         # Git ignore rules
├── .lintstagedrc.json                 # Lint-staged config
├── .prettierignore                    # Prettier ignore
├── .prettierrc.json                   # Prettier configuration
├── CHANGELOG.md                        # Version history
├── CONTRIBUTING.md                     # Contribution guidelines
├── LICENSE                             # MIT License
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies & scripts
├── postcss.config.mjs                  # PostCSS configuration
├── README.md                           # Main documentation
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── vitest.config.ts                    # Vitest configuration
```

**Total Files**: 62+ files across the entire repository structure

---

## Rationale for Major Groups

## Rationale for Major Groups

### 1. **GitHub Automation (.github/)**

**Why it exists:**

- Automates code quality checks, testing, and deployment
- Provides templates for consistent issue/PR management
- Ensures security vulnerability tracking via Dependabot
- Enables collaborative code ownership with CODEOWNERS

**Key files:**

- `workflows/ci.yml` - Runs lint, type-check, tests, and build on every push/PR
- `dependabot.yml` - Automatically updates dependencies weekly
- Issue templates - Standardized bug reports and feature requests

### 2. **Copilot Prompt System (.github/copilot/)**

**Why it exists:**

- Provides context for GitHub Copilot to generate better, project-specific code
- Ensures consistency across the codebase by teaching Copilot the project standards
- Speeds up development with task-specific patterns and examples
- Documents best practices in a machine-readable format

**Key features:**

- `system.md` - Global instructions read automatically by Copilot
- 11 task-specific prompts covering all development scenarios
- Do/Don't lists and code examples for each task type
- Quality checklists integrated into prompts

### 3. **Configuration Files (Root)**

**Why they exist:**

- Enforce consistent code style across the team
- Automate formatting and linting
- Define build and runtime behavior
- Ensure cross-platform compatibility

**Key configurations:**

- `.editorconfig` - Universal editor settings
- `.prettierrc.json` + `.eslintrc.json` - Code style enforcement
- `tsconfig.json` - TypeScript strict mode
- `next.config.ts` - Security headers and performance settings

### 4. **Git Hooks (.husky/)**

**Why it exists:**

- Prevents bad code from being committed
- Runs linting and formatting automatically
- Ensures tests pass before push
- Maintains code quality gate at the developer level

### 5. **VS Code Settings (.vscode/)**

**Why it exists:**

- Optimizes the development experience in VS Code
- Auto-formats on save
- Recommends essential extensions
- Provides debugging configurations

**Key features:**

- Automatic Prettier formatting
- ESLint auto-fix on save
- Tailwind IntelliSense configuration
- Debug configurations for Next.js

### 6. **Documentation (docs/)**

**Why it exists:**

- Onboards new developers quickly
- Documents architectural decisions
- Provides coding standards reference
- Guides Copilot usage for maximum productivity

**Key documents:**

- `architecture.md` - System design and patterns
- `conventions.md` - Naming, structure, and style guide
- `copilot-usage.md` - How to leverage the Copilot system

### 7. **Next.js Application (src/app/)**

**Why it exists:**

- Implements Next.js 15 App Router structure
- Separates routes, API endpoints, and layouts
- Provides error boundaries and loading states
- Follows Server Components best practices

**Structure:**

- `page.tsx` - Route entry points
- `layout.tsx` - Shared UI wrappers
- `error.tsx` - Error handling
- `api/` - Backend API routes

### 8. **Component Library (src/components/)**

**Why it exists:**

- Provides reusable UI building blocks
- Maintains consistent design system
- Separates presentational from feature components
- Includes tests alongside components

**Organization:**

- `ui/` - Basic components (Button, Card)
- Feature components at root level
- `index.ts` - Barrel exports for clean imports

### 9. **Utilities (src/lib/)**

**Why it exists:**

- Centralizes shared functionality
- Provides type-safe helpers
- Implements error handling patterns
- Contains validation and formatting logic

**Key utilities:**

- `logger.ts` - Structured logging
- `errors.ts` - Custom error classes
- `validation.ts` - Zod schemas
- `format.ts` - Date/currency formatting

### 10. **Testing (src/test/ + \*.test.ts)**

**Why it exists:**

- Ensures code quality and correctness
- Prevents regressions
- Documents expected behavior
- Uses fast Vitest framework

**Setup:**

- Vitest for unit/integration tests
- React Testing Library for component tests
- Tests colocated with source files
- Global test setup in `src/test/setup.ts`

---

## How to Use This Template

### Step 1: Clone and Customize

```bash
# 1. Create your project from this template
git clone <template-url> my-project
cd my-project

# 2. Remove template git history
rm -rf .git
git init

# 3. Find and replace placeholders:
#    PROJECT_NAME → Your project name
#    DESCRIPTION → Your description
#    AUTHOR → Your name
#    USERNAME/REPO_NAME → Your GitHub info
#    YOUR_DOMAIN → Your domain
#    *_EMAIL@example.com → Your emails

# Key files to update:
#   - package.json (name, description, author)
#   - README.md (all placeholders)
#   - LICENSE (copyright holder)
#   - .github/CODEOWNERS (team members)
#   - .github/SECURITY.md (contact email)
```

### Step 2: Install Dependencies

```bash
# Install Node.js 18.17+ and pnpm 8+
node --version  # Check version
pnpm --version

# Install pnpm if needed
npm install -g pnpm

# Install project dependencies
pnpm install
```

### Step 3: Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# Add database URLs, API keys, secrets, etc.
```

### Step 4: Initialize Git Hooks

```bash
# Set up Husky for pre-commit hooks
pnpm prepare

# Hooks will now run automatically on commit
```

### Step 5: Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000

# In another terminal, run tests in watch mode
pnpm test:watch
```

### Step 6: Customize for Your Needs

#### Adding a Database

```bash
# Example with Prisma
pnpm add -D prisma
pnpm add @prisma/client

npx prisma init
# Edit prisma/schema.prisma
npx prisma migrate dev
```

#### Adding Authentication

```bash
# Example with NextAuth.js
pnpm add next-auth
# Follow NextAuth.js setup guide
```

#### Adding UI Library

```bash
# Example with Radix UI
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
```

### Step 7: Use Copilot Prompts

```typescript
// Reference prompts in your code
// @copilot: Using nextjs-component.md, create a Modal component with:
// - Controlled visibility
// - Overlay backdrop
// - Close button
// - Keyboard support (ESC key)

// Copilot will generate code following project conventions
```

See `docs/copilot-usage.md` for detailed examples.

### Step 8: Write Code with Quality Gates

```bash
# Before committing, these run automatically via Husky:
pnpm lint      # ESLint checks
pnpm format    # Prettier formatting

# Run full CI check locally:
pnpm ci        # lint + type-check + test

# On push, GitHub Actions will:
# - Run all checks
# - Build the project
# - Report coverage
```

### Step 9: Deploy

#### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo to Vercel for auto-deploys
```

#### Deploy with Docker

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
```

#### Environment Variables for Production

Set these in your deployment platform:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Database URLs
- API keys and secrets

### Step 10: Maintain and Update

```bash
# Check for outdated dependencies
pnpm outdated

# Update dependencies interactively
pnpm up -i

# Run security audit
pnpm audit

# Update GitHub Actions
# (Dependabot will create PRs automatically)
```

---

## Next Steps

1. **Read the documentation:**
   - `README.md` - Overview and quick start
   - `docs/architecture.md` - System design
   - `docs/conventions.md` - Coding standards
   - `docs/copilot-usage.md` - Copilot guide

2. **Explore the Copilot system:**
   - `.github/copilot/system.md` - Global rules
   - `.github/copilot/prompts/` - Task prompts

3. **Set up your development environment:**
   - Install recommended VS Code extensions
   - Configure your IDE
   - Set up debugger

4. **Start building:**
   - Create your first component
   - Add API routes
   - Write tests
   - Deploy to production

---

## Features Checklist

✅ **Framework & Language**

- [x] Next.js 15 with App Router
- [x] TypeScript with strict mode
- [x] React 18 with Server Components

✅ **Styling & UI**

- [x] Tailwind CSS configured
- [x] Sample components (Button, Card)
- [x] Responsive design utilities
- [x] Dark mode ready (CSS variables)

✅ **Code Quality**

- [x] ESLint with Next.js rules
- [x] Prettier for formatting
- [x] EditorConfig for consistency
- [x] Git hooks with Husky
- [x] lint-staged for pre-commit

✅ **Testing**

- [x] Vitest for unit tests
- [x] React Testing Library
- [x] Coverage reporting
- [x] Example tests included

✅ **GitHub Automation**

- [x] CI/CD workflow
- [x] Dependabot configuration
- [x] Issue templates
- [x] PR template
- [x] CODEOWNERS file
- [x] Security policy

✅ **Copilot Integration**

- [x] Global system instructions
- [x] 11 task-specific prompts
- [x] Code patterns and examples
- [x] Quality checklists
- [x] Usage documentation

✅ **Documentation**

- [x] Comprehensive README
- [x] Architecture guide
- [x] Conventions guide
- [x] Copilot usage guide
- [x] Security guidelines
- [x] Contributing guidelines

✅ **Security**

- [x] Security headers configured
- [x] Input validation examples
- [x] Error handling patterns
- [x] Environment variable setup
- [x] Secret management guide

✅ **Developer Experience**

- [x] VS Code settings
- [x] Extension recommendations
- [x] Debug configurations
- [x] Fast refresh
- [x] TypeScript IntelliSense

✅ **Performance**

- [x] Server Components by default
- [x] Image optimization (Next.js Image)
- [x] Font optimization (next/font)
- [x] Code splitting
- [x] Production builds optimized

---

## Support & Community

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues for bugs
- **Discussions**: GitHub Discussions for questions
- **Security**: See `.github/SECURITY.md`

---

**Built with ❤️ by the community**

This template is production-ready and battle-tested. Happy coding! 🚀
