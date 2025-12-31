# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # TypeScript check + Vite build (ALWAYS run before pushing)
npm run preview      # Preview production build locally
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Interactive test UI
```

## Architecture Overview

### Tech Stack
- **React 19 + Vite + TypeScript** - Core framework
- **Mantine 8** (CSS modules mode) - Component library
- **react-markdown** - Article rendering
- **Vitest + happy-dom** - Unit testing

### Core Feature: Energy Level System

Users select their reading energy (tired/medium) which affects article presentation:
- **EnergyLevelContext** (`src/context/`) - Global state with localStorage persistence
- **EnergyLevelIndicator** - Dropdown in navbar for selection
- **EnergyLevelSplash A/B** - Onboarding screens for first-time users
- **SlideshowView** - Slide-based presentation for tired mode

Articles can have tone variants stored in `tones.json`:
```json
{
  "tired": { "format": "slides", "slides": ["# Slide 1", "# Slide 2"] },
  "medium": "Balanced markdown content..."
}
```

### Blog System

**Content location (runtime-fetched):**
```
public/data/blog/{slug}/
├── article.md       # Default/medium article content
├── meta.json        # { title, date, category, videoId, published, excerpt }
└── tones.json       # Optional: tired/medium variants
```

**Assets location:**
```
public/blog/{slug}/
└── *.jpg           # Hero and article images
```

**Manifest:** `public/data/blog/index.json` - Array of all blog slugs, MUST be updated when adding articles

### Routing

```
/                    → BlogHome (article listing)
/blog/:slug          → BlogPost (individual article)
/about               → About page
```

Layout wrapper in `App.tsx` applies Navbar, EnergyLevelSplash, and Footer to all routes.

## Steering Rules

### Design System

**OVERRIDE:** Using Mantine (CSS modules mode) instead of custom tokens-only approach
- Still use `tokens.css` for custom values not covered by Mantine
- Rationale: Prevent formatting breakage during iteration

### Article Generation from Raw YouTube Data

**Input:** `scrapes/{video-slug}/`
- `metadata.json` - YouTube metadata (id, title, formats, thumbnail URLs)
- `video-context.json` - AI summary, topics
- `transcript.txt` - Full video transcript
- `screenshots/` - Timestamped images (00-01-15.jpg, etc.)

**Output:** Two mirrored folders:
1. **Content:** `public/data/blog/{slug}/` - article.md, meta.json
2. **Assets:** `public/blog/{slug}/` - Images (folder name MUST match content folder)

**meta.json structure:**
```json
{
  "title": "Short Title (avoid full width on mobile)",
  "date": "YYYY-MM-DD",
  "category": "health|finance|technology|education",
  "videoId": "YouTube video ID",
  "published": true,
  "excerpt": "1-2 sentence summary for blog listing"
}
```

**Categories:** finance, health, technology, education

**Publishing workflow:**
1. Raw data generated externally → `scrapes/{video-slug}/`
2. Run `/generate-article` skill → creates curated output
3. Copy to publish locations
4. Add slug to `public/data/blog/index.json`
5. Set `published: true` in meta.json
6. Run `npm run build` to verify

**YouTube Attribution (CRITICAL):** Every article MUST include attribution section at the bottom with creator credit, video thumbnail, and YouTube link.

### Netlify Deployment

**Issue 1: TypeScript build failures**
- `tsc -b` checks ALL .ts/.tsx files, even unused ones
- Delete obsolete files immediately after refactoring

**Issue 2: Runtime data paths**
- `fetch('/src/data/...')` works in dev but 404s in production
- Runtime-fetched data MUST live in `/public/` directory (not `/src/`)

**Pre-deployment checklist:**
1. Run `npm run build` locally
2. Check all `fetch()` calls reference `/public/` paths (without "/src/")
3. Delete obsolete/unused component files
4. Test with `npm run preview`

### Git Commit Policy

**Size limits:**
- Source code: < 200 lines per commit
- Configuration/data files: No limit

**Rules:**
- Each commit = ONE logical change
- Use semantic prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `content:`

### Chrome DevTools MCP Server

Use `mcp__chrome-devtools__*` tools for browser testing:
```
1. navigate_page(url: "http://localhost:5173")
2. take_snapshot() - get page structure with uids
3. click(uid: "...") - interact with elements
4. list_console_messages() - check for errors
5. take_screenshot() - visual confirmation
```

## Documentation

- `docs/spec.md` - Technical specification and requirements
- `.claude/commands/` - Claude Code skill definitions (generate-article, backfill-energy-variants)
