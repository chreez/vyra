# Vyra - Project Specification

**Last Updated:** 2024-11-17
**Status:** POC Phase
**Template:** React + Vite Help/Guide Websites

---

## Project Overview

Vyra is a personal website that will host multiple utilities, starting with a blog that creates summaries of YouTube videos. The blog presents video content in a readable article format for videos that tend to drag on too long.

**Current Phase:** POC (Proof of Concept)
- No automated tests yet
- Manual browser testing only
- Local development focus
- Ready for Netlify deployment when sharing

---

## Tech Stack

### Core (Template-Compliant)
- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling

### Design System (OVERRIDE)
- **Mantine** (CSS modules mode) - Opinionated component library
  - ⚠️ **Deviation from template:** Template forbids CSS frameworks, but Mantine prevents formatting breakage during iteration
  - Still using `tokens.css` for custom values not covered by Mantine
  - Using CSS modules mode (not CSS-in-JS)

### Additional Libraries
- **react-markdown** - Markdown rendering for articles
- **@tabler/icons-react** - Icon set (Mantine's recommended icons)

### Deployment
- **Netlify** - Free tier deployment
- Static site (no backend)
- SPA redirects configured

---

## Design System

### Layout Philosophy
- **NYTimes-style editorial design** - No cards, clean typography, minimal aesthetic
- **White background (#ffffff)** with dark text (#121212) for maximum readability
- **Typography hierarchy:**
  - Headlines: Cheltenham/Georgia serif
  - Body: Georgia serif (1.125rem, line-height 1.8)
  - Metadata: Helvetica Neue sans-serif
- **Max content width:** 680px for articles, responsive grid for lists

### Design Tokens
Located in `src/styles/tokens.css`:
- Spacing: xs/sm/md/lg/xl (4px to 48px)
- Colors: accent-primary/secondary, text, bg, border
- Shadows: sm/md/lg
- Border radius: sm/md/lg
- Typography: font families, sizes
- Transitions: fast/base

**Rule:** Always use tokens (`var(--spacing-md)`) instead of hardcoded values

---

## Blog System Architecture

### Content Workflow
1. **External generation:** Raw YouTube data → `/Users/chris/workspace/youtube-image-grabber/{video-slug}/`
   - `metadata.json` - YouTube metadata (id, title, formats, thumbnail URLs)
   - `video-context.json` - AI summary, topics
   - `transcript.txt` - Full video transcript
   - `screenshots/` - Timestamped images (00-01-15.jpg, etc.)

2. **LLM processing:** Raw data → article in target structure (manual/external process)

3. **Article storage:** Mirrored folder structure in vyra project:
   ```
   src/data/blog/{slug}/
     ├── article.md        # Frontmatter + markdown body
     └── meta.json         # { title, date, category, videoId, published }

   public/blog/{slug}/
     ├── hero.jpg          # Hero image
     ├── screenshot-1.jpg  # Supporting images
     └── screenshot-2.jpg
   ```

4. **Display:** Website shows only published articles (`published: true` in meta.json)

### Folder Naming Convention
**CRITICAL:** Folder names in `src/data/blog/` and `public/blog/` **must exactly match**

### Image References
In article.md, reference images using absolute paths:
```markdown
![Description](/blog/{slug}/hero.jpg)
```

### YouTube Attribution (CRITICAL)
All articles **must include** attribution at the bottom:
- Credit to original creator
- Clickable thumbnail linking to video
- YouTube URL (using videoId from meta.json)
- **Note:** Use thumbnail + link (embeds don't work)

**Example:**
```markdown
---

## Source

This guide is based on the video by [Creator Name].

[![Video Title](thumbnail-url)](https://youtube.com/watch?v={videoId})

[Watch the original video →](https://youtube.com/watch?v={videoId})
```

---

## File Structure

```
vyra/
├── docs/
│   └── spec.md                    # This file - single source of truth
├── public/
│   └── blog/{slug}/               # Article assets (images)
├── src/
│   ├── components/                # Reusable UI components (future)
│   ├── data/
│   │   └── blog/{slug}/           # Article content (md + meta.json)
│   ├── pages/
│   │   ├── BlogHome.tsx           # Article list
│   │   ├── BlogHome.module.css
│   │   ├── BlogPost.tsx           # Individual article view
│   │   └── BlogPost.module.css
│   ├── styles/
│   │   ├── tokens.css             # Design tokens
│   │   └── global.css             # Base styles
│   ├── App.tsx                    # Router setup
│   ├── main.tsx                   # Mantine provider
│   └── vite-env.d.ts              # CSS module types
├── CLAUDE.md                      # Steering rules for Claude Code
├── netlify.toml                   # Deployment config
└── package.json
```

---

## Routing

- `/` → BlogHome (article list)
- `/blog` → BlogHome (same as root)
- `/blog/:slug` → BlogPost (individual article)

**SPA Configuration:** Netlify redirects all routes to `/index.html` for client-side routing

---

## Components

### BlogHome (`src/pages/BlogHome.tsx`)
- Displays list of published articles
- Reads posts array (currently hardcoded, future: dynamic)
- NYTimes-style layout: category, date, title, excerpt
- No images on list page (text-focused)
- Filters by `published: true` in meta.json

### BlogPost (`src/pages/BlogPost.tsx`)
- Fetches `article.md` and `meta.json` from `src/data/blog/{slug}/`
- Strips frontmatter from markdown (between `---` markers)
- Renders markdown with `react-markdown`
- Shows: category, title, date, full article content
- Back navigation link to homepage
- 404 handling for missing posts

---

## Template Compliance

### Following Template Rules ✅
- React 19 + Vite + TypeScript
- CSS Modules for scoped styles
- Design tokens in `tokens.css`
- No CSS-in-JS libraries
- No state management libraries (Redux/Zustand)
- No testing frameworks during POC
- Small, logical git commits
- Manual browser testing
- Netlify deployment ready
- Minimal dependencies (~146 packages)

### Template Deviations ⚠️
1. **Using Mantine** - Template forbids CSS frameworks
   - **Rationale:** Prevents formatting breakage during iteration
   - Using CSS modules mode (not CSS-in-JS)
   - Still using tokens.css for custom values

---

## Development Workflow

### Current (POC Phase)
```bash
npm run dev         # Start dev server (http://localhost:5175)
# Manual testing in browser
git add -A && git commit -m "..." && git push
```

### Browser Testing
- Use Chrome DevTools MCP server for testing
- Workflow: navigate → snapshot → interact → check console → screenshot
- See CLAUDE.md for detailed usage

### Future (Hardening Phase)
- Add Playwright E2E tests when sharing with others
- Add CI/CD with GitHub Actions
- Keep tests minimal (3-5 max, smoke tests only)

---

## Git Commit Policy

**CRITICAL:** Small, logical commits

- **Source code:** < 200 lines per commit
- **Test code:** < 200 lines per commit
- **Config/data:** No limit (package.json, .json data, YT scrape results)
- **ONE logical change per commit**
- Use semantic prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`

**Break large features into commits by:**
- Component/file boundaries
- Logical implementation steps
- Feature phases (setup → implementation → styling)

---

## Categories

**Current:** Single category - `finance` (placeholder)
**Future:** TBD based on content needs

---

## Known Limitations / Future Work

1. **Article loading:** Currently hardcoded post array in BlogHome.tsx
   - Future: Dynamic loading from file system or build script

2. **No article creation UI:** Articles generated externally by LLM processing YouTube data
   - This is intentional - content pipeline is outside website

3. **No search/filtering:** Not needed for POC
   - Add when > 10 articles

4. **No pagination:** Not needed for POC
   - Add when > 20 articles

5. **No YouTube attribution in sample article:** Sample article doesn't follow attribution rules yet
   - Update sample article or remove before production

---

## Dependencies Audit

**Target:** ~150 packages, ~130MB node_modules
**Current:** 146 packages

**Check regularly:**
```bash
npm ls --depth=0      # Should show ~15 direct dependencies
du -sh node_modules   # Should be ~130MB
```

---

## Next Steps

- [ ] Update sample article with YouTube attribution
- [ ] Consider dynamic article loading (build script or runtime)
- [ ] Add more articles from YouTube metadata
- [ ] Add Playwright tests when sharing (Phase 2)
- [ ] Deploy to Netlify when ready to share

---

## Multi-Agent Architecture – YouTube Article Generator (Energy Levels v2)

This section documents the conceptual multi-agent architecture for generating YouTube articles with adaptive tone levels. The system produces three variants of each article optimized for different reader energy states.

### Overview

The energy-level system generates articles in three tones from a single content skeleton:
- **Tired** – Gentle, low-activation prose for fatigued readers
- **Medium** – Balanced, neutral baseline (canonical variant)
- **Energized** – Dynamic, engaging prose for high-engagement readers

**Backward Compatibility:** Existing articles should be treated as the **Medium** variant for any future backfill operations.

### Conceptual Subagents

The following describes behavioral roles, not enforced filenames or locations. Implementation details are agnostic to specific file structures.

#### 1. Scrape Reader & Content Skeleton Builder

**Purpose:** Parse YouTube scrape input and produce a neutral content skeleton.

**Input:** YouTube scrape data (wherever it normally resides):
- `metadata.json` – Video metadata
- `transcript.txt` – Full transcript
- `video-context.json` – AI summary (if available)
- `screenshots/` – Timestamped images (if available)

**Output:** A **neutral content skeleton** containing:
- Ordered sections with headings
- Main claims and arguments
- Evidence/citations for each claim
- Image placement suggestions with context
- Source attribution data

**Constraints:**
- Skeleton is tone-neutral (no stylistic choices)
- Structure is canonical – all variants must follow it exactly
- Claims must include justification ("X because Y")

#### 2. Tone Converter – TIRED

**Purpose:** Convert skeleton to tired-tone variant.

**Characteristics:**
- Gentle, low-activation language
- Shorter sentences and paragraphs
- Reduced cognitive load
- Calm, unhurried pacing
- Simple vocabulary where possible

**Constraints:**
- No structural changes – must follow skeleton exactly
- No content omission – all claims preserved
- Only linguistic/stylistic transformations allowed

#### 3. Tone Converter – MEDIUM (Normal)

**Purpose:** Convert skeleton to medium-tone variant.

**Characteristics:**
- Balanced, neutral prose
- Standard sentence length and pacing
- Professional but accessible
- This is the **canonical baseline**

**Constraints:**
- No structural changes – must follow skeleton exactly
- This variant is the reference for alignment checking
- Existing articles are treated as Medium tone

#### 4. Tone Converter – ENERGIZED

**Purpose:** Convert skeleton to energized-tone variant.

**Characteristics:**
- Dynamic, engaging language
- Varied sentence rhythm
- Active voice preferred
- Slightly higher energy vocabulary
- Maintains reader engagement

**Constraints:**
- No structural changes – must follow skeleton exactly
- No hyperbole or clickbait – preserve meaning and accuracy
- Energy comes from pacing, not exaggeration

#### 5. Alignment & QA Subagent

**Purpose:** Verify consistency across all three variants.

**Checks:**
- All three variants match the skeleton structure
- Same claims appear in all variants
- Same evidence/citations in all variants
- Same images referenced at same positions
- Differences exist only in tone/style, not substance

**Output:** Validation report or error list

#### 6. Packager Subagent

**Purpose:** Package final output in required format.

**Output Schema:**
```json
{
  "tired": "...",
  "medium": "...",
  "energized": "..."
}
```

**Responsibilities:**
- Ensure schema compatibility with project conventions
- Validate JSON structure
- Prepare files for wherever content normally resides

### Backfill Policy

- Existing articles are classified as **Medium** tone by default
- Backfill to generate Tired/Energized variants is a separate operation
- **Backfill is NOT to be executed during documentation sessions**

---

### Energy-Level Processing Pipeline (Conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│                     INPUT STAGE                             │
├─────────────────────────────────────────────────────────────┤
│  YouTube Scrape Data                                        │
│  (metadata, transcript, context, screenshots)               │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────┐                   │
│  │ Scrape Reader & Skeleton Builder    │                   │
│  │ • Parse inputs                      │                   │
│  │ • Extract claims + evidence         │                   │
│  │ • Structure sections                │                   │
│  │ • Place images                      │                   │
│  └─────────────────────────────────────┘                   │
│                         │                                   │
│                         ▼                                   │
│              NEUTRAL CONTENT SKELETON                       │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Tone:  TIRED  │ │ Tone: MEDIUM  │ │ Tone:ENERGIZED│
│               │ │  (Canonical)  │ │               │
│ • Gentle      │ │ • Balanced    │ │ • Dynamic     │
│ • Short sent. │ │ • Neutral     │ │ • Engaging    │
│ • Low-activ.  │ │ • Standard    │ │ • Active      │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
          ┌───────────────────────────────┐
          │      Alignment & QA           │
          │ • Verify structure match      │
          │ • Check claim consistency     │
          │ • Validate citations          │
          │ • Confirm image placement     │
          └───────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │         Packager              │
          │ • Format as JSON              │
          │ • Schema validation           │
          │ • Output to standard location │
          └───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     OUTPUT                                  │
├─────────────────────────────────────────────────────────────┤
│  {                                                          │
│    "tired": "...",                                          │
│    "medium": "...",                                         │
│    "energized": "..."                                       │
│  }                                                          │
│                                                             │
│  → Placed in project's standard output location             │
└─────────────────────────────────────────────────────────────┘
```

**Key Properties:**
- Single skeleton feeds all three converters in parallel
- No structural divergence between variants
- QA stage is mandatory before packaging
- Output format is schema-compliant JSON

---

## References

- Template: `/Users/chris/notes/@inbox/SYSTEM-PROMPT-REACT-VITE.md`
- Steering Rules: `CLAUDE.md` (in project root)
- Design Tokens: `src/styles/tokens.css`
