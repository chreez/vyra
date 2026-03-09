---
description: Generate blog article from YouTube scrape data
---

# YouTube Article Generator

You are processing a YouTube video scrape into a blog article with automated preview and publishing.

**Invocation:**
```
/generate-article [path] [--auto]
```

- `path` - Optional. Scrape directory (default: most recent in `scrapes/`)
- `--auto` - Skip all confirmation prompts, auto-publish at end

**Workflow Overview:**
1. Parse arguments & locate scrape
2. Parallel analysis (3 sub-agents)
3. Generate balanced article + images
4. Deploy to preview
5. Generate tired variant
6. Review agent (source fidelity check)
7. Verify & publish

---

## Step 1: Parse Arguments

**Parse the command arguments:**
- Check if `--auto` flag is present → set `autoMode = true`
- Check if a path argument is provided → use as input path
- If no path: find most recent directory in `scrapes/` (exclude `.` prefixed, sort by mtime)

Report:
```
📂 Scrape: {scrapePath}
⚡ Mode: {autoMode ? "Auto (no prompts)" : "Interactive"}
```

---

## Step 2: Parallel Analysis

**Launch 3 sub-agents in parallel using the Task tool:**

```
Use Task tool with subagent_type="general-purpose" for each:
```

### Agent 1: Content Analyzer
```
Prompt: "Analyze YouTube video scrape for article generation.

Read these files from {scrapePath}:
- transcript.txt
- video-context.json (if exists)

Return JSON:
{
  "thesis": "1-2 sentence core argument",
  "mainPoints": ["point 1", "point 2", ...],
  "sourcesCited": ["source 1", ...],
  "structure": ["Section 1 title", "Section 2 title", ...],
  "channelName": "extracted from transcript/context",
  "duration": "MM:SS if available"
}

Do NOT write any files. Research only."
```

### Agent 2: Image Curator
```
Prompt: "Analyze screenshots for article image selection.

Read: {scrapePath}/screenshots/screenshot-metadata.jsonl

Filter and rank images:
- PREFER: scene_type = text_overlay, diagram, chart, framework
- AVOID: scene_type = talking_head
- SKIP: scene_type = error (count these)

Return JSON:
{
  "heroCandidates": [
    {"source": "00-08-00.jpg", "reason": "...", "visibleText": "..."}
  ],
  "articleImages": [
    {"source": "00-10-00.jpg", "suggestedName": "framework-diagram.jpg", "reason": "..."}
  ],
  "summary": {
    "total": 34,
    "errorsSkipped": 2,
    "talkingHeadsExcluded": 15,
    "selected": 8
  }
}

Do NOT copy files. Analysis only."
```

### Agent 3: Metadata Extractor
```
Prompt: "Extract metadata from YouTube scrape.

Read: {scrapePath}/metadata.json

Return JSON:
{
  "videoId": "...",
  "title": "Original video title",
  "shortTitle": "Mobile-friendly short version (max 50 chars)",
  "slug": "url-safe-slug-max-50-chars",
  "category": "health|finance|technology|education",
  "uploadDate": "YYYY-MM-DD",
  "channelName": "..."
}

Do NOT write any files. Research only."
```

**Wait for all 3 agents to complete, then merge results.**

### Confirmation (skip if autoMode)

If NOT autoMode, show summary and ask:
```
📹 Video: [Title]
👤 Channel: [Channel name]
📝 Thesis: [1-2 sentences]
📊 Main Points: [count]
🖼️ Images Selected: [count]

Proceed? (yes/no)
```

---

## Step 3: Generate Balanced Article

Using merged analysis, generate the article content.

### Create Output Structure
```
{scrapePath}/curated/
├── article.md
├── metadata.json
└── images/
    ├── hero.jpg
    ├── [descriptive-name].jpg
    └── image-selection-metadata.json
```

### article.md Format

```markdown
---
title: [From metadata shortTitle]
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

1. **De-duplicate** - State each argument once, clearly
2. **Extract claims + justifications** - "X is true BECAUSE Y"
3. **Pull citations** - Note sources, studies, examples
4. **Ignore tangents** - Cut rambling
5. **Preserve nuance** - Keep caveats if mentioned
6. **Be exhaustive** - Cover ALL major points

### metadata.json

```json
{
  "title": "Short Title",
  "date": "YYYY-MM-DD",
  "category": "health|finance|technology|education",
  "videoId": "YouTube video ID",
  "published": false,
  "excerpt": "1-2 sentence summary",
  "scrapePath": "scrapes/{video-slug}"
}
```

**IMPORTANT:** Use today's actual date for the `date` field. Check the current year in your environment context.

### Copy Images

Using the Image Curator results:
1. Copy hero candidate → `curated/images/hero.jpg`
2. Copy article images with descriptive names
3. Write `image-selection-metadata.json` with full selection rationale

---

## Step 4: Deploy to Preview

**Run these operations in parallel using Bash:**

```bash
# Create directories (can run in parallel)
mkdir -p public/data/blog/{slug}
mkdir -p public/blog/{slug}
```

```bash
# Copy content files
cp {scrapePath}/curated/article.md public/data/blog/{slug}/article.md
cp {scrapePath}/curated/metadata.json public/data/blog/{slug}/meta.json
```

```bash
# Copy images
cp {scrapePath}/curated/images/*.jpg public/blog/{slug}/
```

**Update manifest** (must be sequential):
- Read `public/data/blog/index.json`
- Add slug if not present
- Write back

---

## Step 5: Generate Tired Variant

**Launch sub-agent for variant generation:**

```
Use Task tool with subagent_type="general-purpose":

Prompt: "Generate tired mode slides for article.

Read:
- public/data/blog/{slug}/article.md (the balanced article)
- {scrapePath}/transcript.txt (original source)
- {scrapePath}/screenshots/screenshot-metadata.jsonl (for image resampling)

Convert to slide format:
- Gentle, low-activation tone
- One key idea per slide
- 2-4 sentences max per slide
- Soothing, simple language
- Same claims/citations as balanced article

Image resampling for slides:
- Reassess which images work for slide format
- Prioritize: exercises, diagrams, frameworks
- Target 30-50% of slides with images
- Copy any additional needed images to public/blog/{slug}/

Write tones.json to public/data/blog/{slug}/tones.json:
{
  \"tired\": {
    \"format\": \"slides\",
    \"slides\": [\"# Slide 1\\n\\nContent...\", ...]
  },
  \"medium\": \"FULL MARKDOWN FROM article.md\"
}

Return confirmation when complete."
```

---

## Step 6: Review Agent (Source Fidelity Check)

**Launch a review sub-agent to cross-reference the article against original source material:**

```
Use Task tool with subagent_type="general-purpose":

Prompt: "You are a review agent. Cross-reference a generated article against its original source material to find discrepancies.

Read these files:
- public/data/blog/{slug}/article.md (the generated article)
- public/data/blog/{slug}/meta.json (article metadata)
- {scrapePath}/transcript.txt (original video transcript)
- {scrapePath}/video-context.json (if exists)

Perform these checks:

1. **Name & Terminology Fidelity**
   Compare every proper noun, product name, tool name, and branded term in the article against the transcript. Flag:
   - Names that were 'normalized' or autocorrected (e.g. transcript says 'Clawdbot' but article says 'Cloudbot')
   - Names not found anywhere in the transcript (possible hallucinations)
   - Inconsistent naming within the article itself

2. **Claim Verification**
   For each factual claim in the article, verify it appears in the transcript. Flag:
   - Claims with no transcript basis
   - Numbers, prices, or stats that differ from the transcript
   - Exaggerated or softened claims vs the original

3. **Omission Check**
   Identify any major points from the transcript that the article omits entirely.

Return a structured report:
{
  'namingIssues': [
    {'article': 'Cloudbot', 'transcript': 'Clawdbot', 'occurrences': 41, 'severity': 'high'}
  ],
  'claimIssues': [
    {'claim': '...', 'issue': 'not in transcript / differs from transcript', 'severity': 'high|medium|low'}
  ],
  'omissions': [
    {'topic': '...', 'severity': 'medium|low'}
  ],
  'summary': 'One paragraph overall assessment'
}

Do NOT modify any files. Review only."
```

### Handle Review Results

**If issues with severity=high exist:**

- If NOT autoMode: Present the report and ask user how to proceed
- If autoMode: Log the report as a warning but continue (high-severity naming issues should still be flagged to the user even in auto mode)

**If only medium/low issues:** Note them in the final report and proceed.

**Apply fixes:** If the user approves fixes (or autoMode with no high-severity), apply corrections to:
- `public/data/blog/{slug}/article.md`
- `public/data/blog/{slug}/meta.json` (title, excerpt)
- `public/data/blog/{slug}/tones.json` (tired slides)

---

## Step 7: Verify & Publish

### Start Dev Server (if needed)
```bash
lsof -i :5173 || npm run dev &
```

### Verify Article Page
1. `mcp__chrome-devtools__navigate_page` → `http://localhost:5173/blog/{slug}`
2. `mcp__chrome-devtools__take_snapshot` → verify article renders
3. `mcp__chrome-devtools__list_console_messages` → check for errors

### Verify Blog Home Listing
1. `mcp__chrome-devtools__navigate_page` → `http://localhost:5173/`
2. `mcp__chrome-devtools__take_snapshot` → verify new article appears in list
3. Confirm article title, category, and date are correct
4. If article not visible: check `published: true` in meta.json, verify slug in index.json

### Open Browser
```bash
open http://localhost:5173/blog/{slug}
```

### Publish Decision

**If autoMode:**
- Skip confirmation, proceed directly to publish

**If NOT autoMode:**
- Ask: "Article ready. Publish? (yes/no)"

### Publish Actions

1. Update meta.json: `"published": true`
2. Archive scrape:
   ```bash
   mkdir -p scrapes/archive && mv {scrapePath} scrapes/archive/
   ```
3. Commit and push:
   ```bash
   git add public/data/blog/{slug}/ public/blog/{slug}/ public/data/blog/index.json
   git commit -m "content: Add {article-title} article"
   git push origin
   ```

### Final Report
```
✅ Article published!
📍 URL: /blog/{slug}
📊 Variants: tired (slides), medium
📦 Pushed to origin
🗄️ Scrape archived
```

---

## Quality Checklist

✅ Core argument clear in overview
✅ Every major point covered
✅ No rambling or circular logic
✅ Sources cited with context
✅ Hero image selected
✅ Descriptive image filenames
✅ Valid metadata JSON (correct date!)
✅ Complete YouTube attribution
✅ index.json updated
✅ All image references exist
✅ Article page renders without errors
✅ Article appears on blog home listing
✅ Both tone variants aligned
✅ Tired mode uses slides format
✅ Review agent passed (no high-severity issues)
✅ Proper nouns match source transcript
✅ Source scrape archived
✅ Changes committed and pushed
