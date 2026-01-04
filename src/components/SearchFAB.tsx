import { useState, useRef, useEffect } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import styles from './SearchFAB.module.css';

interface SearchFABProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFAB({ value, onChange, placeholder = 'Search...' }: SearchFABProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check viewport size
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 601);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = () => {
    if (!value) {
      setExpanded(false);
    }
  };

  const handleClose = () => {
    onChange('');
    setExpanded(false);
  };

  // Desktop always shows search bar, mobile shows FAB or expanded bar
  const showSearchBar = isDesktop || expanded || !!value;

  return (
    <div className={`${styles.container} ${showSearchBar ? styles.expanded : ''}`}>
      {showSearchBar ? (
        <div className={styles.searchBar}>
          <IconSearch size={16} className={styles.icon} />
          <input
            ref={inputRef}
            id="article-search"
            name="article-search"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleCollapse}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleClose();
              if (e.key === 'Enter') inputRef.current?.blur();
            }}
            placeholder={placeholder}
            className={styles.input}
            aria-label="Search articles"
          />
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <IconX size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleExpand}
          className={styles.fab}
          aria-label="Open search"
        >
          <IconSearch size={16} />
        </button>
      )}
    </div>
  );
}
