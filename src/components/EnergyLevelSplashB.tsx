import { useState, useRef } from 'react';
import { Text } from '@mantine/core';
import { useEnergyLevel, EnergyLevel } from '../context/EnergyLevelContext';
import styles from './EnergyLevelSplashB.module.css';

const ENERGY_OPTIONS: {
  level: EnergyLevel;
  icon: string;
  label: string;
  tagline: string;
  color: string;
}[] = [
  {
    level: 'tired',
    icon: '🌙',
    label: 'Tired',
    tagline: 'Gentle pace, calming tone',
    color: '#7c6f9c',
  },
  {
    level: 'medium',
    icon: '⚖️',
    label: 'Balanced',
    tagline: 'Clear and straightforward',
    color: '#6b9b7a',
  },
];

export function EnergyLevelSplashB() {
  const { showSplash, setEnergyLevel, dismissSplash } = useEnergyLevel();
  const [selectedLevel, setSelectedLevel] = useState<EnergyLevel | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectedRef = useRef<HTMLButtonElement>(null);

  if (!showSplash && !isAnimating) return null;

  const handleSelect = (level: EnergyLevel) => {
    setSelectedLevel(level);
    setIsAnimating(true);

    // Trigger the fly-to-navbar animation
    setTimeout(() => {
      setEnergyLevel(level);
      setIsAnimating(false);
    }, 600);
  };

  const handleSkip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      dismissSplash();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.fullscreen} data-animating={isAnimating}>
      <div className={styles.content}>
        <div className={styles.branding}>
          <Text className={styles.logo}>Vyra</Text>
          <Text className={styles.tagline}>YouTube guides, your way</Text>
        </div>

        <div className={styles.prompt}>
          <Text className={styles.question}>How's your energy today?</Text>
          <Text className={styles.hint}>
            Choose a mode to personalize your reading experience
          </Text>
        </div>

        <div className={styles.cards}>
          {ENERGY_OPTIONS.map((option) => (
            <button
              key={option.level}
              ref={selectedLevel === option.level ? selectedRef : null}
              className={styles.card}
              onClick={() => handleSelect(option.level)}
              data-level={option.level}
              data-selected={selectedLevel === option.level}
              data-animating={isAnimating && selectedLevel === option.level}
              style={{ '--card-color': option.color } as React.CSSProperties}
              disabled={isAnimating}
            >
              <span className={styles.cardIcon}>{option.icon}</span>
              <span className={styles.cardLabel}>{option.label}</span>
              <span className={styles.cardTagline}>{option.tagline}</span>
            </button>
          ))}
        </div>

        <button className={styles.skip} onClick={handleSkip} disabled={isAnimating}>
          Skip for now
        </button>
      </div>

      <div className={styles.decoration}>
        <div className={styles.orb} data-position="1" />
        <div className={styles.orb} data-position="2" />
        <div className={styles.orb} data-position="3" />
      </div>
    </div>
  );
}
