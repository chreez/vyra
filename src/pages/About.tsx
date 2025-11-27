import { Container, Title, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

export function About() {
  return (
    <div className={styles.page}>
      <Container size="md" className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to articles
        </Link>

        <article className={styles.article}>
          <header className={styles.header}>
            <Title order={1} className={styles.title}>
              About Vyra
            </Title>
            <Text className={styles.subtitle}>
              YouTube videos, transformed into readable guides
            </Text>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                Why This Exists
              </Title>
              <Text className={styles.paragraph}>
                I have ADHD. Long-form video content is incredibly valuable, but I often
                struggle to absorb and retain information from 20-40 minute videos. I'll
                watch something insightful, and a week later, remember almost nothing.
              </Text>
              <Text className={styles.paragraph}>
                Vyra is my solution: transform the videos I find valuable into structured,
                scannable articles that I can reference anytime. It's a personal notepad
                that happens to be public.
              </Text>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                Not Plagiarism — A Different Medium
              </Title>
              <Text className={styles.paragraph}>
                Every article on this site is clearly attributed to the original creator.
                Each post includes a link to the source video with a thumbnail preview.
                The goal isn't to replace the original content — it's to provide an
                alternative way to consume it.
              </Text>
              <Text className={styles.paragraph}>
                Think of it like cliff notes, but for YouTube. If you prefer video, watch
                the original. If you prefer reading, or need a quick reference, use the
                article.
              </Text>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                How It Works
              </Title>
              <Text className={styles.paragraph}>
                The pipeline from YouTube video to published article involves several steps:
              </Text>

              <div className={styles.pipeline}>
                <div className={styles.pipelineStep}>
                  <Text className={styles.stepNumber}>1</Text>
                  <div className={styles.stepContent}>
                    <Text className={styles.stepTitle}>YouTube Scraping</Text>
                    <Text className={styles.stepDescription}>
                      A custom CLI tool (<code>transcribe_youtube</code>) downloads the video,
                      extracts audio, and captures screenshots at key moments. It uses
                      Whisper for transcription and can analyze engagement heatmaps.
                    </Text>
                  </div>
                </div>

                <div className={styles.pipelineStep}>
                  <Text className={styles.stepNumber}>2</Text>
                  <div className={styles.stepContent}>
                    <Text className={styles.stepTitle}>AI-Assisted Curation</Text>
                    <Text className={styles.stepDescription}>
                      Claude Code processes the raw transcript, de-duplicates repeated points,
                      extracts the core arguments, and structures everything into a coherent
                      article with proper headings and flow.
                    </Text>
                  </div>
                </div>

                <div className={styles.pipelineStep}>
                  <Text className={styles.stepNumber}>3</Text>
                  <div className={styles.stepContent}>
                    <Text className={styles.stepTitle}>Image Selection</Text>
                    <Text className={styles.stepDescription}>
                      Screenshots are analyzed for relevance — charts, diagrams, and key
                      visuals are selected and placed contextually within the article.
                    </Text>
                  </div>
                </div>

                <div className={styles.pipelineStep}>
                  <Text className={styles.stepNumber}>4</Text>
                  <div className={styles.stepContent}>
                    <Text className={styles.stepTitle}>Publishing</Text>
                    <Text className={styles.stepDescription}>
                      The final article is reviewed, attributed to the original creator,
                      and published to this site.
                    </Text>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                A Demonstration of AI
              </Title>
              <Text className={styles.paragraph}>
                This entire site — the components, the styling, the article generation
                workflow — was built collaboratively with Claude Code. It's a practical
                demonstration of AI-assisted development, from infrastructure to content.
              </Text>
              <Text className={styles.paragraph}>
                The source code is open:{' '}
                <Anchor
                  href="https://github.com/chreez/vyra"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/chreez/vyra
                </Anchor>
              </Text>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                Coming Soon
              </Title>
              <Text className={styles.paragraph}>
                I'm planning to write a detailed article about the YouTube scraper tool
                itself — how it works, the technical decisions behind it, and how to
                build your own. Stay tuned.
              </Text>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                Copyright & Fair Use
              </Title>
              <Text className={styles.paragraph}>
                All original video content referenced on this site remains the intellectual
                property of its respective creators. Vyra does not claim ownership of any
                source material.
              </Text>
              <Text className={styles.paragraph}>
                Articles on this site constitute <strong>transformative use</strong> under{' '}
                <Anchor
                  href="https://www.law.cornell.edu/uscode/text/17/107"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Section 107 of the U.S. Copyright Act
                </Anchor>
                . Content is restructured, summarized, and presented in a different medium
                for purposes of commentary, education, and accessibility — not to replace
                or compete with the original works.
              </Text>
              <Text className={styles.paragraph}>
                This site is <strong>non-commercial</strong>. No revenue is generated from
                advertisements, subscriptions, or any other means.
              </Text>
              <Text className={styles.paragraph}>
                <strong>Content creators:</strong> If you would like your content removed
                or modified, please contact me directly. I respect creators' rights and will
                promptly honor takedown requests.
              </Text>
            </section>

            <section className={styles.section}>
              <Title order={2} className={styles.sectionTitle}>
                About Me
              </Title>
              <Text className={styles.paragraph}>
                I'm Chris Palmer. You can find me on{' '}
                <Anchor
                  href="https://www.instagram.com/rhythm_hawk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Anchor>{' '}
                or check out my work on{' '}
                <Anchor
                  href="https://github.com/chreez"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Anchor>
                .
              </Text>
            </section>
          </div>
        </article>

        <Link to="/" className={styles.backLink}>
          ← Back to articles
        </Link>
      </Container>
    </div>
  );
}
