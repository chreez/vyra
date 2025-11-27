import { Text, Anchor } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import styles from './IntroSplash.module.css';

interface IntroSplashProps {
  onDismiss: () => void;
}

export function IntroSplash({ onDismiss }: IntroSplashProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <Text className={styles.text}>
          <strong>Welcome to Vyra</strong> — YouTube videos transformed into readable guides.
          Built with AI as an ADHD-friendly way to consume content.{' '}
          <Anchor href="/about" className={styles.link}>
            Learn more →
          </Anchor>
        </Text>
        <button
          className={styles.close}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <IconX size={18} />
        </button>
      </div>
    </div>
  );
}
