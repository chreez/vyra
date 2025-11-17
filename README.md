# Vyra

> [To be defined - guide website built with React + Vite]

**Stack:** React 19 + Vite + TypeScript
**Deployment:** Netlify
**Status:** POC

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
  components/
    core/       # Reusable primitives (Button, Card, Input)
    layout/     # Layout components (Container, Grid, Section)
    domain/     # Feature-specific components
  pages/        # Route components
  hooks/        # Custom hooks (useMetaTags, useSearch)
  styles/
    tokens.css  # Design tokens (colors, spacing, shadows)
    global.css  # Base styles
  data/         # Static content (guides, entities)
```

**Key files:**
- `CLAUDE.md` - Instructions for Claude Code (copied from SYSTEM-PROMPT-REACT-VITE.md)
- `docs/spec.md` - Project specification and requirements
- `docs/intent-log/` - Historical development sessions (for replay understanding)

---

## Features

- [Feature 1 - e.g., "Random matchup generator"]
- [Feature 2 - e.g., "Interactive strategy guides"]
- [Feature 3 - e.g., "Searchable reference database"]
- Discord/social embeds with OG meta tags

---

## Development Phases

### Phase 1: POC (Current)

**Goal:** Ship working features fast

- Manual browser testing only
- No automated tests
- Rapid iteration
- Local deployment

**Testing:** Open http://localhost:5173 and test manually in Chrome DevTools

### Phase 2: Hardening (When Sharing)

**Goal:** Prevent regressions, enable collaboration

**Add when:** Ready to share site with others

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install chromium webkit

# Run E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui
```

**Tests:** 3-5 smoke tests covering critical paths (see `e2e/smoke.spec.ts`)

### Phase 3: Production (Public Site)

**Goal:** Reliable deployment, professional appearance

- Netlify deployment with auto-deploy from `main` branch
- GitHub Actions CI/CD (tests run on every push/PR)
- OG meta tags for social embeds
- Custom domain (optional)

---

## Design System

**ALWAYS use design tokens** from `src/styles/tokens.css`:

```css
/*  Good */
.component {
  padding: var(--spacing-md);
  color: var(--accent-primary);
  box-shadow: var(--shadow-md);
}

/* L Bad - hardcoded values */
.component {
  padding: 12px;
  color: #ff8c42;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**Layout components:** Use `Container`, `Grid`, `Section` instead of custom flexbox.

---

## Testing

### Manual Testing (Primary)

**Process:**
1. Open http://localhost:5173
2. Test responsive layouts:
   - 375px (mobile)
   - 768px (tablet)
   - 1200px (desktop)
3. Verify all interactions work
4. Check browser console for errors

### E2E Testing (Phase 2+)

**Run tests:**
```bash
npm run test:e2e        # Run all tests
npm run test:e2e:ui     # Interactive mode
npm run test:e2e:debug  # Debug mode
```

**Write new tests:**
```typescript
// e2e/smoke.spec.ts
test('should load guide page', async ({ page }) => {
  await page.goto('/guide');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

**Keep tests minimal** - cover critical paths only, not every edge case.

---

## Deployment

### Local Preview

```bash
npm run build    # Build production bundle
npm run preview  # Preview at http://localhost:4173
```

### Netlify (Phase 3)

**Setup:**
1. Connect GitHub repo to Netlify
2. Build settings auto-detected:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Push to `main` branch ’ auto-deploys

**Configuration:** See `netlify.toml`

### CI/CD (Phase 3)

GitHub Actions workflow runs on every push/PR:
- Unit tests (if any)
- E2E tests (Playwright)
- Production build verification
- Route HTML generation check

**Configuration:** See `.github/workflows/ci.yml`

---

## OG Meta Tags (Discord Embeds)

**Required for all guide pages** - ensures proper Discord/social previews.

**Implementation:**
1. Use `useMetaTags` hook in page components (see `src/hooks/useMetaTags.ts`)
2. Build-time route generation creates static HTML for each route
3. Verify with `grep "og:title" dist/[route]/index.html`

**Example:**
```typescript
function GuidePage() {
  useMetaTags({
    title: 'Strategy Guide',
    description: 'Learn advanced strategies',
    image: 'https://example.com/guide-thumbnail.jpg',
    url: 'https://example.com/strategy-guide',
  });

  return <article>...</article>;
}
```

---

## Dependencies

**Target:** ~10 packages, ~100MB node_modules

**Core:**
- react, react-dom, react-router-dom
- vite, typescript
- @vitejs/plugin-react

**Phase 2+ (optional):**
- @playwright/test (E2E tests)
- vitest (minimal smoke tests)

**Check regularly:**
```bash
npm ls --depth=0     # Should show ~10 packages
du -sh node_modules  # Should be ~100MB (POC) or ~130MB (with Playwright)
```

---

## Contributing

**Commit conventions:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructure
- `chore:` Tooling/dependencies

**Examples:**
- `feat: Add search functionality to guide directory`
- `fix: Correct mobile navigation spacing`
- `refactor: Extract metadata hook from pages`

**Workflow:**
```bash
git add -A
git commit -m "feat: descriptive message"
git push origin main
```

---

## Documentation

- `CLAUDE.md` - Claude Code instructions (AI agent guidance)
- `docs/spec.md` - Project specification
- `docs/CONTENT-GUIDELINES.md` - Writing voice and style
- `docs/intent-log/` - Historical development sessions

---

## Failure Indicators

=© **STOP and reassess if:**

- 2+ "fix" commits in a row
- Dependencies > 20 packages
- node_modules > 150MB
- Build time > 30 seconds
- More than 2 days without deploying

---

## Tech Stack Details

**Why React + Vite?**
- Fast, reliable dev server
- Simple configuration
- Great DX for React development
- No framework lock-in

**Why not Next.js/Remix?**
- Overkill for static guide websites
- Adds complexity without benefit
- Vite is faster and simpler

**Why TypeScript?**
- Catch errors early
- Better IDE autocomplete
- Self-documenting code

---

## Links

- [Live Site]([Your Netlify URL])
- [GitHub Repository]([Your GitHub URL])
- [Documentation](./docs/spec.md)

---

**Last Updated:** 2025-11-17
**Maintainer:** [Your Name/Handle]
