# Plan: Create `site_kit` shared web identity repo

## Context

Multiple web projects (blog, photoblog, news_reader, personal site) duplicate the same UI components: dark/light theme toggle, CSS color variables, nav icon SVGs, sidebar behavior, lightbox, post navigation, and pagination. When one is updated (e.g., new icon style), all others must be manually synced. A shared repo deployed to GitHub Pages would let all projects import CSS and JS via URL, so a single change propagates everywhere.

## Repo: `site_kit`

Standalone public repo at `github.com/k1monfared/site_kit` (not under the personal site repo). With GitHub Pages enabled on `main` branch, files are served at `https://k1monfared.github.io/site_kit/`. No build step needed. GitHub Pages serves the source files directly.

## Key Design Decisions

1. **Dark mode is the default.** `:root` defines dark palette, `[data-theme="light"]` overrides with light. All projects must be migrated to this convention.
2. **Blog color palette is the base.** Blog's colors are the defaults in `base.css`. Other projects override in their own CSS.
3. **Blog/photoblog variable names used everywhere** (`--bg`, `--text`, `--link`, `--border`, etc.). News reader (`--bg-primary`, `--accent`) and personal site (`--bg-primary`, `--link-default`) must adopt these names.
4. **Theme applied immediately in `<head>`** (before DOM renders) to prevent FOUC. The shared `theme.js` runs its IIFE at parse time, setting `data-theme` on `<html>` before the body is parsed.
5. **Cross-site theme sharing via localStorage.** All sites live under `k1monfared.github.io` (same origin), so they share the same localStorage. Setting theme on the blog automatically applies to photoblog, personal site, and news reader. All sites use the same key: `localStorage.getItem('theme')`. No cookies needed.

## Structure

```
site_kit/
  css/
    base.css          # CSS variables, reset, typography, body defaults, theme toggle styling
    nav.css           # Nav button sizing/styling (34px squares, hover states)
    sidebar.css       # Tag sidebar + timeline sidebar positioning, open/close, details styling
    lightbox.css      # Fullscreen overlay styles
    post-nav.css      # Prev/next navigation bar
  js/
    theme.js          # Dark/light toggle (localStorage + system pref, FOUC prevention)
    sidebar.js        # Tag + timeline sidebar: toggle, sort, sessionStorage persistence
    lightbox.js       # Click image to fullscreen (configurable selector)
    post-nav.js       # Arrow key + swipe navigation between posts
    pagination.js     # Infinite scroll via IntersectionObserver (configurable page size)
    icons.js          # Optional: injects SVG icons into [data-icon] elements
  icons/              # Reference SVG files (documentation, not loaded at runtime)
    tags.svg
    timeline.svg
    rss.svg
    lock-closed.svg
    lock-open.svg
  README.md           # Usage docs, HTML contracts for each component, migration guide
```

## CSS Design

### Dark mode default, light mode override

```css
:root {
  /* Base palette: dark mode (default) */
  --bg-dark: #1a1a2e;  --text-dark: #e0e0e0;
  --bg-light: #fff;  --text-light: #222;

  --bg: var(--bg-dark);  --text: var(--text-dark);
  --toggle-bg: var(--bg-light);  --toggle-text: var(--text-light);
  --text-muted: #999;
  --link: #58a6ff;  --link-hover: #79c0ff;
  --border: #30363d;
  --code-bg: #161b22;
  --header-bg: #16213e;
  --blockquote-border: #3b4048;
  --blockquote-text: #8b949e;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-size: 17px;  --line-height: 1.7;

  /* Layout */
  --container-max-width: 720px;  --container-padding: 1.5rem;
  --nav-button-size: 34px;  --nav-button-radius: 6px;
}

[data-theme="light"] {
  --bg: var(--bg-light);  --text: var(--text-light);
  --toggle-bg: var(--bg-dark);  --toggle-text: var(--text-dark);
  --text-muted: #666;
  --link: #0366d6;  --link-hover: #0550ae;
  --border: #e1e4e8;
  --code-bg: #f6f8fa;
  --header-bg: #fafbfc;
  --blockquote-border: #dfe2e5;
  --blockquote-text: #6a737d;
}

/* + box-sizing reset, smooth scroll, body defaults, transition on bg/color */
```

### Projects override by loading their own CSS after base.css:
```css
/* photoblog/static/style.css */
:root {
  --bg-dark: #000;  --text-dark: #f5f5f5;
  --bg-light: #fafafa;  --text-light: #262626;
  --link: #0095f6;  --container-max-width: 975px;
}
[data-theme="light"] { --link: #0095f6; /* ... */ }
/* ...photoblog-specific styles only... */
```

### Migration impact on each project

**Blog**: Currently uses `[data-theme="dark"]` override. Must flip to `:root` = dark, `[data-theme="light"]` = light override. CSS variable names stay the same.

**Photoblog**: Same flip as blog. Variable names stay the same.

**News Reader**: Already uses dark default. Variable names change from `--bg-primary` to `--bg`, `--text-primary` to `--text`, `--accent` to `--link`, etc.

**Personal Site**: Already uses dark default. Variable names change from `--bg-primary` to `--bg`, `--text-primary` to `--text`, `--link-default` to `--link`. Extra variables like `--bg-nav`, `--bg-gradient-1/2/3` remain project-local.

## JS Design

All files are standalone IIFEs, loaded via `<script>` tags. No ES modules, no bundler.

### `theme.js` (loaded in `<head>`, no `defer`)
- Runs immediately at parse time (IIFE at top level, not inside DOMContentLoaded)
- Reads `localStorage.getItem('theme')`, falls back to `prefers-color-scheme`, defaults to no attribute (dark is `:root` default)
- Sets `data-theme="light"` on `<html>` only if user chose light, otherwise leaves it unset (dark default)
- On DOMContentLoaded, wires `#theme-toggle` click handler
- Updates button text: finds `.theme-icon` child if present, else sets `textContent` directly
- Listens for `prefers-color-scheme` media query changes (live updates if no explicit preference saved)
- All sites under k1monfared.github.io share localStorage, so theme choice on one site applies to all

### `sidebar.js`
- Looks for `#tag-sidebar-toggle` + `#tag-sidebar`, wires toggle/sort/persist
- Looks for `#timeline-sidebar-toggle` + `#timeline-sidebar`, wires toggle/persist/scroll-to-date
- Mutual exclusion: opening one closes the other
- All state via `sessionStorage`
- Scroll-to-date supports both blog selectors (`li[data-year]`) and photoblog selectors (`.grid-item[data-year]`, `.feed-card[data-year]`)
- Source: blog's current `sidebar.js` (189 lines, already handles both)

### `lightbox.js`
- Base lightbox only (click image, fullscreen overlay, close on click/Escape)
- Configurable selector via `data-lightbox-selector` attribute on the script tag
- Default: `"article img, .post-body img"`
- Photoblog loads this + its own carousel extension

### `post-nav.js`
- Arrow key + swipe navigation, looks for `.post-nav-prev` and `.post-nav-next`
- 31 lines, identical in blog and photoblog, copy as-is

### `pagination.js`
- IntersectionObserver pattern, configurable via `data-page-size`, `data-list-selector`, `data-item-selector`
- Defaults: page size 10, `.post-list`, `li`

### `icons.js` (optional)
- Contains SVG strings mapped to names (tags, timeline, rss, lock-closed, lock-open, grid, feed)
- On DOMContentLoaded, finds all `[data-icon]` elements and sets `innerHTML`
- Projects can use this or keep inline SVGs in templates

## How Each Project Consumes It

### Blog (`notes/blog/templates/base.html`)
```html
<head>
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/base.css">
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/nav.css">
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/sidebar.css">
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/lightbox.css">
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/post-nav.css">
  <link rel="stylesheet" href="static/style.css"> <!-- blog-specific overrides -->
  <script src="https://k1monfared.github.io/site_kit/js/theme.js"></script>
</head>
<body>
  ...
  <script src="https://k1monfared.github.io/site_kit/js/sidebar.js"></script>
  <script src="https://k1monfared.github.io/site_kit/js/lightbox.js"></script>
  <script src="https://k1monfared.github.io/site_kit/js/post-nav.js"></script>
  <script src="https://k1monfared.github.io/site_kit/js/pagination.js"></script>
  <script src="static/edit-online.js"></script>
</body>
```
Uses: base, nav, sidebar, lightbox, post-nav, pagination, theme

### Photoblog
Same as blog, plus its own `viewtoggle.js`, `lightbox-carousel.js`, `editor.js`
Uses: base, nav, sidebar, lightbox (base), post-nav, pagination, theme

### News Reader
```html
<link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/base.css">
<link rel="stylesheet" href="assets/css/style.css">
<script src="https://k1monfared.github.io/site_kit/js/theme.js"></script>
```
Uses: base, theme only

### Personal Site
```html
<script src="https://k1monfared.github.io/site_kit/js/theme.js"></script>
<link rel="stylesheet" href="css/mainCSS.css">
```
Uses: theme only (can adopt more later). Remove existing inline theme script and cookie-based `theme-toggle.js`.

## Implementation Steps

### Step 1: Create the `site_kit` repo
- Create `/home/k1/public/site_kit/`, git init, `gh repo create site_kit --public`
- Enable GitHub Pages on `main` branch
- Verify files are accessible at `https://k1monfared.github.io/site_kit/`

### Step 2: Build the CSS files
- Write `base.css`: dark-default variables, reset, typography, body defaults (extracted from blog's `style.css`, flipped to dark default)
- Write `nav.css`: nav button/icon styling, theme toggle button (from blog's style.css lines 80-110)
- Write `sidebar.css`: tag + timeline sidebar (from blog's style.css lines ~509-791)
- Write `lightbox.css`: overlay styles (from blog's style.css lightbox section)
- Write `post-nav.css`: prev/next bar (from blog's style.css post-nav section)

### Step 3: Build the JS files
- Write `theme.js`: unified version with immediate apply, localStorage shared key, `.theme-icon` support
- Copy blog's `sidebar.js` with minor adaptation for photoblog selectors
- Adapt blog's `lightbox.js` with configurable selector via data attribute
- Copy blog's `post-nav.js` as-is
- Adapt blog's `pagination.js` with configurable data attributes

### Step 4: Create `icons.js`
- Map icon names to SVG strings from blog's `base.html`

### Step 5: Write README.md
- Document each component, its HTML contract, and configuration options
- Include migration guide for each project

### Step 6: Migrate blog
- Flip CSS from light-default to dark-default (`:root` = dark, `[data-theme="light"]` = light)
- Update `templates/base.html` to reference site_kit URLs
- Trim `static/style.css` to blog-specific overrides only
- Remove local copies of `theme.js`, `sidebar.js`, `lightbox.js`, `post-nav.js`, `pagination.js`
- Test locally and deploy

### Step 7: Migrate photoblog
- Same flip and reference updates
- Keep photoblog-specific files (viewtoggle, carousel, editor)

### Step 8: Migrate news_reader
- Rename CSS variables to blog convention (`--bg-primary` to `--bg`, etc.)
- Reference `base.css` and `theme.js` from site_kit
- Remove local `theme.js`

### Step 9: Migrate personal site
- Remove inline theme script from `<head>` and `js/theme-toggle.js`
- Add `<script src="site_kit/js/theme.js">` in `<head>`
- Rename CSS variables to blog convention
- Remove cookie-based theme storage (localStorage covers it, shared across all k1monfared.github.io pages)

## Cross-site Theme Sharing

All sites are subpaths of `https://k1monfared.github.io/`:
- `/` (personal site)
- `/notes/blog/` (blog)
- `/photoblog/` (photoblog)
- `/news_reader/` (news reader)

They share the same origin, so `localStorage` is shared. The shared `theme.js` uses `localStorage.getItem('theme')` / `localStorage.setItem('theme', ...)` with the key `'theme'`. When a visitor sets dark mode on the blog, it persists to photoblog, news reader, and personal site automatically.

No cookies are needed. Cookies would only be necessary for cross-domain sharing (different origins), but all sites are on the same origin.

## Verification

1. After creating site_kit and enabling Pages, verify files are accessible:
   `curl -I https://k1monfared.github.io/site_kit/css/base.css`
2. After migrating blog: build locally with `python blog/build.py --local`, serve, verify:
   - Theme toggle works (persists across page loads)
   - Tag and timeline sidebars open/close/sort correctly
   - Lightbox works on post images
   - Post navigation works (arrow keys, swipe)
   - Pagination loads more posts on scroll
   - Dark mode is the default (no FOUC)
3. After migrating photoblog: same checks plus grid/feed toggle, carousel modal
4. Cross-site test: set theme to light on blog, navigate to photoblog, verify it loads in light mode
5. Check that changing a variable in site_kit's `base.css` (e.g. `--border` color) propagates to all consuming sites after GitHub Pages cache clears (~10 min)
