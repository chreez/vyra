import { Container, Title, Text, Anchor } from '@mantine/core';
import styles from './BlogHome.module.css';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  published: boolean;
}

// For now, manually import the sample post
// Later this will be dynamic based on file system or build script
const posts: BlogPost[] = [
  {
    slug: '6-laning-mistakes',
    title: '6 Laning Mistakes You\'re Making Every Game',
    date: '2024-11-17',
    category: 'finance',
    excerpt: 'Stop losing lanes to "bad luck" - learn the 6 biggest laning mistakes players make and how to fix them.',
    published: true,
  },
];

export function BlogHome() {
  const publishedPosts = posts.filter(post => post.published);

  return (
    <div className={styles.page}>
      <Container size="md" className={styles.container}>
        <header className={styles.header}>
          <Title order={1} className={styles.siteTitle}>Vyra</Title>
          <Text className={styles.tagline}>Guides & Insights</Text>
        </header>

        <main className={styles.articleList}>
          {publishedPosts.map((post) => (
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
