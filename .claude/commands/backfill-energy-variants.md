---
description: Backfill tired/medium/energized tone variants for existing articles
---

# Backfill Energy-Level Variants

You are operating at the ROOT of this workspace.

This command executes a **one-time backfill** to create tired/medium/energized variants for all existing blog articles, using the project’s current content and file structure.

Do NOT change how the site currently renders articles. This backfill is additive only.

---

## 0. Safety & Confirmation

Before doing anything:

1. Ask the user:

   **"This will scan existing articles and create tired/medium/energized variants in a new tones.json file per article. No existing files will be deleted or overwritten. Run backfill now? (yes/no)"**

2. If the user answers **no**, stop immediately.

3. If the user answers **yes**, proceed.

You MUST NOT:
- Build or deploy the site
- Modify `.claude/commands/generate-article.md`
- Change how BlogPost currently reads `article.md`
- Delete or rename existing content

---

## 1. Discover Existing Articles

Use the project’s current conventions documented in CLAUDE.md and docs/spec.md:

- Article content and metadata live under:

  - `public/data/blog/{slug}/`
    - `article.md`
    - `meta.json`
  - `public/blog/{slug}/`
    - Images for that article

- There is a blog manifest:

  - `public/data/blog/index.json`
  - It contains an array of slugs: `["slug-1", "slug-2", ...]`

Steps:

1. Read `public/data/blog/index.json`.
2. For each slug in that list, check that:
   - `public/data/blog/{slug}/article.md` exists
   - `public/data/blog/{slug}/meta.json` exists
3. Build a list of valid article slugs.
4. Present the list to the user and ask:

   **"These articles will be migrated to have tired/medium/energized tone variants via tones.json. Proceed? (yes/no)"**

If **no**, stop.

---

## 2. Interpret Existing Articles as MEDIUM

For each confirmed slug:

1. Read `article.md` (this is the current single-tone article).
2. Treat this article as the **MEDIUM (normal)** tone.
3. Do **not** modify `article.md` in this command.
4. Read `meta.json` to understand title, date, category, videoId, and any existing fields.

---

## 3. Extract Neutral Content Skeleton

For each article:

1. Parse the markdown:
   - Frontmatter (if present)
   - Headings and sections
   - Body content
   - Image references
   - Source/YouTube attribution section

2. Construct a **neutral content skeleton** (in your internal reasoning), containing:
   - Ordered sections and headings
   - Main claims and arguments
   - Evidence and citations with references to meta.json/videoId
   - Image placement slots (where images appear)
   - Source attribution data

3. The skeleton MUST be tone-neutral:
   - No stylistic choices beyond section structure and content ordering.

You do not need to write the skeleton to disk; it can remain internal, but you must base all tone variants on it.

---

## 4. Generate Tone Variants

For each article’s skeleton, generate three markdown variants:

1. **Tired**
   - Gentle, low-activation tone
   - Shorter sentences and paragraphs
   - Calmer pacing and simpler phrasing
   - Same sections, claims, citations, images, and attribution

2. **Medium** (canonical)
   - Balanced, neutral tone
   - Standard pacing and sentence length
   - Should correspond closely to the existing `article.md` content,
     but may fix minor structure/clarity issues
   - Same sections, claims, citations, images, and attribution

3. **Energized**
   - More dynamic, engaging tone
   - Varied sentence rhythm, slightly higher energy
   - No exaggeration or new claims
   - Same sections, claims, citations, images, and attribution

All three variants MUST:

- Follow the same section structure.
- Contain the same arguments and evidence.
- Reference the same images at the same logical positions.
- Include the YouTube attribution section as already required in CLAUDE.md.

---

## 5. QA Alignment

Before writing anything:

For each slug:

1. Compare tired/medium/energized variants against the skeleton.
2. Ensure:
   - No variant introduces or removes claims.
   - All variants preserve the same citations and image references.
   - Differences are purely tonal (sentence length, vocabulary, pacing).

If you detect drift in meaning, rewrite the offending sections so all three variants align with the skeleton.

---

## 6. Persistence: tones.json (Additive Only)

For each slug, create a new file:

- `public/data/blog/{slug}/tones.json`

The file MUST follow this schema:

```json
{
  "tired": "FULL MARKDOWN STRING OF THE TIRED VARIANT",
  "medium": "FULL MARKDOWN STRING OF THE MEDIUM VARIANT",
  "energized": "FULL MARKDOWN STRING OF THE ENERGIZED VARIANT"
}
