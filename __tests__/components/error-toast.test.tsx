import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import ErrorToast from '@/components/error-toast';

describe('ErrorToast Component', () => {
  it('should render error message', () => {
    const onDismiss = vi.fn();
    render(
      <ErrorToast
        message="Test error message"
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should show dismiss button', () => {
    const onDismiss = vi.fn();
    render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByText('Dismiss');
    expect(dismissButton).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    
    render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByText('Dismiss');
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should show retry button when showRetry is true', () => {
    const onDismiss = vi.fn();
    const onRetry = vi.fn();
    
    render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
        showRetry={true}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should not show retry button when showRetry is false', () => {
    const onDismiss = vi.fn();
    
    render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
        showRetry={false}
      />
    );

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onRetry = vi.fn();
    
    render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
        showRetry={true}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render with proper styling classes', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ErrorToast
        message="Test error"
        onDismiss={onDismiss}
      />
    );

    // Check for error styling classes
    const toast = container.querySelector('.bg-red-50');
    expect(toast).toBeInTheDocument();
  });
});

