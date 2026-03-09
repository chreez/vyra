---
description: Generate practice notes from YouTube scrape data
---

# YouTube Practice Notes Generator

You are processing a YouTube video scrape into atomic practice notes — phone-scannable drill cards with minimal activation energy.

**Invocation:**
```
/generate-notes [path] [--auto]
```

- `path` - Optional. Scrape directory (default: most recent in project root matching `*_*` pattern, then `scrapes/`)
- `--auto` - Skip all confirmation prompts, auto-publish at end

**Workflow Overview:**
1. Parse arguments & locate scrape
2. Parallel analysis (2 sub-agents)
3. Generate notes + metadata
4. Review agent (source fidelity check — BEFORE deployment)
5. Deploy & publish

---

## Step 1: Parse Arguments

**Parse the command arguments:**
- Check if `--auto` flag is present → set `autoMode = true`
- Check if a path argument is provided → use as input path
- If no path: find most recent scrape directory (check project root for `*_*` directories with `metadata.json`, then `scrapes/`, exclude `.` prefixed, sort by mtime)

**Validate scrape directory has required files:**
- `metadata.json` (required)
- `transcript.txt` (required)
- `video-context.json` (optional but preferred)

Report:
```
📂 Scrape: {scrapePath}
⚡ Mode: {autoMode ? "Auto (no prompts)" : "Interactive"}
```

---

## Step 2: Parallel Analysis

**Launch 2 sub-agents in parallel using the Task tool:**

### Agent 1: Drill Extractor
```
Use Task tool with subagent_type="general-purpose":

Prompt: "Extract practice drills from a YouTube video about music/guitar.

Read these files from {scrapePath}:
- transcript.txt
- video-context.json (if exists)

Your job: identify every distinct practice exercise, technique drill, or actionable routine described in the video. Organize by CONCEPT, not video timeline.

Return JSON:
{
  "setupSteps": [
    "Sit down with your guitar",
    "Open this page on your phone",
    "Set metronome to [BPM from video or 60]"
  ],
  "drills": [
    {
      "name": "Short descriptive name",
      "justStart": "Single physical body movement to begin — e.g. 'Place your left hand on the neck at fret 5'. MUST be a physical action, NEVER 'understand X' or 'think about X'",
      "steps": [
        "One atomic action per step — no 'and' joining two actions",
        "Each step is something you physically DO",
        "Include specific frets, fingers, strings when mentioned"
      ],
      "tip": "One-line insight from the instructor (use their words when possible)",
      "focus": "1-2 word focus area (e.g. 'right hand', 'chord prep', 'slow practice')",
      "bpm": "Tempo if mentioned, otherwise null"
    }
  ],
  "defaultBpm": "Overall tempo recommendation if given, otherwise 60"
}

Rules:
- One action per step. Split 'Place finger on fret 5 and pluck the string' into two steps.
- justStart is ALWAYS a physical body movement, never cognitive.
- Organize by concept/technique, not by video timestamp.
- Use the instructor's exact terminology for technique names.
- If the video describes a general approach (e.g. 'practice slowly'), convert it into concrete physical steps.

Do NOT write any files. Research only."
```

### Agent 2: Metadata Extractor
```
Use Task tool with subagent_type="general-purpose":

Prompt: "Extract metadata from YouTube scrape.

Read: {scrapePath}/metadata.json

Return JSON:
{
  "videoId": "...",
  "title": "Original video title",
  "shortTitle": "Mobile-friendly short version (max 50 chars)",
  "slug": "url-safe-slug-max-50-chars",
  "category": "education",
  "channelName": "..."
}

Slug rules:
- Lowercase, hyphens only
- Max 50 chars
- Descriptive of the CONTENT, not the video title marketing

Do NOT write any files. Research only."
```

**Wait for both agents to complete, then merge results.**

### Confirmation (skip if autoMode)

If NOT autoMode, show summary and ask:
```
📹 Video: [Title]
👤 Channel: [Channel name]
🎯 Drills found: [count]
🎸 Default BPM: [bpm]

Proceed? (yes/no)
```

---

## Step 3: Generate Notes

Using merged analysis, generate the notes content.

### Create Output Structure
```
{scrapePath}/curated/
├── article.md
└── metadata.json
```

### article.md Format

```markdown
---
title: [From metadata shortTitle]
description: [One-line summary of what you'll practice]
---

## Before You Start
1. [setupStep 1]
2. [setupStep 2]
3. [setupStep 3]

---

## Drill 1: [Name]
**Just start:** [justStart — single physical action]
1. [Atomic step]
2. [Atomic step]
3. [Atomic step]
> **Tip:** [One-line insight from instructor]

---

## Drill 2: [Name]
**Just start:** [justStart]
1. [Step]
2. [Step]
> **Tip:** [tip]

---

[...repeat for all drills...]

---

## Quick Reference
| Drill | Focus | BPM |
|-------|-------|-----|
| [Name] | [focus] | [bpm or —] |

---

## Source
Based on video by **[channelName]**.
[![Thumbnail](https://img.youtube.com/vi/{videoId}/maxresdefault.jpg)](https://youtube.com/watch?v={videoId})
```

### Content Rules

1. **No prose paragraphs** — only numbered steps, bold labels, blockquote tips, table rows
2. **One action per step** — no "and" joining two actions
3. **justStart is always physical** — a body movement, never "understand X"
4. **Horizontal rules between drills** — visual card boundaries on mobile
5. **Quick Reference table** — pick-from-list for returning users
6. **Use instructor's terminology** — don't normalize or simplify their words

### metadata.json

```json
{
  "title": "Short Title",
  "date": "YYYY-MM-DD",
  "category": "education",
  "videoId": "YouTube video ID",
  "published": false,
  "excerpt": "1-2 sentence summary of what drills are covered",
  "scrapePath": "relative/path/to/scrape"
}
```

**IMPORTANT:** Use today's actual date for the `date` field.

---

## Step 4: Review Agent (Source Fidelity Check)

**This runs BEFORE deployment — fixes are cheaper here.**

**Launch review sub-agent:**

```
Use Task tool with subagent_type="general-purpose":

Prompt: "You are a review agent. Cross-reference generated practice notes against the original transcript.

Read these files:
- {scrapePath}/curated/article.md (the generated notes)
- {scrapePath}/transcript.txt (original video transcript)
- {scrapePath}/video-context.json (if exists)

Perform these checks:

1. **Terminology Fidelity**
   Compare every technique name, exercise name, and musical term in the notes against the transcript. Flag:
   - Terms that were paraphrased or 'improved' (notes should use the instructor's exact words)
   - Terms not found in the transcript (possible hallucinations)

2. **Step Accuracy**
   For each drill step, verify it matches what the instructor actually described. Flag:
   - Steps that add actions not in the transcript
   - Steps that contradict the instructor's description
   - Fret numbers, finger numbers, or string references that differ from transcript

3. **Omission Check**
   Identify any exercises or techniques from the transcript that the notes omit entirely.

4. **Format Check**
   - Every step has exactly ONE action (no 'and' joining two actions)
   - justStart entries are physical body movements, not cognitive
   - No prose paragraphs leaked into the notes
   - Horizontal rules separate each drill

Return a structured report:
{
  'terminologyIssues': [
    {'notes': '...', 'transcript': '...', 'severity': 'high|medium|low'}
  ],
  'stepIssues': [
    {'drill': '...', 'step': '...', 'issue': '...', 'severity': 'high|medium|low'}
  ],
  'omissions': [
    {'topic': '...', 'severity': 'medium|low'}
  ],
  'formatIssues': [
    {'issue': '...', 'location': '...', 'severity': 'high|medium'}
  ],
  'summary': 'One paragraph overall assessment'
}

Do NOT modify any files. Review only."
```

### Handle Review Results

**If issues with severity=high exist:**
- If NOT autoMode: Present the report and ask user how to proceed
- If autoMode: Apply fixes automatically, but flag high-severity issues to the user

**If only medium/low issues:** Apply corrections and proceed.

**Apply fixes to:** `{scrapePath}/curated/article.md`

---

## Step 5: Deploy & Publish

### Deploy Files

**Run these operations:**

```bash
# Create directory
mkdir -p public/data/blog/{slug}
```

```bash
# Copy content files
cp {scrapePath}/curated/article.md public/data/blog/{slug}/article.md
cp {scrapePath}/curated/metadata.json public/data/blog/{slug}/meta.json
```

**No image directory needed** — notes use YouTube thumbnail only.

**Update manifest** (must be sequential):
- Read `public/data/blog/index.json`
- Add slug if not present
- Write back

### Start Dev Server (if needed)
```bash
lsof -i :5173 || npm run dev &
```

### Verify Article Page
1. Navigate browser to `http://localhost:5173/blog/{slug}`
2. Take screenshot → verify notes render correctly
3. Check console for errors
4. Verify:
   - Drills display as separate cards with horizontal rules
   - Quick Reference table renders
   - YouTube thumbnail shows in Source section
   - No prose paragraphs visible

### Verify Blog Home Listing
1. Navigate browser to `http://localhost:5173/`
2. Take screenshot → verify new article appears in list
3. Confirm title, category, and date display correctly

### Publish Decision

**If autoMode:**
- Skip confirmation, proceed directly to publish

**If NOT autoMode:**
- Open browser: `open http://localhost:5173/blog/{slug}`
- Ask: "Notes ready. Publish? (yes/no)"

### Publish Actions

1. Update meta.json: `"published": true`
2. Archive scrape:
   ```bash
   mkdir -p scrapes/archive && mv {scrapePath} scrapes/archive/
   ```
   (If scrape is in project root, move to `scrapes/archive/`)
3. Commit and push:
   ```bash
   git add public/data/blog/{slug}/ public/data/blog/index.json
   git commit -m "content: Add {shortTitle} practice notes"
   git push origin
   ```

### Final Report
```
✅ Practice notes published!
📍 URL: /blog/{slug}
🎯 Drills: [count]
📦 Pushed to origin
🗄️ Scrape archived
```

---

## Quality Checklist

✅ Every drill has a physical justStart action
✅ One action per step (no "and")
✅ No prose paragraphs — only steps, labels, tips, tables
✅ Instructor's exact terminology preserved
✅ Quick Reference table complete
✅ YouTube thumbnail attribution present
✅ Valid metadata JSON (correct date!)
✅ index.json updated
✅ Article page renders without errors
✅ Article appears on blog home listing
✅ Review agent passed before deployment
✅ Source scrape archived
✅ Changes committed and pushed
