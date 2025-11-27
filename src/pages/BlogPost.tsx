import { useParams, Link } from 'react-router-dom';
import { Container, Title, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { useEnergyLevel } from '../context/EnergyLevelContext';
import { SlideshowView } from '../components/SlideshowView';
import styles from './BlogPost.module.css';

interface PostMeta {
  title: string;
  date: string;
  category: string;
  videoId: string;
  published: boolean;
  excerpt: string;
}

interface Slide {
  title?: string;
  content: string;
}

interface TiredContent {
  format: 'slides';
  slides: Slide[];
}

interface TonesData {
  tired: string | TiredContent;
  medium: string;
  energized: string;
}

function removeFrontmatter(text: string): string {
  return text.replace(/^---[\s\S]*?---\n/, '');
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { energyLevel } = useEnergyLevel();
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<PostMeta | null>(null);
  const [tones, setTones] = useState<TonesData | null>(null);
  const [error, setError] = useState<string>('');

  // Fetch meta.json and tones.json once
  useEffect(() => {
    if (!slug) return;

    // Fetch meta.json
    fetch(`/data/blog/${slug}/meta.json`)
      .then(res => res.json())
      .then(data => setMeta(data))
      .catch(() => setError('Post not found'));

    // Try to fetch tones.json (may not exist for all articles)
    fetch(`/data/blog/${slug}/tones.json`)
      .then(res => {
        if (!res.ok) throw new Error('No tones');
        return res.json();
      })
      .then(data => setTones(data))
      .catch(() => {
        // tones.json doesn't exist, that's okay
        setTones(null);
      });
  }, [slug]);

  // Update content when energy level or tones change
  useEffect(() => {
    if (!slug) return;

    // If we have tones and an energy level, use the toned content
    if (tones && energyLevel) {
      const tonedContent = tones[energyLevel];
      if (tonedContent) {
        // If it's slides format, don't set content (slideshow handles it)
        if (typeof tonedContent === 'object' && tonedContent.format === 'slides') {
          setContent(''); // Clear content, slideshow will render
          return;
        }
        // String format - use as markdown
        if (typeof tonedContent === 'string') {
          setContent(removeFrontmatter(tonedContent));
          return;
        }
      }
    }

    // Fall back to article.md
    fetch(`/data/blog/${slug}/article.md`)
      .then(res => res.text())
      .then(text => setContent(removeFrontmatter(text)))
      .catch(() => setError('Article content not found'));
  }, [slug, energyLevel, tones]);

  if (error) {
    return (
      <Container size="md" py="xl">
        <Title order={1}>404</Title>
        <Text>Post not found</Text>
        <Link to="/">← Back to home</Link>
      </Container>
    );
  }

  if (!meta) {
    return (
      <Container size="md" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  // Check if we should show slideshow (tired mode with slides format)
  const tiredContent = tones?.tired;
  const showSlideshow = energyLevel === 'tired' &&
    typeof tiredContent === 'object' &&
    tiredContent?.format === 'slides';

  if (showSlideshow && tiredContent && 'slides' in tiredContent) {
    return (
      <SlideshowView
        slides={tiredContent.slides}
        articleTitle={meta.title}
      />
    );
  }

  return (
    <div className={styles.page} data-energy={energyLevel || 'medium'}>
      <Container size="md" className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to articles
        </Link>

        <article className={styles.article}>
          <header className={styles.header}>
            <Text className={styles.category}>{meta.category.toUpperCase()}</Text>
            <Title order={1} className={styles.title}>
              {meta.title}
            </Title>
            <Text className={styles.date}>
              {new Date(meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </header>

          <div className={styles.content}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </article>

        <Link to="/" className={styles.backLink}>
          ← Back to articles
        </Link>
      </Container>
    </div>
  );
}
