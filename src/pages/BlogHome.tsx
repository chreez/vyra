import { useEffect, useState } from 'react';
import { Container, Title, Text, Anchor, Loader } from '@mantine/core';
import styles from './BlogHome.module.css';

interface BlogMeta {
  title: string;
  date: string;
  category: string;
  videoId: string;
  published: boolean;
  excerpt: string;
}

interface BlogPost extends BlogMeta {
  slug: string;
}

export function BlogHome() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Fetch the manifest of all blog slugs
        const manifestRes = await fetch('/data/blog/index.json');
        const slugs: string[] = await manifestRes.json();

        // Fetch meta.json for each slug
        const postPromises = slugs.map(async (slug) => {
          const metaRes = await fetch(`/data/blog/${slug}/meta.json`);
          const meta: BlogMeta = await metaRes.json();
          return { ...meta, slug };
        });

        const allPosts = await Promise.all(postPromises);

        // Filter published and sort by date (newest first)
        const publishedPosts = allPosts
          .filter(post => post.published)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setPosts(publishedPosts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <Container size="lg" className={styles.container}>
          <Loader size="lg" />
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Container size="lg" className={styles.container}>
        <header className={styles.header}>
          <Title order={1} className={styles.siteTitle}>Vyra</Title>
          <Text className={styles.tagline}>Guides & Insights</Text>
        </header>

        <main className={styles.articleList}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.article}>
              <div className={styles.articleMeta}>
                <Text className={styles.category}>{post.category.toUpperCase()}</Text>
                <Text className={styles.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </div>

              <Anchor
                href={`/blog/${post.slug}`}
                className={styles.articleLink}
                underline="never"
              >
                <Title order={2} className={styles.articleTitle}>
                  {post.title}
                </Title>
              </Anchor>

              <Text className={styles.excerpt}>
                {post.excerpt}
              </Text>

              <div className={styles.divider} />
            </article>
          ))}
        </main>
      </Container>
    </div>
  );
}
