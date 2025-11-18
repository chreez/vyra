import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArticleReviewPhase1 } from '../components/review/ArticleReviewPhase1';
import { ArticleReviewPhase2 } from '../components/review/ArticleReviewPhase2';

export function ArticleReviewUnified() {
  const { slug } = useParams<{ slug: string }>();
  const [reviewPhase, setReviewPhase] = useState<1 | 2>(1);
  const [review1Data, setReview1Data] = useState<any>(null);

  // Load review phase and data from localStorage
  useEffect(() => {
    const savedPhase = localStorage.getItem(`review-phase-${slug}`);
    const savedReview1 = localStorage.getItem(`review1-data-${slug}`);

    if (savedPhase === '2' && savedReview1) {
      setReviewPhase(2);
      setReview1Data(JSON.parse(savedReview1));
    }
  }, [slug]);

  const handleReview1Complete = (data: any) => {
    // Save Review 1 data to localStorage
    localStorage.setItem(`review1-data-${slug}`, JSON.stringify(data));
    localStorage.setItem(`review-phase-${slug}`, '2');

    setReview1Data(data);
    setReviewPhase(2);
  };

  const handleBackToReview1 = () => {
    // Clear localStorage and go back to Review 1
    localStorage.removeItem(`review-phase-${slug}`);
    localStorage.removeItem(`review1-data-${slug}`);
    setReview1Data(null);
    setReviewPhase(1);
  };

  if (reviewPhase === 1) {
    return <ArticleReviewPhase1 slug={slug!} onComplete={handleReview1Complete} />;
  }

  return <ArticleReviewPhase2 slug={slug!} review1Data={review1Data} onBack={handleBackToReview1} />;
}
