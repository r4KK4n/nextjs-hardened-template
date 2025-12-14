# GitHub Secrets Configuration

This document describes all GitHub Actions secrets that should be configured for this repository.

## Overview

GitHub Actions secrets are encrypted environment variables that you create in your repository settings. They are used to store sensitive information like API tokens, credentials, and keys that should never be committed to git.

## Where to Configure Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret name and value
5. Click **Add secret**

## Required Secrets

### CI/CD Pipeline

| Secret Name | Required? | Description | Where to Obtain |
|------------|-----------|-------------|-----------------|
| None | - | Base CI pipeline works without secrets | - |

## Optional Secrets

### Code Coverage

| Secret Name | Required? | Description | Where to Obtain |
|------------|-----------|-------------|-----------------|
| `CODECOV_TOKEN` | Optional | Codecov.io API token for uploading coverage reports | 1. Sign up at [codecov.io](https://codecov.io)<br>2. Add your repository<br>3. Copy the upload token |

### Deployment

| Secret Name | Required? | Description | Where to Obtain |
|------------|-----------|-------------|-----------------|
| `VERCEL_TOKEN` | Optional | Vercel API token for automated deployments | 1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)<br>2. Create new token<br>3. Copy the token value |
| `VERCEL_ORG_ID` | Optional | Vercel organization/team ID | Found in Vercel project settings or `.vercel/project.json` after first deployment |
| `VERCEL_PROJECT_ID` | Optional | Vercel project ID | Found in Vercel project settings or `.vercel/project.json` after first deployment |

### Package Publishing

| Secret Name | Required? | Description | Where to Obtain |
|------------|-----------|-------------|-----------------|
| `NPM_TOKEN` | Optional | npm registry authentication token (if publishing packages) | 1. Log in to [npmjs.com](https://www.npmjs.com)<br>2. Go to Access Tokens<br>3. Generate new token (Automation type)<br>4. Copy the token |

### Notifications

| Secret Name | Required? | Description | Where to Obtain |
|------------|-----------|-------------|-----------------|
| `SLACK_WEBHOOK_URL` | Optional | Slack webhook for CI notifications | 1. Go to Slack App settings<br>2. Create Incoming Webhook<br>3. Copy webhook URL |

## Environment-Specific Secrets

For different deployment environments (staging, production), you can use **Environment secrets**:

1. Go to **Settings** → **Environments**
2. Create environments (e.g., `production`, `staging`)
3. Add environment-specific secrets
4. Reference the environment in your workflow: `environment: production`

## Security Best Practices

### ✅ DO

- **Rotate secrets regularly** (every 90 days or after team member changes)
- **Use least-privilege tokens** (read-only when possible)
- **Use environment secrets** for production vs staging
- **Document all secrets** in this file (but never the values!)
- **Review secret access** in audit logs periodically
- **Use OIDC/Workload Identity** when available (e.g., AWS, GCP, Azure)

### ❌ DON'T

- **Never commit secrets to git** (check with `git log -p | grep -i secret`)
- **Never log secrets** in CI output (they're auto-masked, but be careful)
- **Don't share secrets** in Slack, email, or other channels
- **Don't use personal tokens** for organization projects
- **Don't hardcode secrets** in workflow files

## Verification

After adding secrets, verify they work:

```bash
# Locally (secrets should NOT be accessible)
echo $CODECOV_TOKEN  # Should be empty

# In CI (check workflow run logs)
# Secrets will appear as *** in logs
```

## Secret Rotation Procedure

When rotating a secret:

1. Generate new secret value from provider
2. Add new secret in GitHub Settings (can temporarily have both)
3. Update the secret name/value
4. Test in a CI run
5. Delete old secret once confirmed working
6. Update this documentation if secret name changed

## Troubleshooting

### Secret not working in CI

- **Check secret name**: Must match exactly (case-sensitive)
- **Check secret scope**: Repository vs Environment vs Organization
- **Check workflow permissions**: Ensure workflow has access
- **Check secret value**: No extra spaces, newlines, or quotes

### Secret exposed in logs

1. **Immediately rotate** the secret
2. **Revoke the exposed token** at the provider
3. **Check git history** for commits with the secret
4. **File security incident** if needed
5. **Update workflow** to prevent future exposure

### Can't find secret value

- **Secrets are write-only** - you cannot retrieve values from GitHub
- **Regenerate at source** if lost (e.g., new Codecov token)
- **Update in GitHub** with new value

## Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Using OIDC with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

## Secrets Checklist

Use this checklist when setting up a new repository:

- [ ] Review which secrets are needed for your project
- [ ] Generate tokens/keys from providers
- [ ] Add secrets to GitHub repository settings
- [ ] Test secrets in a CI run
- [ ] Document any additional secrets in this file
- [ ] Set up secret rotation schedule (calendar reminder)
- [ ] Configure branch protection rules
- [ ] Enable secret scanning (GitHub Advanced Security)

## Support

If you need help with secrets configuration:

- **Security team**: __SECURITY_EMAIL__
- **DevOps team**: __SUPPORT_EMAIL__
- **Documentation**: `docs/` directory

---

**Last Updated**: 2025-12-14  
**Review Schedule**: Quarterly  
**Next Review**: 2026-03-14
