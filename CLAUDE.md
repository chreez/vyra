# Project Instructions

This workspace was created for AI-assisted development using Claude Code.

## Steering Rules

### Design System

**OVERRIDE:** Using Mantine (CSS modules mode) instead of custom tokens-only approach
- ⚠️ Deviation from template: Mantine adds dependencies, but provides opinionated components
- Still use `tokens.css` for custom values not covered by Mantine
- Rationale: Prevent formatting breakage during iteration

### Article Generation from Raw YouTube Data

**Input:** `/Users/chris/workspace/youtube-image-grabber/{video-slug}/`
- `metadata.json` - YouTube metadata (id, title, formats)
- `video-context.json` - AI summary, topics
- `transcript.txt` - Full video transcript
- `screenshots/` - Timestamped images (00-01-15.jpg, etc.)

**Output:** Two mirrored folders in vyra project:

1. **Content:** `src/data/blog/{slug}/`
   - `article.md` - Frontmatter + markdown body
   - `meta.json` - `{ title, date, category, videoId, published: boolean }`

2. **Assets:** `public/blog/{slug}/`
   - Selected images (hero.jpg, screenshot-1.jpg, etc.)
   - **CRITICAL: Folder name must exactly match content folder**

**Image references in article.md:**
```markdown
![Description](/blog/{slug}/hero.jpg)
```

**Workflow:**
1. Raw data generated externally → `youtube-image-grabber/`
2. LLM processes raw data → generates article in target structure
3. Article + selected images → stored in vyra (mirrored folders)
4. Website displays published articles only (where `meta.json` has `published: true`)

**Categories:**
- Start with single category: `finance`
- Future categories TBD

**YouTube Attribution (CRITICAL):**
- All articles are summaries/guides based on YouTube videos
- **MUST include** attribution section at the bottom of every article
- Attribution must contain:
  - Credit to original creator
  - Link to YouTube video (using `videoId` from meta.json)
  - Video thumbnail preview (from `metadata.json` thumbnail URL)
  - Note: YouTube embeds don't work, use thumbnail image with link instead

**Example attribution section for article.md:**
```markdown
---

## Source

This guide is based on the video by [Creator Name].

[![Video Title](thumbnail-url)](https://youtube.com/watch?v={videoId})

[Watch the original video →](https://youtube.com/watch?v={videoId})
```

### Netlify Deployment Best Practices

**CRITICAL: Production build requirements**

**Issue 1: TypeScript build failures from obsolete files**
- **Problem**: Obsolete/refactored components with TypeScript errors prevented deployment
- **Root cause**: `tsc -b` checks ALL .ts/.tsx files, even unused ones
- **Solution**: Delete obsolete files immediately after refactoring
- **Prevention**: Always run `npm run build` locally before pushing

**Issue 2: Runtime data fetching from /src/ directory**
- **Problem**: `fetch('/src/data/...')` works in dev but returns 404 in production
- **Root cause**: Vite only serves files from `/public/` in production builds
- **Solution**: Runtime-fetched data MUST live in `/public/` directory
- **Rule**:
  - Static assets loaded at build time → can be in `/src/`
  - Data fetched at runtime → MUST be in `/public/`

**Data file locations:**
- ✅ `/public/data/blog/{slug}/` - Runtime-fetched article data (meta.json, article.md)
- ✅ `/public/blog/{slug}/` - Static assets (images)
- ❌ `/src/data/blog/{slug}/` - NOT accessible at runtime in production

**Pre-deployment checklist:**
1. Run `npm run build` locally and verify it passes
2. Check that all `fetch()` calls reference `/public/` paths (without "/src/")
3. Delete any obsolete/unused component files
4. Test the production build locally: `npm run preview`

### Git Commit Policy

**CRITICAL: Small, logical commits**

**Size limits:**
- Source code: < 200 lines per commit
- Test code: < 200 lines per commit
- Configuration/data files: No limit (e.g., package.json, .json data, YT scrape results)

**Rules:**
1. Each commit should represent ONE logical change
2. If a feature requires > 200 lines, break into multiple commits by:
   - Component/file boundaries
   - Logical implementation steps
   - Feature phases (setup → implementation → styling)
3. Commit message must clearly describe the single logical change
4. Use semantic prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`

**Examples of good commits:**
- `feat: Add BlogPost component` (120 lines)
- `feat: Add BlogPost styling` (80 lines)
- `feat: Add markdown rendering to BlogPost` (60 lines)

**Examples of bad commits:**
- `feat: Add entire blog system` (500 lines - too big, not logical)
- `feat: Various updates` (vague, not logical)

### Chrome DevTools MCP Server

**Usage:** Use `mcp__chrome-devtools__*` tools for browser testing and debugging

**When to use:**
- Testing UI changes in the browser
- Debugging layout/rendering issues
- Verifying navigation flows
- Checking console errors/warnings
- Taking screenshots for visual verification

**Best practices:**
1. Use `list_pages` to see available browser tabs
2. Use `navigate_page` to load URLs or reload
3. Use `take_snapshot` for accessible content tree (faster than screenshots)
4. Use `take_screenshot` for visual verification
5. Use `list_console_messages` to check for errors
6. Use `click` with uid from snapshot to test interactions

**Example workflow:**
```
1. navigate_page(url: "http://localhost:5175")
2. take_snapshot() - get page structure with uids
3. click(uid: "2_7") - interact with elements
4. list_console_messages() - check for errors
5. take_screenshot() - visual confirmation
```

## Documentation Location

**Important**: All agentic documentation should be stored in the `docs/` folder.

- `docs/` - All AI-generated guides, specifications, and technical documentation
- Root `README.md` - High-level project overview (can be populated by Claude based on project scope)
- `CLAUDE.md` - This file - steering rules and project instructions for Claude Code

## Agent Skills

Claude Code supports [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) - modular capabilities that extend Claude's functionality.

**Personal Skills**: `~/.claude/skills/` - Available across all your projects
**Project Skills**: `.claude/skills/` - Shared with your team via git
**Plugin Skills**: Bundled with installed Claude Code plugins

Skills are model-invoked (Claude decides when to use them based on context) and can include:
- Custom workflows and automation
- Domain-specific expertise
- Project conventions and standards
- Utility scripts and templates

To view available skills, ask Claude: "What Skills are available?"

## Memory Management

This project follows Claude Code's memory hierarchy:

1. **Enterprise policy** - Organization-wide standards (if applicable)
2. **Project memory** - This CLAUDE.md file (shared with team)
3. **User memory** - `~/.claude/CLAUDE.md` (your personal preferences)
4. **Imports** - Use `@path/to/file` to import additional instructions

### Best Practices

- **Be specific**: Use concrete examples rather than vague instructions
- **Use structure**: Organize related rules under clear markdown headings
- **Keep it current**: Update this file as the project evolves
- **Add memories quickly**: Use `#` shortcut in Claude Code to add new steering rules

## Project Context

<!-- Add project-specific information here as it develops -->

