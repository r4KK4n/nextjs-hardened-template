# Template Placeholders

This document describes all placeholders that must be replaced when initializing this template repository.

## Placeholder Format

All placeholders use the format: `__PLACEHOLDER_NAME__`

## Required Placeholders

### Project Identity

| Placeholder | Description | Example | Used In |
|------------|-------------|---------|---------|
| `__PROJECT_NAME__` | Project name (kebab-case recommended) | `my-awesome-app` | package.json, README.md, docs |
| `__PROJECT_DISPLAY_NAME__` | Human-readable project name | `My Awesome App` | README.md, documentation |
| `__DESCRIPTION__` | Short project description | `A modern Next.js application` | package.json, README.md |
| `__AUTHOR__` | Author name or organization | `Jane Doe` or `Acme Corp` | package.json, LICENSE, docs |
| `__AUTHOR_EMAIL__` | Contact email | `jane@example.com` | package.json, SECURITY.md |

### Repository Information

| Placeholder | Description | Example | Used In |
|------------|-------------|---------|---------|
| `__REPO_URL__` | Full GitHub repository URL | `https://github.com/user/repo` | README.md, CONTRIBUTING.md |
| `__REPO_OWNER__` | GitHub username or org | `username` | README badges, workflows |
| `__REPO_NAME__` | Repository name | `my-awesome-app` | README badges, workflows |

### Domain & Deployment

| Placeholder | Description | Example | Used In |
|------------|-------------|---------|---------|
| `__COMPANY_DOMAIN__` | Primary domain name | `example.com` | robots.txt, sitemaps |
| `__PRODUCTION_URL__` | Production deployment URL | `https://app.example.com` | Environment configs |

### Team & Ownership

| Placeholder | Description | Example | Used In |
|------------|-------------|---------|---------|
| `__TEAM_HANDLE__` | GitHub team handle (optional) | `@acme/frontend` | CODEOWNERS |
| `__SUPPORT_EMAIL__` | Support contact email | `support@example.com` | README.md, docs |
| `__SECURITY_EMAIL__` | Security vulnerability contact | `security@example.com` | SECURITY.md |

## Legacy Placeholders (Non-Standard Format)

These use a simpler format and should also be replaced:

- `PROJECT_NAME` → Same as `__PROJECT_NAME__`
- `DESCRIPTION` → Same as `__DESCRIPTION__`
- `AUTHOR` → Same as `__AUTHOR__`
- `USERNAME/REPO_NAME` → Same as `__REPO_OWNER__/__REPO_NAME__`
- `YOUR_DOMAIN` → Same as `__COMPANY_DOMAIN__`

## Secrets (Not Stored in Git)

The following are **secrets** that must be configured in GitHub Settings → Secrets and variables → Actions:

| Secret Name | Required? | Description |
|------------|-----------|-------------|
| `CODECOV_TOKEN` | Optional | Codecov.io API token for coverage reports |
| `VERCEL_TOKEN` | Optional | Vercel deployment token |
| `NPM_TOKEN` | Optional | npm registry token (if publishing packages) |

See [docs/secrets.md](../docs/secrets.md) for detailed setup instructions.

## Files Containing Placeholders

The init wizard will scan and replace placeholders in:

- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- `LICENSE`
- `.github/CODEOWNERS`
- `.github/ISSUE_TEMPLATE/*.yml`
- `.github/SECURITY.md`
- `public/robots.txt`
- All `.md` files in `docs/`

## Validation

Run `npm run template:check` after initialization to verify all placeholders have been replaced.

## Notes

- Placeholders are case-sensitive
- Use consistent casing:
  - `__PROJECT_NAME__` for identifiers (kebab-case or snake_case)
  - `__PROJECT_DISPLAY_NAME__` for human-readable text (Title Case)
- Never commit secrets to git
- The `.template/state.json` file stores initialization metadata (not committed)
