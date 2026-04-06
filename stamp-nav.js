#!/usr/bin/env node
// stamp-nav.js — rewrites <ul class="nav__links"> across all HTML files
const fs   = require('fs');
const path = require('path');

const DIR = __dirname;

// All HTML files that need canonical nav (not index.html — it has anchor hrefs)
const OTHER_FILES = [
  'why-alm.html',
  'alm-wheel.html',
  'webinars.html',
  'upcoming-webinars.html',
  'webinar-agile-safe-intro.html',
  'webinar-crack-safe-art.html',
  'webinar-doors-survival-kit.html',
  'webinar-imdrf-compliance.html',
  'webinar-medical-device-design-control.html',
  'webinar-pragmatic-devops.html',
  'webinar-rpa-practical.html',
  'blog-compliance-advantage.html',
  'products.html',
  'product-redline-report-widget.html',
  'product-cvss-calculator.html',
  'product-java21-save-hook.html',
  'industry-aerospace.html',
  'industry-automotive.html',
  'industry-medical-devices.html',
  'industry-oil-gas.html',
];

// Pages where the Webinars dropdown link should be "active"
const WEBINAR_PAGES = new Set([
  'webinars.html',
  'upcoming-webinars.html',
  'webinar-agile-safe-intro.html',
  'webinar-crack-safe-art.html',
  'webinar-doors-survival-kit.html',
  'webinar-imdrf-compliance.html',
  'webinar-medical-device-design-control.html',
  'webinar-pragmatic-devops.html',
  'webinar-rpa-practical.html',
]);

function buildNav(file) {
  const isWhy  = file === 'why-alm.html';
  const isAlm  = file === 'alm-wheel.html';
  const isWeb  = WEBINAR_PAGES.has(file);
  const isBlog = file === 'blog-compliance-advantage.html';
  const isProd = file === 'products.html' ||
                 file === 'product-redline-report-widget.html' ||
                 file === 'product-cvss-calculator.html' ||
                 file === 'product-java21-save-hook.html';

  const a = (cls) => cls ? ` ${cls}` : '';

  return `<ul class="nav__links" id="navLinks">
        <li><a href="index.html#services" class="nav__link">Services</a></li>
        <li><a href="index.html#industries" class="nav__link">Industries</a></li>
        <li><a href="why-alm.html" class="nav__link${a(isWhy ? 'active' : '')}">Why ALM</a></li>
        <li><a href="alm-wheel.html" class="nav__link${a(isAlm ? 'active' : '')}">ALM Platform</a></li>
        <li><a href="index.html#about" class="nav__link">About</a></li>
        <li><a href="index.html#process" class="nav__link">Process</a></li>
        <li><a href="index.html#contact" class="nav__link">Contact</a></li>
        <li class="nav__dropdown">
          <a href="webinars.html" class="nav__link nav__dropdown-link${a(isWeb ? 'active' : '')}">Webinars <svg class="nav__caret" viewBox="0 0 10 6" fill="none" width="10" height="10"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
          <ul class="nav__submenu">
            <li><a href="webinars.html">Recorded Webinars</a></li>
            <li><a href="upcoming-webinars.html">Upcoming Webinars</a></li>
          </ul>
        </li>
        <li><a href="blog-compliance-advantage.html" class="nav__link${a(isBlog ? 'active' : '')}">Blog</a></li>
        <li class="nav__dropdown">
          <a href="products.html" class="nav__link nav__dropdown-link${a(isProd ? 'active' : '')}">Products <svg class="nav__caret" viewBox="0 0 10 6" fill="none" width="10" height="10"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
          <ul class="nav__submenu">
            <li><a href="product-redline-report-widget.html">Redline Report Widget</a></li>
            <li><a href="product-cvss-calculator.html">CVSS Calculator <span class="nav__coming-soon">Soon</span></a></li>
            <li><a href="product-java21-save-hook.html">Java 21 Save Hook <span class="nav__coming-soon">Soon</span></a></li>
          </ul>
        </li>
      </ul>`;
}

// Regex to match the nav__links ul block (non-greedy, dotAll)
const NAV_RE = /<ul class="nav__links"[^>]*>[\s\S]*?<\/ul>/;

let changed = 0;
for (const file of OTHER_FILES) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) { console.warn(`SKIP (not found): ${file}`); continue; }
  const orig = fs.readFileSync(fp, 'utf8');
  const replacement = buildNav(file);
  if (!NAV_RE.test(orig)) { console.warn(`SKIP (no nav__links ul): ${file}`); continue; }
  const updated = orig.replace(NAV_RE, replacement);
  if (updated === orig) { console.log(`UNCHANGED: ${file}`); continue; }
  fs.writeFileSync(fp, updated, 'utf8');
  console.log(`UPDATED: ${file}`);
  changed++;
}

// Handle index.html separately — uses anchor hrefs for same-page sections
const indexPath = path.join(DIR, 'index.html');
const indexOrig = fs.readFileSync(indexPath, 'utf8');
const indexNav = `<ul class="nav__links" id="navLinks">
        <li><a href="#services" class="nav__link">Services</a></li>
        <li><a href="#industries" class="nav__link">Industries</a></li>
        <li><a href="why-alm.html" class="nav__link">Why ALM</a></li>
        <li><a href="alm-wheel.html" class="nav__link">ALM Platform</a></li>
        <li><a href="#about" class="nav__link">About</a></li>
        <li><a href="#process" class="nav__link">Process</a></li>
        <li><a href="#contact" class="nav__link">Contact</a></li>
        <li class="nav__dropdown">
          <a href="webinars.html" class="nav__link nav__dropdown-link">Webinars <svg class="nav__caret" viewBox="0 0 10 6" fill="none" width="10" height="10"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
          <ul class="nav__submenu">
            <li><a href="webinars.html">Recorded Webinars</a></li>
            <li><a href="upcoming-webinars.html">Upcoming Webinars</a></li>
          </ul>
        </li>
        <li><a href="blog-compliance-advantage.html" class="nav__link">Blog</a></li>
        <li class="nav__dropdown">
          <a href="products.html" class="nav__link nav__dropdown-link">Products <svg class="nav__caret" viewBox="0 0 10 6" fill="none" width="10" height="10"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
          <ul class="nav__submenu">
            <li><a href="product-redline-report-widget.html">Redline Report Widget</a></li>
            <li><a href="product-cvss-calculator.html">CVSS Calculator <span class="nav__coming-soon">Soon</span></a></li>
            <li><a href="product-java21-save-hook.html">Java 21 Save Hook <span class="nav__coming-soon">Soon</span></a></li>
          </ul>
        </li>
      </ul>`;
const indexUpdated = indexOrig.replace(NAV_RE, indexNav);
if (indexUpdated !== indexOrig) {
  fs.writeFileSync(indexPath, indexUpdated, 'utf8');
  console.log('UPDATED: index.html');
  changed++;
} else {
  console.log('UNCHANGED: index.html');
}

// alm-wheel.html has its own inline style — handle same as other pages (already in OTHER_FILES)

console.log(`\nDone. ${changed} file(s) updated.`);
