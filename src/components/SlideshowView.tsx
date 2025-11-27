import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './SlideshowView.module.css';

interface Slide {
  title?: string;
  content: string;
}

interface SlideshowViewProps {
  slides: Slide[];
  articleTitle: string;
}

export function SlideshowView({ slides, articleTitle }: SlideshowViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number, dir: 'next' | 'prev') => {
    if (isAnimating || index < 0 || index >= slides.length) return;

    setDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 50);
    }, 300);
  }, [isAnimating, slides.length]);

  const goNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1, 'next');
    }
  }, [currentIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1, 'prev');
    }
  }, [currentIndex, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setTouchStart(null);
  };

  // Click to advance, double-click to go back
  const handleClick = useCallback(() => {
    if (clickTimeout) {
      // Double click detected - go back
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      goPrev();
    } else {
      // Single click - wait to see if it's a double click
      const timeout = setTimeout(() => {
        setClickTimeout(null);
        goNext();
      }, 250);
      setClickTimeout(timeout);
    }
  }, [clickTimeout, goNext, goPrev]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [clickTimeout]);

  const currentSlide = slides[currentIndex];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div
      className={styles.slideshow}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.slideCount}>
          {currentIndex + 1} / {slides.length}
        </span>
        <h1 className={styles.articleTitle}>{articleTitle}</h1>
      </div>

      {/* Slide content - click to advance, double-click to go back */}
      <div className={styles.slideContainer} onClick={handleClick}>
        <div
          className={styles.slide}
          data-animating={isAnimating}
          data-direction={direction}
        >
          {currentSlide.title && (
            <h2 className={styles.slideTitle}>{currentSlide.title}</h2>
          )}
          <div className={styles.slideContent}>
            <ReactMarkdown>{currentSlide.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Swipe hint on first slide */}
      {currentIndex === 0 && (
        <div className={styles.swipeHint}>
          Tap to advance · Double-tap to go back
        </div>
      )}

      {/* Navigation - sticky at bottom */}
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={goPrev}
          disabled={currentIndex === 0 || isAnimating}
          aria-label="Previous slide"
        >
          ←
        </button>

        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={styles.dot}
              data-active={i === currentIndex}
              onClick={() => {
                if (i !== currentIndex) {
                  goToSlide(i, i > currentIndex ? 'next' : 'prev');
                }
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={styles.navButton}
          onClick={goNext}
          disabled={currentIndex === slides.length - 1 || isAnimating}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </div>
  );
}
