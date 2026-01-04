import styles from './CategoryTabs.module.css';

export type Category = 'all' | 'health' | 'finance' | 'technology' | 'education';

interface CategoryTabsProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All',
  health: 'Health',
  finance: 'Finance',
  technology: 'Technology',
  education: 'Education',
};

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <nav className={styles.tabs} role="tablist" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          role="tab"
          aria-selected={selected === category}
          className={`${styles.tab} ${selected === category ? styles.active : ''}`}
          onClick={() => onSelect(category)}
        >
          {CATEGORY_LABELS[category]}
          {selected === category && <span className={styles.underline} />}
        </button>
      ))}
    </nav>
  );
}
