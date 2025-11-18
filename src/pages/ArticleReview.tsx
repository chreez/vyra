import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Textarea, Button, Image, Stack, Card, Badge, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import styles from './ArticleReview.module.css';

interface ArticleSection {
  title: string;
  description: string;
  imageOptions: string[]; // Multiple images to choose from per section
}

interface ArticleOutline {
  title: string;
  slug: string;
  category: string;
  videoId: string;
  sections: ArticleSection[];
  heroImageOptions: string[];
}

// This would come from a data file or API in production
const SAMPLE_OUTLINE: ArticleOutline = {
  title: "The Infinite Money Glitch - Understanding AI's Circular Investment Pattern",
  slug: "the-infinite-money-glitch",
  category: "finance",
  videoId: "vV4XF-VUTb8",
  heroImageOptions: [
    "/blog/the-infinite-money-glitch/00-00-20.jpg",
    "/blog/the-infinite-money-glitch/00-06-00.jpg",
    "/blog/the-infinite-money-glitch/00-14-45.jpg",
  ],
  sections: [
    {
      title: "Introduction: The $100B Investment",
      description: "OpenAI and Nvidia partnership announcement that shook the tech world, setting the stage for understanding the circular investment pattern.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-00-15.jpg",
        "/blog/the-infinite-money-glitch/00-00-20.jpg",
        "/blog/the-infinite-money-glitch/00-00-25.jpg",
      ]
    },
    {
      title: "Finance 101: Revenue vs Profit",
      description: "Using a bicycle shop analogy to explain top line (revenue) vs bottom line (profit) - fundamental concepts needed to understand what follows.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-01-00.jpg",
        "/blog/the-infinite-money-glitch/00-01-05.jpg",
        "/blog/the-infinite-money-glitch/00-01-15.jpg",
      ]
    },
    {
      title: "Oracle's Mysterious Stock Surge",
      description: "How Oracle's stock skyrocketed 30% despite missing revenue and profit expectations. Introduction to RPO (Remaining Performance Obligations).",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-02-30.jpg",
        "/blog/the-infinite-money-glitch/00-02-40.jpg",
        "/blog/the-infinite-money-glitch/00-02-50.jpg",
      ]
    },
    {
      title: "The Triangle Emerges",
      description: "Connecting the dots: OpenAI rents from Oracle, Oracle buys from Nvidia. The circular flow of hundreds of billions of dollars.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-05-35.jpg",
        "/blog/the-infinite-money-glitch/00-06-00.jpg",
        "/blog/the-infinite-money-glitch/00-06-05.jpg",
      ]
    },
    {
      title: "The Missing Piece: Where's The Money?",
      description: "Sam Altman's quest for 'financial innovation' - where does OpenAI get the money to pay Oracle to pay Nvidia?",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-05-35.jpg",
        "/blog/the-infinite-money-glitch/00-05-40.jpg",
      ]
    },
    {
      title: "Historical Echo: The Dotcom Bubble",
      description: "Flashback to 2001 and the 'vendor financing' scheme that extended the dotcom bubble. Eerie parallels to today.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-07-00.jpg",
        "/blog/the-infinite-money-glitch/00-07-05.jpg",
        "/blog/the-infinite-money-glitch/00-07-10.jpg",
      ]
    },
    {
      title: "Nvidia's Growing Portfolio",
      description: "CoreWeave ($6.3B), InScale ($1.1B), and other examples of Nvidia financing the companies that buy Nvidia chips.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-10-05.jpg",
        "/blog/the-infinite-money-glitch/00-10-10.jpg",
        "/blog/the-infinite-money-glitch/00-10-15.jpg",
      ]
    },
    {
      title: "The Leakage Problem",
      description: "Why the circle isn't perfect - salaries, construction, land costs mean money is lost with each rotation.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-12-00.jpg",
        "/blog/the-infinite-money-glitch/00-12-05.jpg",
      ]
    },
    {
      title: "You Are The Money Source",
      description: "How 401Ks, Wall Street, and retail investors fuel the loop by piling into these 'growing' companies.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-13-00.jpg",
        "/blog/the-infinite-money-glitch/00-13-05.jpg",
      ]
    },
    {
      title: "Two Possible Endings",
      description: "Optimistic: AGI arrives and pays for everything. Pessimistic: OpenAI can't make payments and the triangle breaks.",
      imageOptions: [
        "/blog/the-infinite-money-glitch/00-14-45.jpg",
        "/blog/the-infinite-money-glitch/00-14-50.jpg",
      ]
    },
  ],
};

export function ArticleReview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Track review phase - stored in localStorage
  const [reviewPhase, setReviewPhase] = useState<1 | 2>(1);

  // Review 1 state - image selection
  const [selectedHeroImage, setSelectedHeroImage] = useState<string | null>(null);
  const [sectionImageSelections, setSectionImageSelections] = useState<Record<number, string>>({});
  const [sectionReviews, setSectionReviews] = useState<Record<number, string>>({});
  const [generalComments, setGeneralComments] = useState<string>('');

  // Load review phase from localStorage
  useEffect(() => {
    const savedPhase = localStorage.getItem(`review-phase-${slug}`);
    if (savedPhase === '2') {
      setReviewPhase(2);

      // Load Review 1 data
      const savedReview1 = localStorage.getItem(`review1-data-${slug}`);
      if (savedReview1) {
        const data = JSON.parse(savedReview1);
        setSelectedHeroImage(data.selectedHeroImage);
        setSectionImageSelections(data.sectionImageSelections);
      }
    }
  }, [slug]);

  const outline = SAMPLE_OUTLINE; // In production, fetch based on slug

  const handleSectionContent = (index: number, value: string) => {
    setSectionContent({ ...sectionContent, [index]: value });
  };

  const handleSubmitReview = () => {
    const reviewPayload = {
      slug: outline.slug,
      title: outline.title,
      category: outline.category,
      videoId: outline.videoId,
      heroImage: review1Data.selectedHeroImage,
      sections: outline.sections.map((section, idx) => ({
        title: section.title,
        description: section.description,
        selectedImage: review1Data.sectionImageSelections[idx.toString()],
        content: sectionContent[idx] || '',
      })),
      generalComments,
      timestamp: new Date().toISOString(),
    };

    console.log('=== REVIEW 2 PAYLOAD (DRAFT ARTICLE) ===');
    console.log(JSON.stringify(reviewPayload, null, 2));
    console.log('=========================================');

    alert('Draft submitted! Check console for JSON payload.');
  };

  return (
    <div className={styles.page}>
      <Container size="md" className={styles.container}>
        <header className={styles.header}>
          <Badge className={styles.categoryBadge}>{outline.category.toUpperCase()}</Badge>
          <Title order={1} className={styles.title}>
            Review 2: Write Article Content
          </Title>
          <Text className={styles.subtitle}>
            Write content for each section. Selected images from Review 1 are shown.
          </Text>
        </header>

        {/* Hero Image Display */}
        <Card className={styles.imageSection}>
          <Title order={3} className={styles.sectionTitle}>
            Hero Image (Selected)
          </Title>
          <Image
            src={review1Data.selectedHeroImage}
            alt="Hero image"
            className={styles.imagePreview}
            style={{ maxWidth: '400px' }}
          />
          <Text size="sm" mt="xs" c="dimmed">
            {review1Data.selectedHeroImage}
          </Text>
        </Card>

        {/* Article Sections with Content */}
        <div className={styles.outlineSection}>
          <Title order={3} className={styles.sectionTitle}>
            Article Sections
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Write the content for each section below
          </Text>

          <Stack gap="xl">
            {outline.sections.map((section, idx) => {
              const selectedImage = review1Data.sectionImageSelections[idx.toString()];
              return (
                <Card key={idx} className={styles.sectionCard}>
                  <Group justify="space-between" mb="md">
                    <Title order={4} className={styles.sectionNumber}>
                      Section {idx + 1}
                    </Title>
                    {selectedImage !== 'none' && (
                      <Badge variant="light" color="blue">
                        Image selected
                      </Badge>
                    )}
                  </Group>

                  <Title order={5} className={styles.sectionHeading}>
                    {section.title}
                  </Title>
                  <Text size="sm" c="dimmed" mb="md">
                    {section.description}
                  </Text>

                  {/* Display Selected Image */}
                  {selectedImage && selectedImage !== 'none' && (
                    <div className={styles.sectionImageSelection}>
                      <Text size="sm" fw={600} mb="xs">
                        Selected image:
                      </Text>
                      <Image
                        src={selectedImage}
                        alt={`Section ${idx + 1} image`}
                        className={styles.sectionImagePreview}
                        style={{ maxWidth: '300px' }}
                      />
                      <Text size="xs" mt="xs" c="dimmed">
                        {selectedImage.split('/').pop()}
                      </Text>
                    </div>
                  )}

                  {selectedImage === 'none' && (
                    <Text size="sm" c="dimmed" mb="md" fs="italic">
                      No image selected for this section
                    </Text>
                  )}

                  <Textarea
                    placeholder="Write the content for this section (markdown supported)..."
                    value={sectionContent[idx] || ''}
                    onChange={(e) => handleSectionContent(idx, e.currentTarget.value)}
                    minRows={6}
                    className={styles.reviewInput}
                    mt="md"
                  />
                </Card>
              );
            })}
          </Stack>
        </div>

        {/* General Comments */}
        <Card className={styles.generalCommentsSection}>
          <Title order={3} className={styles.sectionTitle}>
            General Notes
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Any additional notes or instructions for finalizing the article
          </Text>
          <Textarea
            placeholder="General notes about the article..."
            value={generalComments}
            onChange={(e) => setGeneralComments(e.currentTarget.value)}
            minRows={4}
            className={styles.reviewInput}
          />
        </Card>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <Button
            size="lg"
            onClick={handleSubmitReview}
            className={styles.submitButton}
          >
            Submit Article Draft
          </Button>
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            Draft will be logged to console as JSON
          </Text>
        </div>
      </Container>
    </div>
  );
}
