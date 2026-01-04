import { useEffect, useState, useMemo } from 'react';
import { Container, Title, Text, Anchor, Loader } from '@mantine/core';
import { IntroSplash } from '../components/IntroSplash';
import { CategoryTabs, type Category } from '../components/CategoryTabs';
import { SearchFAB } from '../components/SearchFAB';
import styles from './BlogHome.module.css';

// Version the key to bust cache when needed
const STORAGE_VERSION = 'v2';
const STORAGE_KEY = `vyra-intro-dismissed-${STORAGE_VERSION}`;

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

const ALL_CATEGORIES: Category[] = ['all', 'health', 'finance', 'technology', 'education'];

export function BlogHome() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setShowSplash(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowSplash(false);
  };

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

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category.toLowerCase() !== selectedCategory) {
        return false;
      }
      // Search filter (title + excerpt)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        if (!matchesTitle && !matchesExcerpt) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

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
      {showSplash && <IntroSplash onDismiss={handleDismiss} />}

      <Container size="lg" className={styles.container}>
        <div className={styles.filterBar}>
          <CategoryTabs
            categories={ALL_CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <SearchFAB value={searchQuery} onChange={setSearchQuery} />
        </div>

        <main className={styles.articleList}>
          {filteredPosts.length === 0 ? (
            <div className={styles.noResults}>
              <Text className={styles.noResultsText}>
                {searchQuery
                  ? `No articles found for "${searchQuery}"`
                  : `No articles in ${selectedCategory}`}
              </Text>
            </div>
          ) : null}
          {filteredPosts.map((post) => (
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
