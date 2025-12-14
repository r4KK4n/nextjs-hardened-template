#!/usr/bin/env node

/**
 * Template Initialization Wizard
 *
 * This script guides users through initializing a fresh clone of the template repository.
 * It replaces placeholders, creates environment files, and marks the template as initialized.
 *
 * Features:
 * - Idempotent (safe to run multiple times)
 * - Cross-platform (Windows/macOS/Linux)
 * - Interactive with smart defaults
 * - Preserves existing customizations
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { join, dirname, sep } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// ANSI color codes for cross-platform terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Marker file path
const UNINITIALIZED_MARKER = join(ROOT_DIR, '.template', 'UNINITIALIZED');
const STATE_FILE = join(ROOT_DIR, '.template', 'state.json');
const PLACEHOLDERS_FILE = join(ROOT_DIR, '.template', 'PLACEHOLDERS.md');

// File extensions to process
const TEXT_EXTENSIONS = [
  '.md',
  '.txt',
  '.json',
  '.yml',
  '.yaml',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
];

// Directories to exclude from scanning
const EXCLUDE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage'];

/**
 * Check if template is already initialized
 */
function isInitialized() {
  return !existsSync(UNINITIALIZED_MARKER);
}

/**
 * Get default values from git and file system
 */
function getDefaults() {
  const defaults = {
    projectName: '',
    description: 'A modern Next.js + TypeScript application',
    author: '',
    repoUrl: '',
    repoOwner: '',
    repoName: '',
    companyDomain: 'example.com',
    authorEmail: 'author@example.com',
    supportEmail: 'support@example.com',
    securityEmail: 'security@example.com',
  };

  // Try to get repo name from directory
  const dirName = ROOT_DIR.split(sep).pop();
  if (dirName && dirName !== 'nextjs-ts-template') {
    defaults.projectName = dirName;
    defaults.repoName = dirName;
  }

  // Try to get git remote URL
  try {
    const remoteUrl = execSync('git remote get-url origin', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
    if (remoteUrl) {
      defaults.repoUrl = remoteUrl;

      // Parse GitHub URL
      const githubMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (githubMatch) {
        defaults.repoOwner = githubMatch[1];
        defaults.repoName = githubMatch[2];
        if (!defaults.projectName) {
          defaults.projectName = githubMatch[2];
        }
      }
    }
  } catch (e) {
    // Git not initialized or no remote, ignore
  }

  // Try to read package.json
  try {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf-8'));
    // Only use package.json values if they're NOT placeholders
    if (packageJson.name && packageJson.name !== 'PROJECT_NAME') {
      defaults.projectName = packageJson.name;
    }
    if (packageJson.author && packageJson.author !== 'AUTHOR') {
      defaults.author = packageJson.author;
    }
  } catch (e) {
    // Ignore errors
  }

  // Try to get git user info
  try {
    const gitUser = execSync('git config user.name', { encoding: 'utf-8' }).trim();
    const gitEmail = execSync('git config user.email', { encoding: 'utf-8' }).trim();
    if (gitUser && !defaults.author) {
      defaults.author = gitUser;
    }
    if (gitEmail) {
      defaults.authorEmail = gitEmail;
      defaults.supportEmail = gitEmail;
      defaults.securityEmail = gitEmail;
    }
  } catch (e) {
    // Git not configured, ignore
  }

  return defaults;
}

/**
 * Prompt user for input with default value
 */
async function prompt(question, defaultValue = '') {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const displayDefault = defaultValue ? ` (${colors.cyan}${defaultValue}${colors.reset})` : '';
    rl.question(`${question}${displayDefault}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Gather user input interactively
 */
async function gatherInput() {
  const defaults = getDefaults();

  log.header('📝 Template Initialization Wizard');
  log.info('Press Enter to accept default values shown in parentheses.\n');

  const answers = {
    projectName: await prompt('Project name (kebab-case)', defaults.projectName),
    description: await prompt('Project description', defaults.description),
    author: await prompt('Author name', defaults.author),
    authorEmail: await prompt('Author email', defaults.authorEmail),
    repoOwner: await prompt('GitHub username/organization', defaults.repoOwner),
    repoName: await prompt('Repository name', defaults.repoName || answers.projectName),
    companyDomain: await prompt('Company domain', defaults.companyDomain),
    supportEmail: await prompt('Support email', defaults.supportEmail),
    securityEmail: await prompt('Security email', defaults.securityEmail),
  };

  // Derive repoUrl if not set
  if (answers.repoOwner && answers.repoName) {
    answers.repoUrl = `https://github.com/${answers.repoOwner}/${answers.repoName}`;
  } else {
    answers.repoUrl = defaults.repoUrl;
  }

  return answers;
}

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  return TEXT_EXTENSIONS.includes(ext);
}

/**
 * Recursively find all text files
 */
function findTextFiles(dir, files = []) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = fullPath.replace(ROOT_DIR + sep, '');

    // Skip excluded directories
    if (EXCLUDE_DIRS.some((excluded) => relativePath.startsWith(excluded))) {
      continue;
    }

    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findTextFiles(fullPath, files);
    } else if (stat.isFile() && shouldProcessFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Replace placeholders in content
 */
function replacePlaceholders(content, values) {
  let result = content;

  // Define placeholder patterns that should be replaced
  // Using word boundaries and negative lookahead to avoid false positives
  const replacements = [
    // Standard format: __PLACEHOLDER__
    { pattern: /__PROJECT_NAME__/g, value: values.projectName },
    { pattern: /__DESCRIPTION__/g, value: values.description },
    { pattern: /__AUTHOR__/g, value: values.author },
    { pattern: /__AUTHOR_EMAIL__/g, value: values.authorEmail },
    { pattern: /__REPO_OWNER__/g, value: values.repoOwner },
    { pattern: /__REPO_NAME__/g, value: values.repoName },
    { pattern: /__REPO_URL__/g, value: values.repoUrl },
    { pattern: /__COMPANY_DOMAIN__/g, value: values.companyDomain },
    { pattern: /__SUPPORT_EMAIL__/g, value: values.supportEmail },
    { pattern: /__SECURITY_EMAIL__/g, value: values.securityEmail },

    // Legacy format - with word boundaries to avoid partial matches
    // PROJECT_NAME: as whole word only
    { pattern: /\bPROJECT_NAME\b/g, value: values.projectName },

    // DESCRIPTION: as whole word only
    { pattern: /\bDESCRIPTION\b/g, value: values.description },

    // AUTHOR: only as standalone word, NOT part of UNAUTHORIZED
    { pattern: /\bAUTHOR\b(?!IZED)/g, value: values.author },

    // Repository patterns
    { pattern: /USERNAME\/REPO_NAME/g, value: `${values.repoOwner}/${values.repoName}` },
    { pattern: /YOUR_USERNAME\/REPO_NAME/g, value: `${values.repoOwner}/${values.repoName}` },

    // Domain and email patterns
    { pattern: /\bYOUR_DOMAIN\b/g, value: values.companyDomain },
    { pattern: /\bSUPPORT_EMAIL@example\.com\b/g, value: values.supportEmail },
    { pattern: /\bSECURITY_EMAIL@example\.com\b/g, value: values.securityEmail },
  ];

  for (const { pattern, value } of replacements) {
    result = result.replace(pattern, value);
  }

  return result;
}

/**
 * Process all text files and replace placeholders
 */
function processFiles(values) {
  log.header('📄 Processing files...');

  const files = findTextFiles(ROOT_DIR);
  let processedCount = 0;
  let changedCount = 0;

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const newContent = replacePlaceholders(content, values);

      if (content !== newContent) {
        writeFileSync(filePath, newContent, 'utf-8');
        const relativePath = filePath.replace(ROOT_DIR + sep, '');
        log.success(`Updated: ${relativePath}`);
        changedCount++;
      }

      processedCount++;
    } catch (error) {
      const relativePath = filePath.replace(ROOT_DIR + sep, '');
      log.warn(`Skipped (error): ${relativePath}`);
    }
  }

  log.info(`\nProcessed ${processedCount} files, updated ${changedCount} files.\n`);
}

/**
 * Create .env.local from .env.example if it doesn't exist
 */
function createEnvFile() {
  const envExample = join(ROOT_DIR, '.env.example');
  const envLocal = join(ROOT_DIR, '.env.local');

  if (!existsSync(envLocal) && existsSync(envExample)) {
    try {
      const content = readFileSync(envExample, 'utf-8');
      writeFileSync(envLocal, content, 'utf-8');
      log.success('Created .env.local from .env.example');
    } catch (error) {
      log.warn('Could not create .env.local: ' + error.message);
    }
  }
}

/**
 * Save initialization state
 */
function saveState(values) {
  const state = {
    initialized: true,
    timestamp: new Date().toISOString(),
    values: values,
  };

  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    log.success('Saved initialization state');
  } catch (error) {
    log.warn('Could not save state: ' + error.message);
  }
}

/**
 * Update git remote to use correct repository URL
 */
function updateGitRemote(values) {
  try {
    // Check if git is available
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      log.warn('Git not found, skipping remote update');
      return;
    }

    // Check if we're in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      log.warn('Not a git repository, skipping remote update');
      return;
    }

    // Get current remote URL
    let currentRemote = '';
    try {
      currentRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    } catch {
      // No remote configured yet
    }

    const newRemote = values.repoUrl;

    // Only update if the remote contains placeholder or doesn't exist
    if (
      !currentRemote ||
      currentRemote.includes('YOUR_USERNAME') ||
      currentRemote.includes('USERNAME')
    ) {
      try {
        if (currentRemote) {
          execSync(`git remote set-url origin ${newRemote}`, { stdio: 'ignore' });
          log.success(`Updated git remote: ${newRemote}`);
        } else {
          execSync(`git remote add origin ${newRemote}`, { stdio: 'ignore' });
          log.success(`Added git remote: ${newRemote}`);
        }
      } catch (error) {
        log.warn(`Could not update git remote: ${error.message}`);
      }
    } else {
      log.info(`Git remote already configured: ${currentRemote}`);
    }
  } catch (error) {
    log.warn(`Error updating git remote: ${error.message}`);
  }
}

/**
 * Remove UNINITIALIZED marker
 */
function removeMarker() {
  try {
    if (existsSync(UNINITIALIZED_MARKER)) {
      unlinkSync(UNINITIALIZED_MARKER);
      log.success('Removed UNINITIALIZED marker');
    }
  } catch (error) {
    log.error('Could not remove marker: ' + error.message);
    throw error;
  }
}

/**
 * Display next steps
 */
function showNextSteps() {
  log.header('🎉 Template Initialized Successfully!');

  console.log(`${colors.bright}Next Steps:${colors.reset}\n`);
  console.log(`  1. Install dependencies:`);
  console.log(`     ${colors.cyan}npm ci${colors.reset}\n`);
  console.log(`  2. Verify initialization:`);
  console.log(`     ${colors.cyan}npm run template:check${colors.reset}\n`);
  console.log(`  3. Set up GitHub Secrets (see ${colors.cyan}docs/secrets.md${colors.reset}):`);
  console.log(`     - Go to: Repository Settings → Secrets and variables → Actions`);
  console.log(`     - Add required secrets (CODECOV_TOKEN, etc.)\n`);
  console.log(`  4. Review and customize:`);
  console.log(`     - ${colors.cyan}.env.local${colors.reset} (environment variables)`);
  console.log(`     - ${colors.cyan}.github/CODEOWNERS${colors.reset} (team ownership)`);
  console.log(`     - ${colors.cyan}docs/${colors.reset} (documentation)\n`);
  console.log(`  5. Start development:`);
  console.log(`     ${colors.cyan}npm run dev${colors.reset}\n`);
  console.log(`${colors.bright}Important:${colors.reset}`);
  console.log(
    `  • Never use ${colors.red}npm install${colors.reset} - always use ${colors.green}npm ci${colors.reset}`
  );
  console.log(`  • In CI, use: ${colors.green}npm ci --ignore-scripts${colors.reset}`);
  console.log(
    `  • See ${colors.cyan}docs/npm-scripts-policy.md${colors.reset} for security guidelines\n`
  );
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check if already initialized
    if (isInitialized()) {
      log.info('Template is already initialized.');
      log.info(
        `To re-initialize, delete ${colors.cyan}.template/UNINITIALIZED${colors.reset} and run again.`
      );
      log.info(`Current state: ${colors.cyan}.template/state.json${colors.reset}\n`);
      process.exit(0);
    }

    // Gather input
    const values = await gatherInput();

    // Confirm
    console.log(`\n${colors.bright}Review your selections:${colors.reset}`);
    console.log(JSON.stringify(values, null, 2));
    console.log();

    const confirm = await prompt('Proceed with initialization? (yes/no)', 'yes');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      log.warn('Initialization cancelled.');
      process.exit(0);
    }

    // Process files
    processFiles(values);

    // Create environment file
    createEnvFile();

    // Update git remote
    updateGitRemote(values);

    // Save state
    saveState(values);

    // Remove marker
    removeMarker();

    // Show next steps
    showNextSteps();
  } catch (error) {
    log.error(`Initialization failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
