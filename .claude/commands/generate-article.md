---
description: Generate blog article from YouTube scrape data
---

# YouTube Article Generator

You are processing a YouTube video scrape into a blog article. Follow these steps:

## Input Path

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

## Output Structure

Create TWO outputs:

### 1. Curated artifacts (for review)
`{input-directory}/curated/`
```
curated/
├── article.md
├── metadata.json
└── images/
    ├── hero-candidate-1.jpg
    ├── hero-candidate-2.jpg
    ├── hero-candidate-3.jpg
    ├── [descriptive-name].jpg
    └── image-selection-metadata.json
```

### 2. Vyra structure (for deployment)
```
public/data/blog/{slug}/
├── article.md
└── meta.json

public/blog/{slug}/
└── [all curated images]
```

## Article Format

**article.md structure:**
```markdown
---
title: [Extracted from video title]
description: [1-2 sentence summary]
---

# [Article Title]

## Overview
[2-3 paragraphs explaining the video's core argument/thesis]

## Main Arguments

### [Point 1: Claim]
[Evidence and reasoning - de-duplicated, no rambling]

![Description](/blog/{slug}/image-name.jpg)

[Source citations if mentioned in video]

### [Point 2: Claim]
[Evidence and reasoning]

...

## Key Takeaways
- [Actionable/memorable bullet points]
- [Main conclusions without fluff]

## Sources Referenced
- [Any articles, studies, data mentioned in video]
- [Include timestamps if specific]

---

## Source

This guide is based on the video by [Creator Name from metadata].

[![Video Title](thumbnail-url-from-metadata)](https://youtube.com/watch?v={videoId})

[Watch the original video →](https://youtube.com/watch?v={videoId})
```

## Content Requirements

1. **De-duplicate** - Videos repeat points. State each argument once, clearly.
2. **Extract claims + justifications** - Use "X is true BECAUSE Y" structure
3. **Pull citations** - Note any sources, studies, examples mentioned
4. **Ignore tangents** - Cut rambling and off-topic digressions
5. **Preserve nuance** - Keep caveats and counter-arguments if mentioned
6. **Be exhaustive** - Cover ALL major points, not just highlights

## Metadata Files

**curated/metadata.json:**
```json
{
  "title": "string - video title",
  "date": "YYYY-MM-DD - curation date (today)",
  "category": "string - auto-categorized",
  "videoId": "string - from parent metadata.json",
  "published": false
}
```

**public/data/blog/{slug}/meta.json** (same content, just copied)

**Categories:**
- `finance` - Economics, business, investing, markets
- `technology` - Tech trends, software, hardware, AI
- `education` - Tutorials, how-to, learning
- `analysis` - Deep dives, research, investigative
- `commentary` - Opinion, reaction, discussion

## Image Selection

**Hero Candidates (1-5 images):**
- Name as: `hero-candidate-1.jpg`, `hero-candidate-2.jpg`, etc.
- Criteria: High engagement (heatmap), visual impact, represents content

**Article Images:**
- Use **descriptive filenames**: `chart-revenue-growth.jpg`, `quote-expert.jpg`
- Criteria: Shows data/charts, contains text, illustrates key points

**image-selection-metadata.json:**
```json
{
  "hero_candidates": [
    {
      "filename": "hero-candidate-1.jpg",
      "original_timestamp": "HH-MM-SS",
      "confidence": 0.95,
      "selection_reason": "Heatmap peak (0.95) + chart showing revenue data",
      "description": "Revenue growth comparison chart",
      "heatmap_value": 0.85,
      "scene_type": "chart"
    }
  ],
  "article_images": [
    {
      "filename": "chart-revenue-growth.jpg",
      "original_timestamp": "HH-MM-SS",
      "confidence": 0.90,
      "selection_reason": "Supports main argument about revenue",
      "description": "Oracle revenue growth comparison",
      "heatmap_value": 0.85,
      "scene_type": "chart",
      "suggested_placement": "section_2",
      "supports_argument": "Oracle's revenue growth strategy"
    }
  ]
}
```

## Final Steps

After generating all files:

1. **Update BlogHome.tsx** - Add new article to posts array (keep alphabetical by date, newest first)
2. **Set published: false** - Requires manual review before publishing
3. **Report outputs:**
   - Curated artifacts location
   - Vyra structure location
   - Localhost link: `http://localhost:5173/blog/{slug}`

## Quality Checklist

✅ Core argument clear in first 3 paragraphs
✅ Every major point covered
✅ No rambling or circular logic
✅ Sources cited with context
✅ 1-5 strong hero candidates
✅ Descriptive image filenames
✅ Valid metadata JSON
✅ Complete YouTube attribution
✅ BlogHome.tsx updated
✅ All image references exist

**Focus on quality over speed. Exhaustive coverage beats brevity.**
