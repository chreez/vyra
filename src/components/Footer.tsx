import { Container, Text, Anchor } from '@mantine/core';
import { IconBrandInstagram, IconBrandGithub } from '@tabler/icons-react';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="lg" className={styles.container}>
        <Text className={styles.name}>Chris Palmer</Text>

        <div className={styles.links}>
          <Anchor
            href="https://www.instagram.com/rhythm_hawk/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label="Instagram"
          >
            <IconBrandInstagram size={20} stroke={1.5} />
          </Anchor>
          <Anchor
            href="https://github.com/chreez/vyra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label="GitHub"
          >
            <IconBrandGithub size={20} stroke={1.5} />
          </Anchor>
        </div>

        <Text className={styles.copyright}>© {currentYear}</Text>
      </Container>
    </footer>
  );
}
