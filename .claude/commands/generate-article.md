---
description: Generate blog article from YouTube scrape data
---

# YouTube Article Generator

You are processing a YouTube video scrape into a blog article with automated preview and two-phase publishing.

**Workflow Overview:**
1. Generate balanced (medium tone) article
2. Preview and first review
3. Generate tired variant (slides format)
4. Second review
5. Publish

---

## Step 1: Input Path

**IMPORTANT:** The user can invoke this command in two ways:
1. **With argument:** `/generate-article scrapes/{video-slug}` - Process specific scrape
2. **Without argument:** `/generate-article` - Automatically process the most recently modified directory in `scrapes/`

**First step:** If no argument provided, find the most recent scrape:
- List all directories in `scrapes/` (exclude files, exclude directories starting with `.`)
- Sort by modification time (newest first)
- Use the most recent directory as the input path
- Report which scrape you selected

The input directory contains:
- `metadata.json` - Full YouTube metadata (video ID, title, thumbnail, heatmap, upload date)
- `transcript.txt` - Complete video transcript with timestamps
- `screenshots/` - Directory with timestamped images (format: `HH-MM-SS.jpg`)
- Optional: `screenshots/screenshot-metadata.jsonl` - AI analysis of screenshots
- Optional: `video-context.json` - AI-generated video summary

---

## Step 2: Analysis & Confirmation

After loading all files, present a confirmation summary:

```
📹 Video: [Title]
👤 Channel: [Channel name]
⏱️ Duration: [MM:SS]
📝 Main Topics: [2-3 themes]
🖼️ Screenshots: [Count]
📊 AI Analysis: Available [✓/✗]

Proposed Article Structure:
- Overview: [Thesis in 1-2 sentences]
- Main Arguments: [3-5 bullet points]
- Hero Image Candidates: [Count]
```

Ask user: **"Proceed with article generation? (yes/no)"**

Only continue after confirmation.

---

## Step 3: Generate Balanced Article

Generate a single "balanced" (medium tone) article.

### Output Structure

Create `{input-directory}/curated/`:
```
curated/
├── article.md          # Balanced/medium tone
├── metadata.json
└── images/
    ├── hero-candidate-1.jpg
    ├── hero-candidate-2.jpg
    ├── [descriptive-name].jpg
    └── image-selection-metadata.json
```

### image-selection-metadata.json Structure

Document the selection process with verbose metadata:

```json
{
  "hero_candidates": [
    {
      "filename": "hero-candidate-1.jpg",
      "source": "00-08-00.jpg",
      "scene_type": "text_overlay",
      "visible_text": "Key text from image",
      "selection_reason": "Clear framework diagram matching article thesis",
      "article_placement": "hero"
    }
  ],
  "article_images": [
    {
      "filename": "framework-diagram.jpg",
      "source": "00-10-00.jpg",
      "scene_type": "diagram",
      "visible_text": "Step 1: ...",
      "selection_reason": "Illustrates main methodology section",
      "article_placement": "section: Key Steps"
    }
  ],
  "selection_summary": {
    "metadata_source": "screenshot-metadata.jsonl",
    "total_screenshots": 34,
    "errors_skipped": 2,
    "talking_heads_excluded": 15,
    "images_selected": 8
  }
}
```

### article.md Format

```markdown
---
title: [Extracted from video title]
description: [1-2 sentence summary]
---

## Overview
[2-3 paragraphs explaining the video's core argument/thesis]

## [Main Point 1]
[Evidence and reasoning - de-duplicated, no rambling]

![Description](/blog/{slug}/image-name.jpg)

## [Main Point 2]
[Evidence and reasoning]

...

## Key Takeaways
- [Actionable bullet points]
- [Main conclusions]

---

## Source

This guide is based on the video by [Creator Name].

[![Video Title](https://img.youtube.com/vi/{videoId}/maxresdefault.jpg)](https://youtube.com/watch?v={videoId})

[Watch the original video →](https://youtube.com/watch?v={videoId})
```

### Content Requirements

1. **De-duplicate** - Videos repeat points. State each argument once, clearly.
2. **Extract claims + justifications** - Use "X is true BECAUSE Y" structure
3. **Pull citations** - Note any sources, studies, examples mentioned
4. **Ignore tangents** - Cut rambling and off-topic digressions
5. **Preserve nuance** - Keep caveats and counter-arguments if mentioned
6. **Be exhaustive** - Cover ALL major points, not just highlights

### metadata.json

```json
{
  "title": "Short Title (mobile-friendly)",
  "date": "YYYY-MM-DD",
  "category": "health|finance|technology|education",
  "videoId": "YouTube video ID",
  "published": false,
  "excerpt": "1-2 sentence summary for blog listing",
  "scrapePath": "scrapes/{video-slug}"
}
```

Note: `scrapePath` is stored so variant generation can reference original source material.

**Categories:**
- `finance` - Economics, business, investing, markets
- `health` - Medical, wellness, fitness, mental health
- `technology` - Tech trends, software, hardware, AI
- `education` - Tutorials, how-to, learning

### Image Selection

**IMPORTANT:** Check for `screenshots/screenshot-metadata.jsonl` first.

**If metadata exists** (preferred):
1. Load the JSONL file (one JSON object per line)
2. Filter by `scene_type`:
   - PREFER: "text_overlay", "diagram", "chart", "framework"
   - AVOID: "talking_head"
   - SKIP: "error" (note skipped count in output)
3. Rank by `visible_text` presence (images with clear text score higher)
4. Use `description` to identify key concepts matching article sections
5. Use `relates_to_audio` to match images with relevant transcript sections

**If metadata doesn't exist** (fallback):
- Analyze screenshots by timestamp distribution
- Prefer images at key moments (intro, transitions, conclusions)
- Prioritize visible text/diagrams over talking head shots

**Hero Candidates (2-3 images):**
- Select images with highest information density
- Match to article overview/thesis
- Name as: `hero-candidate-1.jpg`, `hero-candidate-2.jpg`, etc.

**Article Images:**
- Match images to specific article sections using `description`/`visible_text`
- Use **descriptive filenames**: `chart-revenue.jpg`, `framework-diagram.jpg`

---

## Step 4: Deploy to Preview

After generating curated output, automatically deploy for preview:

### Generate Slug
- Create URL-safe slug from video title
- Format: lowercase, hyphenated, no special characters
- Max 50 characters
- Example: "How Digital Habits Weaken Your Brain" → `digital-habits-weaken-brain`

### Copy Files
1. Create directories:
   - `public/data/blog/{slug}/`
   - `public/blog/{slug}/`

2. Copy content files:
   - `curated/article.md` → `public/data/blog/{slug}/article.md`
   - `curated/metadata.json` → `public/data/blog/{slug}/meta.json`

3. Copy images:
   - `curated/images/*.jpg` → `public/blog/{slug}/`
   - Rename `hero-candidate-1.jpg` to `hero.jpg`

4. Update manifest:
   - Read `public/data/blog/index.json`
   - Add new slug to array (if not already present)
   - Write updated array back

5. Verify `published: false` in meta.json

---

## Step 5: Browser Preview (First Review)

### Start Dev Server
1. Check if dev server is running:
   - Use `lsof -i :5173` or `lsof -i :5175`
2. If not running:
   - Start with `npm run dev` in background
   - Wait for "ready" message (typically 2-3 seconds)

### Verify with Chrome DevTools
1. Use `mcp__chrome-devtools__navigate_page` to load `http://localhost:5173/blog/{slug}`
2. Use `mcp__chrome-devtools__take_snapshot` to verify content renders
3. Use `mcp__chrome-devtools__list_console_messages` to check for errors
4. If errors found, report them but continue

### Open in System Browser
Run: `open http://localhost:5173/blog/{slug}`

Report to user:
```
✅ Balanced article deployed to preview
📍 Location: public/data/blog/{slug}/
🌐 Preview: http://localhost:5173/blog/{slug}

Opening in your browser now...
```

---

## Step 6: First Review - Generate Variants?

Ask user: **"Balanced article preview is open. Ready to generate energy variants? (yes/no)"**

### If No:
Keep as draft, stop here:
```
📝 Article saved as draft (balanced only).
📍 Location: public/data/blog/{slug}/
🔧 Run /backfill-energy-variants {slug} later to add variants.
```

### If Yes:
Continue to Step 7.

---

## Step 7: Generate Tired Variant

Using the balanced article AND the original source material (transcript, video-context), generate the tired variant:

### Read Source Material
- Read `{scrapePath}/transcript.txt`
- Read `{scrapePath}/video-context.json` (if exists)
- Use these to ensure the variant captures nuance from original content

### Generate Tired Variant

Convert the balanced article into slide format:
- Gentle, low-activation tone
- Shorter sentences and paragraphs
- Calmer pacing, simpler phrasing
- Same sections, claims, citations, attribution

### Image Resampling for Slides

**IMPORTANT:** Reassess available images specifically for slide format. Don't just copy images from the balanced article.

1. **Re-read screenshot metadata** from `{scrapePath}/screenshots/screenshot-metadata.jsonl`
2. **Map slides to images:**
   - For each slide topic, identify if a relevant image exists
   - Prioritize images that demonstrate: exercises, diagrams, frameworks, examples
   - Skip talking heads unless showing technique
3. **Ensure distinctiveness:**
   - No near-duplicate images (e.g., same pose from different angles)
   - Each image should add unique visual information
4. **Copy additional images if needed:**
   - If resampling identifies useful images not in `public/blog/{slug}/`, copy them
   - Use descriptive filenames matching the slide content
5. **Target coverage:** Aim for images on 30-50% of slides where visuals add value

### Tired Mode Slide Format

```json
{
  "format": "slides",
  "slides": [
    "# Slide Title\n\nShort, gentle content for slide 1",
    "## Key Point\n\nSimple explanation\n\n![Image description](/blog/{slug}/image.jpg)",
    ...
  ]
}
```

Each slide should be:
- One key idea
- 2-4 sentences max
- Soothing, low-stimulation language
- Include relevant images using markdown syntax: `![alt text](/blog/{slug}/image.jpg)`
- Images render inline in the slideshow via ReactMarkdown
- Add images to slides that demonstrate exercises, diagrams, or key concepts

### Write tones.json

Create `public/data/blog/{slug}/tones.json`:
```json
{
  "tired": {
    "format": "slides",
    "slides": ["...", "...", "..."]
  },
  "medium": "FULL MARKDOWN OF BALANCED ARTICLE"
}
```

---

## Step 8: Browser Preview (Second Review)

### Reload and Verify
1. Use Chrome DevTools to reload `http://localhost:5173/blog/{slug}`
2. Take snapshot to verify tones.json is being used
3. Test tired mode by setting energy level (if possible via DevTools)

### Open in System Browser
Run: `open http://localhost:5173/blog/{slug}`

Report to user:
```
✅ Tired variant generated
📍 tones.json created at: public/data/blog/{slug}/tones.json
🌐 Preview: http://localhost:5173/blog/{slug}

Opening in your browser now...
Test tired mode to review the slides variant.
```

---

## Step 9: Publish Confirmation

Ask user: **"Variants are ready. Publish article? (yes/no)"**

### If Yes:
1. Update `public/data/blog/{slug}/meta.json`: set `"published": true`
2. Archive the source scrape:
   ```bash
   mkdir -p scrapes/archive
   mv {scrapePath} scrapes/archive/
   ```
3. Create git commit and push:
   ```bash
   git add public/data/blog/{slug}/ public/blog/{slug}/ public/data/blog/index.json
   git commit -m "content: Add {article-title} article"
   git push origin
   ```
4. Confirm:
```
✅ Article published!
📍 Available at: /blog/{slug}
📊 Variants: tired (slides), medium
📦 Committed and pushed to origin
🗄️ Scrape archived to: scrapes/archive/{scrape-folder-name}
```

### If No:
1. Keep `published: false`
2. Confirm:
```
📝 Article saved as draft with variants.
📍 Location: public/data/blog/{slug}/
🔧 To publish: set "published": true in meta.json
```

---

## Quality Checklist

✅ Core argument clear in overview
✅ Every major point covered
✅ No rambling or circular logic
✅ Sources cited with context
✅ 2-3 strong hero candidates
✅ Descriptive image filenames
✅ Valid metadata JSON
✅ Complete YouTube attribution
✅ index.json updated
✅ All image references exist
✅ Preview renders without errors
✅ Both tone variants aligned (same claims, different tone)
✅ Tired mode uses slides format
✅ Source scrape archived to scrapes/archive/
✅ Changes committed and pushed to origin
