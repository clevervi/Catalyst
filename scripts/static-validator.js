#!/usr/bin/env node
/*
 Static asset and link validator for Catalyst HR System
 Scans all HTML files and verifies that local links and assets exist.
*/

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const htmlDirs = [projectRoot, path.join(projectRoot, 'pages')];

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and uploads
      if (entry.name === 'node_modules' || entry.name === 'uploads') continue;
      walk(fullPath, acc);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function isExternal(link) {
  return (
    /^https?:\/\//i.test(link) ||
    /^\/\//.test(link) ||
    /^mailto:/i.test(link) ||
    /^tel:/i.test(link) ||
    /^javascript:/i.test(link) ||
    /^#/.test(link) ||
    /^data:/i.test(link)
  );
}

function normalize(link) {
  // Trim quotes/spaces
  return link.trim();
}

function validateHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const issues = [];

  // capture src and href attributes
  const attrRegex = /(src|href)=("|')(.*?)(\2)/gi;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    const url = normalize(match[3]);
    if (!url || isExternal(url)) continue;
    // Ignore template expressions like ${...}
    if (url.includes('${')) continue;

    let resolved;
    if (url.startsWith('/')) {
      // absolute from project root
      resolved = path.join(projectRoot, url.slice(1));
    } else {
      resolved = path.resolve(dir, url);
    }

    // If URL has query/hash, strip it
    const cleanResolved = resolved.split('?')[0].split('#')[0];

    if (!fs.existsSync(cleanResolved)) {
      issues.push({ attribute: match[1], url, resolved: cleanResolved });
    }
  }

  return issues;
}

function main() {
  const htmlFiles = htmlDirs.flatMap(d => (fs.existsSync(d) ? walk(d) : []));
  let totalIssues = 0;
  const report = [];

  for (const file of htmlFiles) {
    const issues = validateHtmlFile(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      report.push({ file, issues });
    }
  }

  if (report.length === 0) {
    console.log('✅ No broken local links or assets found.');
    process.exit(0);
  }

  console.log('⚠️ Detected broken local links/assets:');
  for (const item of report) {
    console.log(`\n  ${path.relative(projectRoot, item.file)}:`);
    for (const issue of item.issues) {
      console.log(`   - ${issue.attribute}="${issue.url}" → Missing: ${path.relative(projectRoot, issue.resolved)}`);
    }
  }

  console.log(`\nTotal issues: ${totalIssues}`);
  process.exit(1);
}

if (require.main === module) {
  main();
}

