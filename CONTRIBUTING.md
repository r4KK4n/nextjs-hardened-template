# Contributing to PROJECT_NAME

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something great together.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots if applicable**
- **Your environment** (OS, browser, Node version)

Use the bug report template in `.github/ISSUE_TEMPLATE/bug_report.yml`.

### Suggesting Features

Feature requests are welcome! Use the feature request template and include:

- **Clear use case**
- **Proposed solution**
- **Alternative solutions considered**
- **Why this would be useful**

### Pull Requests

1. **Fork and clone** the repository
2. **Create a branch** from `main`
3. **Make your changes**
4. **Write tests** for new functionality
5. **Update documentation** if needed
6. **Run quality checks**:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```
7. **Commit using conventional commits**:
   ```
   feat(component): add new button variant
   fix(api): handle null user data
   docs(readme): update installation steps
   ```
8. **Push to your fork** and **open a PR**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Install dependencies
# For local development (executes git hooks setup):
pnpm install

# For maximum security (skip all lifecycle scripts):
# pnpm install --ignore-scripts
# pnpm prepare  # manually run to set up git hooks

# Set up environment
cp .env.example .env

# Start development
pnpm dev
```

## Project Structure

Please follow the established structure:
- Components in `/src/components/`
- Utilities in `/src/lib/`
- Types in `/src/types/`
- Tests next to source files

See [docs/conventions.md](./docs/conventions.md) for detailed guidelines.

## Coding Guidelines

### TypeScript
- Use strict mode
- Define proper types/interfaces
- Avoid `any` (use `unknown` if needed)
- Use type guards for runtime checks

### React
- Prefer functional components
- Use Server Components by default
- Add 'use client' only when needed
- Follow hooks rules

### Testing
- Write tests for new features
- Test edge cases
- Keep tests focused and clear
- Use descriptive test names

### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

## Review Process

1. **Automated checks** must pass (CI)
2. **At least one approval** required
3. **Address review comments**
4. **Squash and merge** when ready

## Questions?

- Open a [Discussion](https://github.com/USERNAME/REPO_NAME/discussions)
- Check existing [Issues](https://github.com/USERNAME/REPO_NAME/issues)
- Review [Documentation](./docs/)

Thank you for contributing! 🎉
