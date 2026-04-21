# site_kit

Shared web identity kit for k1monfared's sites. Provides CSS and JS files that multiple projects import via URL from GitHub Pages at `https://k1monfared.github.io/site_kit/`.

## Quick Start

Add the base stylesheet and theme script to any HTML page:

```html
<head>
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/base.css">
  <link rel="stylesheet" href="https://k1monfared.github.io/site_kit/css/nav.css">
  <script src="https://k1monfared.github.io/site_kit/js/theme.js"></script>
</head>
```

Include only the components you need. The base CSS is required for variables and resets. All other files are optional.

## Components

### CSS

| File | Purpose |
|------|---------|
| `css/base.css` | CSS variables (dark default, light override), box-sizing reset, body defaults, container, header, typography, images, code, blockquotes, tables, hr, footer, RTL support, responsive breakpoint |
| `css/nav.css` | Nav button and icon sizing, theme toggle styling |
| `css/sidebar.css` | Tag sidebar and timeline sidebar positioning, collapsible details, tag chips |
| `css/lightbox.css` | Fullscreen image lightbox overlay |
| `css/post-nav.css` | Previous/next post navigation bar |

### JS

| File | Purpose |
|------|---------|
| `js/theme.js` | Dark/light theme toggle with localStorage persistence and OS preference detection |
| `js/sidebar.js` | Tag sidebar sorting and timeline sidebar with scroll-to-date. Requires matching HTML structure. |
| `js/lightbox.js` | Click-to-zoom image lightbox. Configurable image selector via data attribute. |
| `js/post-nav.js` | Arrow key and swipe gesture navigation between posts |
| `js/pagination.js` | Infinite scroll pagination with IntersectionObserver. Configurable page size and selectors. |
| `js/icons.js` | Replaces `[data-icon]` elements with inline SVG icons |

### Icons

Reference SVG files in `icons/` for tags, timeline, rss, lock-closed, lock-open, sidebar-open, sidebar-close, menu, and x. These are also available inline via `js/icons.js`. The `grid` and `feed` icons are defined in `icons.js` only.

## HTML Contracts

Each JS module expects specific element IDs or class names to exist in the page markup.

### Theme Toggle

```html
<button id="theme-toggle">
  <span class="theme-icon"></span>
</button>
```

The `.theme-icon` span is optional. If missing, the button's `textContent` is set directly.

### Tag Sidebar

```html
<button id="tag-sidebar-toggle"><span data-icon="tags"></span></button>
<aside id="tag-sidebar" class="tag-sidebar">
  <div class="tag-sidebar-header">
    <h3>Tags</h3>
    <button id="tag-sort" class="tag-sort-btn">A-Z</button>
  </div>
  <details>
    <summary>
      <a href="/tags/example" class="tag-sidebar-link">
        Example <span class="tag-count">5</span>
      </a>
    </summary>
    <a href="/tags/child" class="tag-sidebar-link">
      Child Tag <span class="tag-count">2</span>
    </a>
  </details>
</aside>
```

### Timeline Sidebar

```html
<button id="timeline-sidebar-toggle"><span data-icon="timeline"></span></button>
<aside id="timeline-sidebar" class="timeline-sidebar">
  <div class="timeline-sidebar-header"><h3>Timeline</h3></div>
  <details>
    <summary>
      <span class="timeline-label" data-scroll="2024">2024</span>
    </summary>
    <a href="/post-url" class="timeline-link">
      Post Title <span class="timeline-date">Jan 5</span>
    </a>
  </details>
</aside>
```

The `data-scroll` attribute on `.timeline-label` enables click-to-scroll. It looks for `li[data-year]`, `.grid-item[data-year]`, or `.feed-card[data-year]` elements.

### Lightbox

No special HTML needed. Just include the script after the content you want to make zoomable:

```html
<script src="https://k1monfared.github.io/site_kit/js/lightbox.js"></script>
```

### Post Navigation

```html
<nav class="post-nav">
  <a href="/prev-post" class="post-nav-prev">
    <span class="post-nav-label">Previous</span>
    <span class="post-nav-title">Previous Post Title</span>
  </a>
  <a href="/next-post" class="post-nav-next">
    <span class="post-nav-label">Next</span>
    <span class="post-nav-title">Next Post Title</span>
  </a>
</nav>
```

### Pagination

No special HTML beyond a list container with items. Items beyond the page size should have the `hidden` attribute:

```html
<ul class="post-list">
  <li>Post 1</li>
  <li>Post 2</li>
  <li hidden>Post 11</li>
</ul>
```

### Inline Icons

```html
<span data-icon="tags"></span>
<span data-icon="timeline"></span>
<span data-icon="rss"></span>
<span data-icon="lock-closed"></span>
<span data-icon="lock-open"></span>
<span data-icon="grid"></span>
<span data-icon="feed"></span>
<span data-icon="sidebar-open"></span>
<span data-icon="sidebar-close"></span>
<span data-icon="menu"></span>
<span data-icon="x"></span>
```

All icons are 18x18, use `currentColor` for fill/stroke, and share a stroke-width of 2 with rounded caps and joins for visual consistency.

**For client-rendered apps (React, Vue, etc.):** `icons.js` exposes `window.siteKitRenderIcons(root)` so you can call it after your framework has mounted new DOM. Elements are marked with `data-icon-rendered` after replacement, so subsequent calls are idempotent.

## CSS Variable Overrides

Override any variable on your site by redefining it in your own stylesheet after importing base.css:

```css
:root {
  --container-max-width: 960px;
  --link: #ff6b6b;
  --header-bg: #0d1117;
}
```

The full set of variables is defined in `css/base.css` under `:root` (dark defaults) and `[data-theme="light"]` (light overrides).

## JS Configuration

### lightbox.js

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-lightbox-selector` | `"article img"` | CSS selector for images that open in the lightbox |

Example:

```html
<script src=".../js/lightbox.js" data-lightbox-selector=".gallery img"></script>
```

### pagination.js

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-page-size` | `10` | Number of items to show per page |
| `data-list-selector` | `".post-list"` | CSS selector for the list container |
| `data-item-selector` | `"li"` | CSS selector for list items within the container |

Example:

```html
<script src=".../js/pagination.js" data-page-size="20" data-list-selector=".grid" data-item-selector=".grid-item"></script>
```

## Cross-Site Theme Sharing

All sites under `k1monfared.github.io` share the same `localStorage` origin. The theme preference is stored under the key `'theme'` with a value of `'dark'` or `'light'`. When a visitor picks a theme on any site, that choice carries over to every other site that uses `js/theme.js`.

The theme script runs as an IIFE at parse time (before DOMContentLoaded) to prevent a flash of the wrong theme. It reads from `localStorage` first, falls back to the OS `prefers-color-scheme` media query, and defaults to dark if neither is set.
