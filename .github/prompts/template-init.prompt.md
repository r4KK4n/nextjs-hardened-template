---
name: Template Initialization
description: Guide for initializing a fresh clone of the Next.js + TypeScript template repository
---

# Template Initialization Prompt

## Purpose

This prompt guides you through initializing a fresh clone of this template repository. The initialization process replaces placeholders, sets up environment files, and prepares the project for development.

## Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- Git configured with user.name and user.email
- GitHub repository created (optional, for remote URL detection)

## Initialization Steps

### 1. Check Initialization Status

```bash
# Check if template is already initialized
npm run template:check
```

**Expected output if uninitialized:**

- Error: "Template is not initialized!"
- Marker file: `.template/UNINITIALIZED` exists

### 2. Run Initialization Wizard

```bash
# Start interactive initialization
npm run template:init
```

The wizard will:

- Detect default values from git, file system, and package.json
- Prompt for project information (press Enter to accept defaults)
- Replace all placeholders throughout the repository
- Create `.env.local` from `.env.example`
- Remove the `.template/UNINITIALIZED` marker
- Save initialization state to `.template/state.json`

### 3. Review Prompted Values

The wizard asks for:

| Prompt                  | Description               | Example                        |
| ----------------------- | ------------------------- | ------------------------------ |
| **Project name**        | Kebab-case identifier     | `my-awesome-app`               |
| **Description**         | Short project description | `A modern Next.js application` |
| **Author name**         | Your name or organization | `Jane Doe` or `Acme Corp`      |
| **Author email**        | Contact email             | `jane@example.com`             |
| **GitHub username/org** | Repository owner          | `janedoe` or `acme`            |
| **Repository name**     | Repository identifier     | `my-awesome-app`               |
| **Company domain**      | Primary domain            | `example.com`                  |
| **Support email**       | Support contact           | `support@example.com`          |
| **Security email**      | Security contact          | `security@example.com`         |

**Tips:**

- Press **Enter** to accept default values (shown in cyan)
- Defaults are detected from git config, directory name, and package.json
- You can re-run initialization by manually creating `.template/UNINITIALIZED`

### 4. Install Dependencies

```bash
# Install all dependencies (respecting lockfile)
npm ci
```

**⚠️ Important:**

- **ALWAYS use `npm ci`** (not `npm install`)
- This ensures reproducible builds using the lockfile
- See `docs/npm-scripts-policy.md` for security rationale

### 5. Verify Initialization

```bash
# Run verification checks
npm run template:check
```

**Expected output:**

- ✓ Initialization marker removed
- ✓ Found: package.json, README.md, etc.
- ✓ No placeholders found
- All checks passed!

If checks fail:

- Review listed files with remaining placeholders
- Manually replace any missed placeholders
- Run `npm run template:check` again

### 6. Configure GitHub Secrets

Set up required secrets in your GitHub repository:

1. Go to: **Repository Settings** → **Secrets and variables** → **Actions**
2. Add secrets as documented in `docs/secrets.md`:
   - `CODECOV_TOKEN` (optional, for coverage reports)
   - `VERCEL_TOKEN` (optional, for deployments)
   - Additional secrets as needed

**Reference:** See `docs/secrets.md` for detailed instructions

### 7. Review and Customize

Manually review these files for project-specific customization:

- **`.env.local`** - Local environment variables
- **`.github/CODEOWNERS`** - Team ownership assignments
- **`docs/`** - Project documentation
- **`.github/workflows/`** - CI/CD pipelines
- **`public/robots.txt`** - SEO configuration

### 8. Initial Commit

```bash
# Stage all changes
git add .

# Commit with conventional commit format
git commit -m "chore: initialize template with project details

- Replaced all placeholders
- Configured project metadata
- Set up environment files
- Ready for development"

# Push to remote (if configured)
git push origin main
```

## Placeholder Reference

See `.template/PLACEHOLDERS.md` for complete list of placeholders and their meanings.

**Common placeholders:**

- `__PROJECT_NAME__` - Project identifier (kebab-case)
- `__DESCRIPTION__` - Project description
- `__AUTHOR__` - Author name
- `__REPO_URL__` - Full GitHub repository URL
- `__COMPANY_DOMAIN__` - Primary domain name

**Legacy format (also replaced):**

- `PROJECT_NAME`
- `DESCRIPTION`
- `AUTHOR`
- `USERNAME/REPO_NAME`

## Post-Initialization Checklist

- [ ] `.template/UNINITIALIZED` removed
- [ ] `npm run template:check` passes
- [ ] `npm ci` completes successfully
- [ ] `.env.local` created and customized
- [ ] GitHub secrets configured (see `docs/secrets.md`)
- [ ] `.github/CODEOWNERS` updated with team
- [ ] Documentation reviewed and customized
- [ ] First CI run passes
- [ ] Development server starts: `npm run dev`

## Development Workflow

After initialization, use these commands:

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Run tests
npm run test

# Type check
npm run type-check

# Run all checks (like CI)
npm run ci

# Build for production
npm run build
```

## Supply-Chain Security Reminders

**✅ Always:**

- Use `npm ci` for dependency installation
- Use `npm ci --ignore-scripts` in CI/CD
- Review packages before adding: `npm show <package> scripts`
- Keep lockfile committed and up-to-date

**❌ Never:**

- Use `npm install` (except when adding new packages locally)
- Add packages with postinstall/preinstall scripts without review
- Commit secrets to git
- Ignore Dependabot security alerts

**Reference:** `docs/npm-scripts-policy.md`

## Troubleshooting

### "Template is already initialized"

If you see this message but want to re-initialize:

```bash
# Manually create marker file
touch .template/UNINITIALIZED

# Run initialization again
npm run template:init
```

### "Found placeholders in files"

The check script found unreplaced placeholders:

1. Review the listed files and line numbers
2. Manually replace remaining placeholders
3. Run `npm run template:check` again

Common causes:

- Binary files (ignored)
- Files in excluded directories (node_modules, .git)
- Custom placeholders not in standard format

### Dependencies installation fails

```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm ci
```

If issues persist:

- Check Node.js version: `node --version` (need >= 18.17.0)
- Check npm version: `npm --version` (need >= 9.0.0)
- Review error messages for specific package issues

### CI fails with "Template not initialized"

Ensure you pushed changes after initialization:

```bash
# Check if UNINITIALIZED marker exists
git ls-files .template/UNINITIALIZED

# If it shows the file, it's still tracked in git
# Commit the removal:
git add .template/UNINITIALIZED
git commit -m "chore: mark template as initialized"
git push
```

## Next Steps After Initialization

1. **Set up development environment:**
   - Install recommended VS Code extensions (see `.vscode/extensions.json`)
   - Configure editor settings
   - Set up debugger (see `.vscode/launch.json`)

2. **Review project structure:**
   - Read `docs/architecture.md` for system design
   - Read `docs/conventions.md` for coding standards
   - Read `docs/copilot-usage.md` for AI-assisted development

3. **Start developing:**
   - Create feature branch: `git checkout -b feature/my-feature`
   - Make changes following conventions
   - Write tests for new features
   - Run `npm run ci` before pushing

4. **Set up team workflows:**
   - Configure branch protection rules
   - Set up code review requirements (see `.github/CODEOWNERS`)
   - Configure Dependabot (see `.github/dependabot.yml`)
   - Set up deployment pipelines

## References

- **Placeholder docs**: `.template/PLACEHOLDERS.md`
- **Secrets setup**: `docs/secrets.md`
- **Security policy**: `docs/npm-scripts-policy.md`
- **Copilot guidance**: `.github/copilot-instructions.md`
- **Contributing**: `CONTRIBUTING.md`

## Support

For help with initialization:

- Review this prompt
- Check `.template/PLACEHOLDERS.md`
- See `docs/secrets.md` for GitHub secrets
- Open an issue in the template repository

---

**Template Version**: 0.1.0  
**Last Updated**: 2025-12-14  
**Compatibility**: Node.js >= 18.17.0
