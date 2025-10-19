interface OnboardingPageProps {
  moveNextRoute?: string;
  title?: string;
  description?: string;
  isLastPage?: boolean;
  handleSkip?: () => void;
}

export { OnboardingPageProps };
