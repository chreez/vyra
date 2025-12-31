import { useState, useRef, useEffect } from 'react';
import { useEnergyLevel, EnergyLevel } from '../context/EnergyLevelContext';
import styles from './EnergyLevelIndicator.module.css';

const ENERGY_CONFIG: Record<EnergyLevel, { label: string; icon: string; color: string }> = {
  tired: { label: 'Tired', icon: '🌙', color: '#7c6f9c' },
  medium: { label: 'Balanced', icon: '⚖️', color: '#6b9b7a' },
};

export function EnergyLevelIndicator() {
  const { energyLevel, setEnergyLevel, hasVariants } = useEnergyLevel();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // When no variants available, always show "Balanced" (medium)
  const displayLevel = hasVariants ? energyLevel : 'medium';
  const config = displayLevel ? ENERGY_CONFIG[displayLevel] : null;
  const isDisabled = !hasVariants;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!config) return null;

  const handleSelect = (level: EnergyLevel) => {
    setEnergyLevel(level);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        className={styles.indicator}
        onClick={isDisabled ? undefined : () => setIsOpen(!isOpen)}
        style={{ '--indicator-color': config.color } as React.CSSProperties}
        aria-label={isDisabled ? 'Energy level: Balanced (no variants available)' : `Energy level: ${config.label}. Click to change.`}
        aria-expanded={isDisabled ? undefined : isOpen}
        aria-disabled={isDisabled}
        data-disabled={isDisabled}
      >
        <span className={styles.icon}>{config.icon}</span>
        <span className={styles.label}>{config.label}</span>
        {!isDisabled && (
          <span className={styles.chevron} data-open={isOpen}>
            ▾
          </span>
        )}
      </button>

      {isOpen && !isDisabled && (
        <div className={styles.dropdown}>
          {(Object.entries(ENERGY_CONFIG) as [EnergyLevel, typeof config][]).map(
            ([level, cfg]) => (
              <button
                key={level}
                className={styles.option}
                onClick={() => handleSelect(level)}
                data-selected={level === energyLevel}
                style={{ '--option-color': cfg.color } as React.CSSProperties}
              >
                <span className={styles.optionIcon}>{cfg.icon}</span>
                <span className={styles.optionLabel}>{cfg.label}</span>
                {level === energyLevel && <span className={styles.check}>✓</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
