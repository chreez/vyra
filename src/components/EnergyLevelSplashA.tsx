import { useState } from 'react';
import { Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useEnergyLevel, EnergyLevel } from '../context/EnergyLevelContext';
import styles from './EnergyLevelSplashA.module.css';

const ENERGY_OPTIONS: { level: EnergyLevel; icon: string; label: string; description: string }[] = [
  {
    level: 'tired',
    icon: '🌙',
    label: 'Tired',
    description: 'Gentle, calming content',
  },
  {
    level: 'medium',
    icon: '⚖️',
    label: 'Balanced',
    description: 'Standard reading pace',
  },
  {
    level: 'energized',
    icon: '⚡',
    label: 'Energized',
    description: 'Dynamic, engaging content',
  },
];

export function EnergyLevelSplashA() {
  const { showSplash, setEnergyLevel, dismissSplash } = useEnergyLevel();
  const [selected, setSelected] = useState<EnergyLevel | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  if (!showSplash) return null;

  const handleSelect = (level: EnergyLevel) => {
    setSelected(level);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setIsExiting(true);
    // Wait for exit animation, then apply
    setTimeout(() => {
      setEnergyLevel(selected);
    }, 400);
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      dismissSplash();
    }, 300);
  };

  return (
    <div className={styles.overlay} data-exiting={isExiting}>
      <div className={styles.card} data-exiting={isExiting}>
        <button className={styles.close} onClick={handleSkip} aria-label="Skip">
          <IconX size={20} />
        </button>

        <div className={styles.header}>
          <Text className={styles.title}>How are you feeling?</Text>
          <Text className={styles.subtitle}>
            We'll adjust the reading experience to match your energy
          </Text>
        </div>

        <div className={styles.options}>
          {ENERGY_OPTIONS.map((option) => (
            <button
              key={option.level}
              className={styles.option}
              onClick={() => handleSelect(option.level)}
              data-selected={selected === option.level}
              data-level={option.level}
            >
              <span className={styles.optionIcon}>{option.icon}</span>
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionDesc}>{option.description}</span>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.confirm}
            onClick={handleConfirm}
            disabled={!selected}
          >
            Continue
          </button>
          <button className={styles.skip} onClick={handleSkip}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
