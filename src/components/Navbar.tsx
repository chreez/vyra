import { Anchor } from '@mantine/core';
import { EnergyLevelIndicator } from './EnergyLevelIndicator';
import { useEnergyLevel } from '../context/EnergyLevelContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { hasSelectedEnergy } = useEnergyLevel();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Anchor href="/" className={styles.logo} underline="never">
          Vyra
        </Anchor>

        <div className={styles.right}>
          {hasSelectedEnergy && <EnergyLevelIndicator />}
        </div>
      </div>
    </nav>
  );
}
