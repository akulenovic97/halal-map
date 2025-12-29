import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VenueListSidebar } from '../VenueListSidebar';
import { mockVenues } from 'src/data/mockVenues';

describe('VenueListSidebar Component', () => {
  const defaultProps = {
    venues: mockVenues,
    onVenueClick: vi.fn(),
    isOpen: false,
    onToggle: vi.fn(),
  };

  it('renders without crashing', () => {
    const { container } = render(<VenueListSidebar {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('renders venue count in header', () => {
    render(<VenueListSidebar {...defaultProps} />);
    expect(screen.getByText('Venues (3)')).toBeInTheDocument();
  });

  it('renders correct subtitle for multiple venues', () => {
    render(<VenueListSidebar {...defaultProps} />);
    expect(screen.getByText('3 venues nearby')).toBeInTheDocument();
  });

  it('renders correct subtitle for single venue', () => {
    render(<VenueListSidebar {...defaultProps} venues={[mockVenues[0]]} />);
    expect(screen.getByText('1 venue nearby')).toBeInTheDocument();
  });

  it('renders correct subtitle for no venues', () => {
    render(<VenueListSidebar {...defaultProps} venues={[]} />);
    expect(screen.getByText('No venues to display')).toBeInTheDocument();
  });

  it('renders toggle button', () => {
    render(<VenueListSidebar {...defaultProps} />);
    const button = screen.getByRole('button', { name: /venue list/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    render(<VenueListSidebar {...defaultProps} onToggle={mockToggle} />);

    const button = screen.getByRole('button', { name: /venue list/i });
    await user.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('shows "Open venue list" aria-label when closed', () => {
    render(<VenueListSidebar {...defaultProps} isOpen={false} />);
    expect(screen.getByLabelText('Open venue list')).toBeInTheDocument();
  });

  it('shows "Close venue list" aria-label when open', () => {
    render(<VenueListSidebar {...defaultProps} isOpen={true} />);
    expect(screen.getByLabelText('Close venue list')).toBeInTheDocument();
  });

  it('applies translate-x-full class when closed on desktop', () => {
    const { container } = render(
      <VenueListSidebar {...defaultProps} isOpen={false} />
    );
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('md:translate-x-full');
  });

  it('applies translate-x-0 class when open on desktop', () => {
    const { container } = render(
      <VenueListSidebar {...defaultProps} isOpen={true} />
    );
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('md:translate-x-0');
  });

  it('applies translate-y-full class when closed on mobile', () => {
    const { container } = render(
      <VenueListSidebar {...defaultProps} isOpen={false} />
    );
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('translate-y-full');
  });

  it('applies translate-y-0 class when open on mobile', () => {
    const { container } = render(
      <VenueListSidebar {...defaultProps} isOpen={true} />
    );
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('translate-y-0');
  });

  it('has transition classes for smooth animation', () => {
    const { container } = render(<VenueListSidebar {...defaultProps} />);
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('transition-transform');
    expect(sidebar).toHaveClass('duration-300');
    expect(sidebar).toHaveClass('ease-in-out');
  });

  it('has fixed positioning', () => {
    const { container } = render(<VenueListSidebar {...defaultProps} />);
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('fixed');
    expect(sidebar).toHaveClass('z-20');
  });

  it('renders VenueList component with venues', () => {
    render(<VenueListSidebar {...defaultProps} />);

    // VenueList should render venue names
    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();
    expect(screen.getByText('Qahwah House')).toBeInTheDocument();
    expect(screen.getByText('Nur')).toBeInTheDocument();
  });

  it('passes onVenueClick to VenueList', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueListSidebar {...defaultProps} onVenueClick={mockOnClick} />);

    const venue = screen.getByText('The Halal Guys').closest('[role="button"]');
    await user.click(venue!);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('updates when venues prop changes', () => {
    const { rerender } = render(<VenueListSidebar {...defaultProps} />);
    expect(screen.getByText('Venues (3)')).toBeInTheDocument();

    rerender(<VenueListSidebar {...defaultProps} venues={[mockVenues[0]]} />);
    expect(screen.getByText('Venues (1)')).toBeInTheDocument();
  });

  it('has focus ring on toggle button', () => {
    render(<VenueListSidebar {...defaultProps} />);
    const button = screen.getByRole('button', { name: /venue list/i });
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-halal-green-500');
  });

  it('has hover effect on toggle button', () => {
    render(<VenueListSidebar {...defaultProps} />);
    const button = screen.getByRole('button', { name: /venue list/i });
    expect(button).toHaveClass('hover:bg-gray-50');
  });

  it('has responsive classes for different screen sizes', () => {
    const { container } = render(<VenueListSidebar {...defaultProps} />);
    const sidebar = container.firstChild;

    // Desktop classes
    expect(sidebar).toHaveClass('md:right-0');
    expect(sidebar).toHaveClass('md:top-[156px]');
    expect(sidebar).toHaveClass('md:bottom-0');
    expect(sidebar).toHaveClass('md:w-80');

    // Mobile classes
    expect(sidebar).toHaveClass('bottom-0');
    expect(sidebar).toHaveClass('left-0');
    expect(sidebar).toHaveClass('right-0');
    expect(sidebar).toHaveClass('h-[60vh]');
    expect(sidebar).toHaveClass('rounded-t-2xl');
  });

  it('handles multiple toggle clicks', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    render(<VenueListSidebar {...defaultProps} onToggle={mockToggle} />);

    const button = screen.getByRole('button', { name: /venue list/i });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(3);
  });

  it('renders with empty venues array', () => {
    render(<VenueListSidebar {...defaultProps} venues={[]} />);
    expect(screen.getByText('Venues (0)')).toBeInTheDocument();
    expect(
      screen.getByText('No venues match your filters')
    ).toBeInTheDocument();
  });
});
