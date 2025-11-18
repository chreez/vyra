import { useParams } from 'react-router-dom';
import { Container, Title, Text, Textarea, Button, Image, Stack, Badge, Group, Paper } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { INFINITE_MONEY_GLITCH_ARTICLE, ArticleData } from '../data/article-review-2-data';
import styles from './ArticleReview2.module.css';

export function ArticleReview2() {
  const { slug } = useParams<{ slug: string }>();
  const [sectionFeedback, setSectionFeedback] = useState<Record<number, string>>({});
  const [generalComments, setGeneralComments] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<number>(0);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const article: ArticleData = INFINITE_MONEY_GLITCH_ARTICLE; // In production, fetch based on slug

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better UX

      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionFeedback = (index: number, value: string) => {
    setSectionFeedback({ ...sectionFeedback, [index]: value });
  };

  const handleSubmitReview = async () => {
    const reviewPayload = {
      slug: article.slug,
      title: article.title,
      sectionFeedback,
      generalComments,
      timestamp: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(reviewPayload, null, 2);

    try {
      await navigator.clipboard.writeText(jsonString);
      alert('Review 2 feedback copied to clipboard!');
    } catch (err) {
      console.log('=== REVIEW 2 FEEDBACK ===');
      console.log(jsonString);
      console.log('=========================');
      alert('Failed to copy to clipboard. Check console for JSON payload.');
    }
  };

  return (
    <div className={styles.page}>
      {/* Two-column layout */}
      <div className={styles.layout}>
        {/* Left: Article Preview */}
        <div className={styles.articleColumn}>
          <Container size="md" className={styles.articleContainer}>
            {/* Header */}
            <header className={styles.header}>
              <Badge className={styles.categoryBadge}>{article.category.toUpperCase()}</Badge>
              <Title order={1} className={styles.title}>
                {article.title}
              </Title>
            </header>

            {/* Hero Image */}
            <Image
              src={article.heroImage}
              alt="Hero image"
              className={styles.heroImage}
            />

            {/* Article Sections */}
            <div className={styles.articleContent}>
              {article.sections.map((section, idx) => (
                <div
                  key={idx}
                  ref={(el) => (sectionRefs.current[idx] = el)}
                  className={styles.section}
                  data-section-index={idx}
                >
                  <Title order={2} className={styles.sectionTitle}>
                    {section.title}
                  </Title>

                  {section.selectedImage && (
                    <Image
                      src={section.selectedImage}
                      alt={section.title}
                      className={styles.sectionImage}
                    />
                  )}

                  <div className={styles.sectionContent}>
                    {section.content.split('\n\n').map((paragraph, pIdx) => {
                      // Handle h2 headings
                      if (paragraph.startsWith('## ')) {
                        return (
                          <Title key={pIdx} order={3} className={styles.subheading}>
                            {paragraph.replace('## ', '')}
                          </Title>
                        );
                      }

                      // Handle h3 headings
                      if (paragraph.startsWith('### ')) {
                        return (
                          <Title key={pIdx} order={4} className={styles.subsubheading}>
                            {paragraph.replace('### ', '')}
                          </Title>
                        );
                      }

                      // Handle markdown lists
                      if (paragraph.startsWith('-')) {
                        const items = paragraph.split('\n').filter(line => line.trim());
                        return (
                          <ul key={pIdx} className={styles.list}>
                            {items.map((item, iIdx) => {
                              // Keep bold formatting in list items
                              const parts = item.replace(/^- /, '').split('**');
                              return (
                                <li key={iIdx}>
                                  {parts.map((part, partIdx) =>
                                    partIdx % 2 === 1 ? <strong key={partIdx}>{part}</strong> : part
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }

                      // Handle bold text in paragraphs
                      const parts = paragraph.split('**');
                      return (
                        <Text key={pIdx} className={styles.paragraph}>
                          {parts.map((part, partIdx) =>
                            partIdx % 2 === 1 ? <strong key={partIdx}>{part}</strong> : part
                          )}
                        </Text>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* YouTube Attribution */}
              <Paper className={styles.attribution}>
                <Title order={3} className={styles.attributionTitle}>
                  Source
                </Title>
                <Text className={styles.attributionText}>
                  This guide is based on the video by <strong>{article.youtubeCreator}</strong>.
                </Text>
                <a
                  href={`https://youtube.com/watch?v=${article.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attributionLink}
                >
                  <Image
                    src={article.youtubeThumbnail}
                    alt={article.title}
                    className={styles.attributionThumbnail}
                  />
                </a>
                <Button
                  component="a"
                  href={`https://youtube.com/watch?v=${article.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  mt="md"
                  fullWidth
                >
                  Watch the original video →
                </Button>
              </Paper>
            </div>
          </Container>
        </div>

        {/* Right: Sticky Feedback Sidebar */}
        <div className={styles.feedbackColumn}>
          <Paper className={styles.feedbackPanel}>
            <Title order={4} className={styles.feedbackTitle}>
              Review Feedback
            </Title>

            <Text size="sm" c="dimmed" mb="md">
              Currently viewing: <strong>Section {currentSection + 1}</strong>
            </Text>

            <Stack gap="lg">
              {/* Section-specific feedback */}
              <div>
                <Text size="sm" fw={600} mb="xs">
                  Section {currentSection + 1}: {article.sections[currentSection].title}
                </Text>
                <Textarea
                  placeholder={`Feedback for section ${currentSection + 1}...`}
                  value={sectionFeedback[currentSection] || ''}
                  onChange={(e) => handleSectionFeedback(currentSection, e.currentTarget.value)}
                  minRows={4}
                  className={styles.feedbackInput}
                />
              </div>

              {/* Quick jump to sections */}
              <div>
                <Text size="sm" fw={600} mb="xs">
                  Jump to section:
                </Text>
                <Stack gap="xs">
                  {article.sections.map((section, idx) => (
                    <Button
                      key={idx}
                      variant={currentSection === idx ? 'filled' : 'subtle'}
                      size="xs"
                      onClick={() => {
                        sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={styles.jumpButton}
                    >
                      {idx + 1}. {section.title}
                    </Button>
                  ))}
                </Stack>
              </div>

              {/* General comments */}
              <div>
                <Text size="sm" fw={600} mb="xs">
                  General Comments
                </Text>
                <Textarea
                  placeholder="Overall feedback about the article..."
                  value={generalComments}
                  onChange={(e) => setGeneralComments(e.currentTarget.value)}
                  minRows={6}
                  className={styles.feedbackInput}
                />
              </div>

              {/* Submit button */}
              <Button
                size="md"
                onClick={handleSubmitReview}
                className={styles.submitButton}
                fullWidth
              >
                Submit Review 2 Feedback
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                Feedback will be copied to clipboard as JSON
              </Text>
            </Stack>
          </Paper>
        </div>
      </div>
    </div>
  );
}
