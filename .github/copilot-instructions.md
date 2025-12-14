# GitHub Copilot Instructions

This file provides global instructions for GitHub Copilot when working in this repository.

## Template Initialization Status

### ⚠️ Check Before Starting Work

Before generating any code or making changes, **check if the template is initialized**:

```bash
# Check for initialization marker
test -f .template/UNINITIALIZED && echo "NOT INITIALIZED" || echo "INITIALIZED"

# Or run the check script
npm run template:check
```

### If Template is Uninitialized

If `.template/UNINITIALIZED` exists:

1. **STOP** - Do not proceed with feature work
2. **Instruct the user** to run: `npm run template:init`
3. **Explain** that the template must be initialized before development can begin
4. **Reference** `.template/PLACEHOLDERS.md` for placeholder documentation

Example response:

```
⚠️ This template is not initialized yet.

Before we can start working on features, please initialize the template:

1. Run: npm run template:init
2. Follow the interactive prompts
3. Run: npm run template:check
4. Set up GitHub secrets (see docs/secrets.md)

See .template/PLACEHOLDERS.md for details on what will be configured.
```

### After Initialization

Once initialized (`.template/UNINITIALIZED` is removed):

- Proceed normally with development tasks
- Ensure all generated code follows project conventions
- Reference `.github/copilot/system.md` for coding standards

---

## Package Management Rules

### ✅ ALWAYS

- **Use `npm ci`** for installing dependencies (NOT `npm install`)
- **In CI/CD**: Always use `npm ci --ignore-scripts`
- **Reference** `docs/npm-scripts-policy.md` for supply-chain security

### ❌ NEVER

- Suggest or generate `npm install` commands
- Suggest running scripts from untrusted packages
- Add postinstall/preinstall/install scripts to package.json

### Examples

**Correct:**

```bash
# Local development
npm ci

# CI/CD environment
npm ci --ignore-scripts
```

**Incorrect:**

```bash
npm install           # ❌ NEVER use
npm i                 # ❌ NEVER use
pnpm install         # ❌ Not without --frozen-lockfile --ignore-scripts in CI
```

---

## Supply-Chain Security

When suggesting or adding dependencies:

1. **Check package reputation**
   - Weekly downloads
   - Recent updates
   - Known maintainers

2. **Review install scripts**

   ```bash
   npm show <package> scripts
   ```

3. **Prefer packages without lifecycle scripts**
   - No postinstall
   - No preinstall
   - No install hooks

4. **Document the reason** for adding dependencies

5. **Reference** `.github/copilot/prompts/dependency-management.md` for detailed guidance

---

## Definition of Done - Template Initialization

A template is considered properly initialized when:

- [ ] `.template/UNINITIALIZED` file is removed
- [ ] `npm run template:check` exits with code 0
- [ ] No placeholder tokens remain (e.g., `__PROJECT_NAME__`)
- [ ] `.env.local` is created from `.env.example`
- [ ] `.template/state.json` exists with initialization data
- [ ] Git remote is configured (if applicable)
- [ ] GitHub secrets are configured (see `docs/secrets.md`)
- [ ] First CI run passes

---

## Project-Specific Guidelines

### Code Style

- Follow ESLint and Prettier configurations
- Use TypeScript strict mode
- Prefer functional components (React)
- Use Server Components by default (Next.js)

### Testing

- Write tests for new features
- Maintain >80% coverage
- Use Vitest + React Testing Library

### Security

- Never commit secrets
- Validate all user input
- Use environment variables for config
- Follow OWASP best practices

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update `.github/copilot-instructions.md` for new workflows

---

## Copilot Prompts

This repository includes specialized Copilot prompts in `.github/prompts/`:

- `template-init.prompt.md` - Template initialization guide

To use a prompt:

```
@workspace /template-init
```

---

## Git Workflow - Feature Branches Required

### ⚠️ NEVER Push Directly to Main

**All changes**, regardless of type, must go through feature branches and pull requests:

1. **Create feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b <branch-type>/<description>
   ```

2. **Make changes** on the feature branch

3. **Commit with descriptive messages**:
   ```bash
   git add .
   git commit -m "type: description"
   ```

4. **Push to feature branch**:
   ```bash
   git push -u origin <branch-type>/<description>
   ```

5. **Create Pull Request** on GitHub
   - Link related issues
   - Provide clear description
   - Request code review from CODEOWNERS

6. **Wait for approval** before merging

### Branch Naming Convention

- `feature/` - New features
- `chore/` - Maintenance, dependency updates, tooling
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring without behavior changes

### Protected Branches

The `main` branch is protected:
- ✅ Requires pull request for **ALL** changes
- ✅ Requires code review approval
- ✅ Requires CI/CD to pass
- ❌ Direct pushes are **NOT** allowed

---

## Common Tasks

### Adding a New Feature

1. Check template initialization status
2. Create feature branch
3. Implement changes following conventions
4. Write tests
5. Update documentation
6. Run `npm run ci` locally
7. Create pull request

### Adding Dependencies

1. Review package at npmjs.com and npms.io
2. Check for install scripts: `npm show <package> scripts`
3. Create feature branch: `git checkout -b chore/add-<package-name>`
4. Add to package.json: `npm install <package>` (local only)
5. Commit package.json and package-lock.json together
6. Document in commit message why dependency is needed
7. Push to feature branch: `git push -u origin chore/add-<package-name>`
8. Create pull request on GitHub

### Updating Dependencies

1. Create feature branch: `git checkout -b chore/update-dependencies`
2. Update package.json with new versions
3. Run `npm ci` to validate or `npm install --legacy-peer-deps` to generate new lock file
4. Commit package.json and package-lock.json together
5. Document all version changes in commit message
6. Push to feature branch: `git push -u origin chore/update-dependencies`
7. Create pull request on GitHub

### Updating CI Workflow

1. **NEVER** remove `npm ci --ignore-scripts`
2. **ALWAYS** keep `npm run template:check` step
3. Test changes in a branch first
4. Require code review (CODEOWNERS)

---

## Protected Files

The following files require extra care and should trigger code review:

- `.github/workflows/**` - CI/CD configuration
- `.github/copilot-instructions.md` - This file
- `.github/prompts/**` - Copilot prompts
- `.vscode/**` - Editor configuration
- `scripts/**` - Automation scripts
- `docs/npm-scripts-policy.md` - Security policy
- `docs/secrets.md` - Secrets documentation

See `.github/CODEOWNERS` for review requirements.

---

## References

- **Coding Standards**: `.github/copilot/system.md`
- **Supply-Chain Security**: `docs/npm-scripts-policy.md`
- **Secrets Management**: `docs/secrets.md`
- **Architecture**: `docs/architecture.md`
- **Conventions**: `docs/conventions.md`

---

## Support

For questions about:

- **Template initialization**: See `.template/PLACEHOLDERS.md`
- **Security policy**: See `docs/npm-scripts-policy.md`
- **GitHub secrets**: See `docs/secrets.md`
- **Development workflow**: See `CONTRIBUTING.md`

---

**Last Updated**: 2025-12-14  
**Applies To**: All development work in this repository  
**Enforcement**: GitHub Copilot + CI checks
