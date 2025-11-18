import { Container, Title, Text, Textarea, Button, Image, Stack, Card, Badge, Radio } from '@mantine/core';
import { useState } from 'react';
import styles from './ArticleReview.module.css';

interface ArticleSection {
  title: string;
  description: string;
  imageOptions: string[];
}

interface ArticleOutline {
  title: string;
  slug: string;
  category: string;
  videoId: string;
  sections: ArticleSection[];
  heroImageOptions: string[];
}

export interface Review1Data {
  selectedHeroImage: string;
  sectionImageSelections: Record<string, string>;
  sectionReviews: Record<string, string>;
  generalComments: string;
}

interface ArticleReviewPhase1Props {
  slug: string;
  onComplete: (data: Review1Data) => void;
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

export function ArticleReviewPhase1({ onComplete }: ArticleReviewPhase1Props) {
  const [selectedHeroImage, setSelectedHeroImage] = useState<string | null>(null);
  const [sectionImageSelections, setSectionImageSelections] = useState<Record<number, string>>({});
  const [sectionReviews, setSectionReviews] = useState<Record<number, string>>({});
  const [generalComments, setGeneralComments] = useState<string>('');

  const outline = SAMPLE_OUTLINE; // In production, fetch based on slug

  const handleImageSelect = (sectionIndex: number | 'hero', imageUrl: string) => {
    if (sectionIndex === 'hero') {
      setSelectedHeroImage(imageUrl);
    } else {
      setSectionImageSelections({ ...sectionImageSelections, [sectionIndex]: imageUrl });
    }
  };

  const handleSectionReview = (index: number, value: string) => {
    setSectionReviews({ ...sectionReviews, [index]: value });
  };

  const handleSubmitReview1 = () => {
    if (!selectedHeroImage) {
      alert('Please select a hero image before proceeding.');
      return;
    }

    const reviewData: Review1Data = {
      selectedHeroImage,
      sectionImageSelections: Object.fromEntries(
        Object.entries(sectionImageSelections).map(([k, v]) => [k.toString(), v])
      ),
      sectionReviews: Object.fromEntries(
        Object.entries(sectionReviews).map(([k, v]) => [k.toString(), v])
      ),
      generalComments,
    };

    onComplete(reviewData);
  };

  return (
    <div className={styles.page}>
      <Container size="md" className={styles.container}>
        <header className={styles.header}>
          <Badge className={styles.categoryBadge}>{outline.category.toUpperCase()}</Badge>
          <Title order={1} className={styles.title}>
            Review 1: Select Images
          </Title>
          <Text className={styles.subtitle}>
            Choose the best images for the article hero and each section
          </Text>
        </header>

        {/* Hero Image Selection */}
        <Card className={styles.imageSection}>
          <Title order={3} className={styles.sectionTitle}>
            Hero Image
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Select the main image for the article
          </Text>
          <Stack gap="md">
            {outline.heroImageOptions.map((imageUrl, idx) => (
              <div
                key={idx}
                className={`${styles.imageOption} ${selectedHeroImage === imageUrl ? styles.selected : ''}`}
                onClick={() => handleImageSelect('hero', imageUrl)}
              >
                <Image
                  src={imageUrl}
                  alt={`Hero option ${idx + 1}`}
                  className={styles.imagePreview}
                />
                <Text size="xs" mt="xs" c="dimmed">
                  {imageUrl.split('/').pop()}
                </Text>
              </div>
            ))}
          </Stack>
        </Card>

        {/* Section Image Selections */}
        <div className={styles.outlineSection}>
          <Title order={3} className={styles.sectionTitle}>
            Section Images
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Choose images for each section (or select "No image")
          </Text>

          <Stack gap="xl">
            {outline.sections.map((section, idx) => (
              <Card key={idx} className={styles.sectionCard}>
                <Title order={4} className={styles.sectionNumber}>
                  Section {idx + 1}
                </Title>
                <Title order={5} className={styles.sectionHeading}>
                  {section.title}
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  {section.description}
                </Text>

                <Radio.Group
                  value={sectionImageSelections[idx] || ''}
                  onChange={(value) => handleImageSelect(idx, value)}
                >
                  <Stack gap="md">
                    <Radio value="none" label="No image for this section" />
                    {section.imageOptions.map((imageUrl, imgIdx) => (
                      <div key={imgIdx} className={styles.radioImageOption}>
                        <Radio value={imageUrl} label="" />
                        <div
                          className={`${styles.imageOption} ${sectionImageSelections[idx] === imageUrl ? styles.selected : ''}`}
                          onClick={() => handleImageSelect(idx, imageUrl)}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Section ${idx + 1} option ${imgIdx + 1}`}
                            className={styles.sectionImagePreview}
                          />
                          <Text size="xs" mt="xs" c="dimmed">
                            {imageUrl.split('/').pop()}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </Stack>
                </Radio.Group>

                <Textarea
                  placeholder={`Optional notes about section ${idx + 1}...`}
                  value={sectionReviews[idx] || ''}
                  onChange={(e) => handleSectionReview(idx, e.currentTarget.value)}
                  minRows={3}
                  className={styles.reviewInput}
                  mt="md"
                />
              </Card>
            ))}
          </Stack>
        </div>

        {/* General Comments */}
        <Card className={styles.generalCommentsSection}>
          <Title order={3} className={styles.sectionTitle}>
            General Comments
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Any overall notes about the article outline or image selections
          </Text>
          <Textarea
            placeholder="General comments..."
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
            onClick={handleSubmitReview1}
            className={styles.submitButton}
          >
            Continue to Review 2
          </Button>
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            Proceed to article content review
          </Text>
        </div>
      </Container>
    </div>
  );
}
