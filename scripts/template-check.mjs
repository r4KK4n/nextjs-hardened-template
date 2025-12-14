#!/usr/bin/env node

/**
 * Template Verification Script
 * 
 * This script verifies that the template has been properly initialized by checking for:
 * 1. Absence of UNINITIALIZED marker
 * 2. No remaining placeholder tokens in the codebase
 * 3. Required files exist
 * 
 * Used in CI to prevent uninitialized templates from passing tests.
 * 
 * Exit codes:
 * - 0: All checks passed
 * - 1: Template is not initialized or placeholders remain
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, sep } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

// Configuration
const UNINITIALIZED_MARKER = join(ROOT_DIR, '.template', 'UNINITIALIZED');
const TEXT_EXTENSIONS = ['.md', '.txt', '.json', '.yml', '.yaml', '.ts', '.tsx', '.js', '.mjs', '.css'];
const EXCLUDE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', '.template'];
const EXCLUDE_FILES = [
  'template-init.mjs',
  'template-check.mjs',
  'PLACEHOLDERS.md',
  'pnpm-lock.yaml',
  'package-lock.json',
];

// Placeholder patterns to check
const PLACEHOLDER_PATTERNS = [
  // Standard format
  /__[A-Z_]+__/g,
  
  // Legacy placeholders (as whole words)
  /\bPROJECT_NAME\b/g,
  /\bDESCRIPTION\b/g,
  /\bAUTHOR\b/g,
  /\bUSERNAME\/REPO_NAME\b/g,
  /\bYOUR_DOMAIN\b/g,
  /\bSUPPORT_EMAIL@example\.com\b/g,
  /\bSECURITY_EMAIL@example\.com\b/g,
];

/**
 * Check if template is initialized
 */
function checkInitializationMarker() {
  if (existsSync(UNINITIALIZED_MARKER)) {
    log.error('Template is not initialized!');
    log.error(`Found marker file: ${colors.cyan}.template/UNINITIALIZED${colors.reset}`);
    log.error('\nTo initialize the template, run:');
    log.error(`  ${colors.cyan}npm run template:init${colors.reset}\n`);
    return false;
  }
  
  log.success('Initialization marker removed');
  return true;
}

/**
 * Check if file should be scanned
 */
function shouldScanFile(filePath) {
  const filename = filePath.split(sep).pop();
  
  // Skip excluded files
  if (EXCLUDE_FILES.includes(filename)) {
    return false;
  }
  
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
    if (EXCLUDE_DIRS.some(excluded => relativePath.startsWith(excluded))) {
      continue;
    }

    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTextFiles(fullPath, files);
    } else if (stat.isFile() && shouldScanFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Find placeholders in content
 */
function findPlaceholders(content) {
  const found = new Set();

  for (const pattern of PLACEHOLDER_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      found.add(match[0]);
    }
  }

  return Array.from(found);
}

/**
 * Scan files for remaining placeholders
 */
function scanForPlaceholders() {
  log.header('🔍 Scanning for placeholders...');

  const files = findTextFiles(ROOT_DIR);
  const issues = [];

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const placeholders = findPlaceholders(content);

      if (placeholders.length > 0) {
        const relativePath = filePath.replace(ROOT_DIR + sep, '');
        
        // Find line numbers for each placeholder
        const lines = content.split('\n');
        const details = [];

        for (const placeholder of placeholders) {
          lines.forEach((line, index) => {
            if (line.includes(placeholder)) {
              details.push({
                line: index + 1,
                placeholder: placeholder,
                content: line.trim().substring(0, 80),
              });
            }
          });
        }

        issues.push({
          file: relativePath,
          placeholders: details,
        });
      }
    } catch (error) {
      // Ignore read errors (binary files, permission issues, etc.)
    }
  }

  return issues;
}

/**
 * Display placeholder issues
 */
function displayIssues(issues) {
  if (issues.length === 0) {
    return;
  }

  log.error(`Found ${issues.length} file(s) with placeholders:\n`);

  for (const issue of issues) {
    console.log(`${colors.red}✗${colors.reset} ${colors.cyan}${issue.file}${colors.reset}`);
    
    for (const detail of issue.placeholders) {
      console.log(`  Line ${detail.line}: ${colors.yellow}${detail.placeholder}${colors.reset}`);
      console.log(`    ${colors.reset}${detail.content}${colors.reset}`);
    }
    console.log();
  }
}

/**
 * Check for required files
 */
function checkRequiredFiles() {
  log.header('📋 Checking required files...');

  const requiredFiles = [
    'package.json',
    'README.md',
    '.env.example',
    '.gitignore',
    'tsconfig.json',
  ];

  let allExist = true;

  for (const file of requiredFiles) {
    const filePath = join(ROOT_DIR, file);
    if (existsSync(filePath)) {
      log.success(`Found: ${file}`);
    } else {
      log.error(`Missing: ${file}`);
      allExist = false;
    }
  }

  return allExist;
}

/**
 * Main execution
 */
async function main() {
  try {
    log.header('🔐 Template Verification');

    let allChecksPassed = true;

    // Check 1: Initialization marker
    if (!checkInitializationMarker()) {
      allChecksPassed = false;
    }

    // Check 2: Required files
    if (!checkRequiredFiles()) {
      allChecksPassed = false;
    }

    // Check 3: Placeholder scan
    const issues = scanForPlaceholders();
    
    if (issues.length > 0) {
      displayIssues(issues);
      log.error('Placeholders detected! Template initialization is incomplete.\n');
      log.info('To fix:');
      log.info(`  1. Run: ${colors.cyan}npm run template:init${colors.reset}`);
      log.info(`  2. Manually search and replace any remaining placeholders`);
      log.info(`  3. Run this check again: ${colors.cyan}npm run template:check${colors.reset}\n`);
      allChecksPassed = false;
    } else {
      log.success('No placeholders found');
    }

    // Final result
    console.log();
    if (allChecksPassed) {
      log.success(`${colors.bright}All checks passed! ✓${colors.reset}`);
      log.info('Template is properly initialized and ready for development.\n');
      process.exit(0);
    } else {
      log.error(`${colors.bright}Checks failed! ✗${colors.reset}`);
      log.error('Please fix the issues above and run this check again.\n');
      process.exit(1);
    }

  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
