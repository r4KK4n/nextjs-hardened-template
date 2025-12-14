# Copilot Prompt: Dependency Management

## Context
This prompt guides adding, updating, or removing npm/pnpm dependencies with security-first practices to prevent supply-chain attacks.

---

## When to Use This Prompt
- Adding a new package dependency
- Updating existing dependencies
- Removing unused dependencies
- Reviewing dependency security
- Configuring package.json scripts
- Writing CI/CD workflows that install packages

---

## Steps

### 1. Research the Dependency

Before adding any package:

```bash
# Check package information
npm info <package-name>

# Review on npm registry
open https://www.npmjs.com/package/<package-name>

# Check package quality score
open https://npms.io/search?q=<package-name>

# View install scripts (RED FLAG if present)
npm show <package-name> scripts
```

**Evaluation Checklist:**
- [ ] Has >10k weekly downloads (or justified niche package)
- [ ] Updated within last 6 months
- [ ] Has GitHub repository with source code
- [ ] No install/postinstall/preinstall scripts (or explicitly reviewed)
- [ ] Has reasonable number of maintainers (not 1, not 100)
- [ ] No recent security advisories
- [ ] Dependencies are reasonable (not 100+ sub-dependencies)

### 2. Add the Dependency

```bash
# Add production dependency
pnpm add <package-name>

# Add dev dependency
pnpm add -D <package-name>

# Add with exact version (for critical deps)
pnpm add --save-exact <package-name>
```

### 3. Verify the Installation

```bash
# Check what was added to package.json
git diff package.json

# Review lockfile changes
git diff pnpm-lock.yaml

# Verify no malicious scripts were added
npm show <package-name> scripts

# Run security audit
pnpm audit
```

### 4. Test the Application

```bash
# Test locally
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Type check
pnpm type-check
```

### 5. Document and Commit

```bash
# Commit both package.json and lockfile
git add package.json pnpm-lock.yaml

# Use conventional commit format
git commit -m "feat(deps): add <package-name> for <purpose>

- Adds <package-name>@<version>
- Purpose: <explain why this dependency is needed>
- Security review: No install scripts, <downloads> weekly downloads
- Alternatives considered: <if any>"
```

---

## Output Format

### For Adding Dependencies

```typescript
// 1. Research Summary
/**
 * Package: <package-name>
 * Version: <version>
 * Weekly Downloads: <number>
 * Last Updated: <date>
 * Install Scripts: None (or details if present)
 * Security Review: ✅ Passed
 */

// 2. Installation Command
// pnpm add <package-name>

// 3. Usage Example
import { something } from '<package-name>';

// Use the package...
```

### For Updating Dependencies

```bash
# Update specific package
pnpm update <package-name>

# Or update interactively
pnpm up -i

# Verify changes
git diff package.json pnpm-lock.yaml

# Test thoroughly before committing
pnpm test && pnpm build
```

### For CI/CD Workflows

```yaml
# ✅ CORRECT - Secure installation in CI
- name: Install dependencies
  run: pnpm install --frozen-lockfile --ignore-scripts

# ❌ WRONG - Insecure installation
- name: Install dependencies
  run: pnpm install  # Missing --frozen-lockfile and --ignore-scripts
```

---

## Do's

✅ **DO:**
- Research packages before adding them
- Check for install scripts (npm show <pkg> scripts)
- Use `--frozen-lockfile --ignore-scripts` in CI
- Commit package.json and lockfile together
- Run `pnpm audit` after adding dependencies
- Review Dependabot PRs promptly
- Use exact versions for critical dependencies
- Document why each dependency is needed
- Test after adding/updating dependencies
- Remove unused dependencies regularly
- Keep lockfiles up-to-date
- Use pnpm instead of npm (faster, more secure)

✅ **DO in CI:**
```yaml
- run: pnpm install --frozen-lockfile --ignore-scripts
- run: npm ci --ignore-scripts  # If using npm
```

---

## Don'ts

❌ **DON'T:**
- Add dependencies without researching them first
- Use `npm install` or `pnpm install` in CI without flags
- Ignore packages with install/postinstall scripts
- Add packages with <1k weekly downloads without review
- Install packages that download external binaries
- Ignore security audit warnings
- Commit without updating lockfile
- Add unnecessary dependencies
- Use deprecated packages
- Trust packages just because they're popular
- Manually edit lockfiles
- Ignore Dependabot security alerts

❌ **DON'T in CI:**
```yaml
# NEVER do these:
- run: npm install  # Non-deterministic, runs scripts
- run: pnpm install  # Missing --frozen-lockfile and --ignore-scripts
- run: pnpm add <package>  # Don't install packages in CI
```

---

## Examples

### Example 1: Adding a Well-Known Package

```typescript
// @copilot: Using dependency-management.md, add date-fns for date formatting

/**
 * Research Summary:
 * Package: date-fns
 * Version: 3.0.0
 * Weekly Downloads: ~12M
 * Last Updated: 2023-09-01
 * Install Scripts: None ✅
 * Security: Well-maintained, no advisories
 * Alternatives: moment.js (deprecated), dayjs (smaller but less features)
 */

// Installation:
// pnpm add date-fns

// Usage:
import { format, parseISO } from 'date-fns';

export function formatDate(date: string): string {
  return format(parseISO(date), 'PPP');
}
```

### Example 2: Reviewing Suspicious Package

```typescript
// @copilot: Check if "super-fast-utils" is safe to install

/**
 * Research Summary:
 * Package: super-fast-utils
 * Version: 1.0.0
 * Weekly Downloads: 50 ⚠️ (RED FLAG: Very low)
 * Last Updated: 2023-01-15 ⚠️ (RED FLAG: Over 1 year old)
 * Install Scripts: postinstall: "node install.js" 🚨 (RED FLAG)
 * Security: Unknown maintainer, no source repository
 * 
 * RECOMMENDATION: ❌ DO NOT INSTALL
 * Reasons:
 * - Very low downloads (possible typosquatting)
 * - Has postinstall script (could be malicious)
 * - No source code repository (can't audit)
 * - Not actively maintained
 * 
 * Alternative: Implement the utility function yourself or use lodash
 */
```

### Example 3: Secure CI Configuration

```yaml
# @copilot: Using dependency-management.md, create a secure CI workflow

name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      # ✅ SECURE: frozen lockfile + ignore scripts
      - name: Install dependencies
        run: pnpm install --frozen-lockfile --ignore-scripts
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
```

### Example 4: Updating Dependencies Safely

```bash
# @copilot: Using dependency-management.md, help me update all dependencies

# Step 1: Check for outdated packages
pnpm outdated

# Step 2: Update interactively (review each)
pnpm up -i

# Step 3: Review changes
git diff package.json pnpm-lock.yaml

# Step 4: Check for breaking changes
# Review CHANGELOG/release notes for each updated package

# Step 5: Test thoroughly
pnpm test
pnpm type-check
pnpm build
pnpm dev  # Manual testing

# Step 6: Run security audit
pnpm audit

# Step 7: Commit if all tests pass
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): update dependencies

- Updated <package1> from x.y.z to a.b.c
- Updated <package2> from x.y.z to a.b.c
- All tests passing
- No breaking changes detected"
```

---

## Security Checklist

Before completing any dependency operation:

- [ ] Package has no install/postinstall/preinstall scripts (or reviewed and documented)
- [ ] Package is from trusted source (npm registry, verified maintainer)
- [ ] Package has reasonable download count for its purpose
- [ ] Package has been updated recently (within 1 year)
- [ ] Package has source code repository (GitHub/GitLab)
- [ ] No security advisories for the package
- [ ] Transitive dependencies are reasonable (<50 for most packages)
- [ ] CI uses `--frozen-lockfile --ignore-scripts`
- [ ] Lockfile is committed and up-to-date
- [ ] Security audit passes (`pnpm audit`)
- [ ] All tests pass after installation
- [ ] Documentation updated if needed

---

## References

- [npm Scripts Security Policy](../../../docs/npm-scripts-policy.md)
- [Supply Chain Security](../system.md#supply-chain-security)
- [GitHub Dependabot Config](../../dependabot.yml)

---

## Red Flags 🚩

If you encounter any of these, **DO NOT INSTALL** without security team review:

1. **Install scripts present** (postinstall, preinstall, install)
2. **Very low download count** (<1k/week for unknown packages)
3. **No source code repository**
4. **Downloads external binaries** during install
5. **Requests unusual permissions**
6. **Recently transferred to new maintainer**
7. **Has security advisories** (check severity)
8. **Asks for sensitive data** in install script
9. **Hundreds of transitive dependencies**
10. **Package name is very similar to popular package** (typosquatting)

When in doubt, ask the security team or senior developers for review.
