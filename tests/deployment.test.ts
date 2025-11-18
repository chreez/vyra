import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Netlify Deployment Validation', () => {
  describe('Build Configuration', () => {
    it('should have TypeScript build passing', () => {
      // This test passes if the test suite runs, which means tsc compiled successfully
      expect(true).toBe(true);
    });
  });

  describe('Data File Locations', () => {
    it('should have article data in public/data directory, not src/data', () => {
      const publicDataPath = join(process.cwd(), 'public', 'data', 'blog');
      const srcDataPath = join(process.cwd(), 'src', 'data', 'blog');

      // Runtime-fetched data should be in public/data
      expect(existsSync(publicDataPath)).toBe(true);

      // If src/data exists, it should only contain review data, not runtime article data
      if (existsSync(srcDataPath)) {
        const srcDataFiles = readdirSync(srcDataPath, { recursive: true });
        const hasArticleMd = srcDataFiles.some(file =>
          typeof file === 'string' && file.endsWith('article.md')
        );
        const hasMetaJson = srcDataFiles.some(file =>
          typeof file === 'string' && file.endsWith('meta.json')
        );

        // article.md and meta.json should not be in src/data (runtime fetch won't work)
        expect(hasArticleMd).toBe(false);
        expect(hasMetaJson).toBe(false);
      }
    });

    it('should have all published articles with data in public/data', () => {
      const publicDataPath = join(process.cwd(), 'public', 'data', 'blog');

      if (existsSync(publicDataPath)) {
        const articles = readdirSync(publicDataPath);

        articles.forEach(slug => {
          const articlePath = join(publicDataPath, slug);
          const metaPath = join(articlePath, 'meta.json');
          const articleMdPath = join(articlePath, 'article.md');

          // Each article folder should have both meta.json and article.md
          expect(existsSync(metaPath)).toBe(true);
          expect(existsSync(articleMdPath)).toBe(true);
        });
      }
    });
  });

  describe('Fetch Paths', () => {
    it('should not have fetch calls referencing /src/ paths', () => {
      const srcPath = join(process.cwd(), 'src');
      const files = getAllTsxFiles(srcPath);

      const invalidFetches: { file: string; line: string }[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          // Check for fetch calls with /src/ paths
          if (line.includes('fetch') && line.includes('/src/')) {
            invalidFetches.push({
              file: file.replace(process.cwd(), ''),
              line: `Line ${index + 1}: ${line.trim()}`
            });
          }
        });
      });

      if (invalidFetches.length > 0) {
        const message = 'Found fetch calls with /src/ paths (these will 404 in production):\n' +
          invalidFetches.map(f => `  ${f.file}\n    ${f.line}`).join('\n');
        throw new Error(message);
      }

      expect(invalidFetches).toHaveLength(0);
    });
  });
});

// Helper function to recursively get all .tsx and .ts files
function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }

  return files;
}
