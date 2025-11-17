import { useParams, Link } from 'react-router-dom';
import { Container, Title, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import styles from './BlogPost.module.css';

interface PostMeta {
  title: string;
  date: string;
  category: string;
  videoId: string;
  published: boolean;
  excerpt: string;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [meta, setMeta] = useState<PostMeta | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!slug) return;

    // Fetch meta.json
    fetch(`/src/data/blog/${slug}/meta.json`)
      .then(res => res.json())
      .then(data => setMeta(data))
      .catch(() => setError('Post not found'));

    // Fetch article.md
    fetch(`/src/data/blog/${slug}/article.md`)
      .then(res => res.text())
      .then(text => {
        // Remove frontmatter (everything between --- markers)
        const withoutFrontmatter = text.replace(/^---[\s\S]*?---\n/, '');
        setContent(withoutFrontmatter);
      })
      .catch(() => setError('Article content not found'));
  }, [slug]);

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

  return (
    <div className={styles.page}>
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
      </Container>
    </div>
  );
}
