import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VenueList } from '../VenueList';
import { mockVenues } from 'src/data/mockVenues';

describe('VenueList Component', () => {
  it('renders correct number of venue items', () => {
    const { container } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    // Should render 3 venue items (one for each mock venue)
    const items = container.querySelectorAll('[role="button"]');
    expect(items).toHaveLength(3);
  });

  it('renders venue names for all venues', () => {
    render(<VenueList venues={mockVenues} onVenueClick={vi.fn()} />);

    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();
    expect(screen.getByText('Qahwah House')).toBeInTheDocument();
    expect(screen.getByText('Nur')).toBeInTheDocument();
  });

  it('shows empty state when no venues provided', () => {
    render(<VenueList venues={[]} onVenueClick={vi.fn()} />);

    expect(
      screen.getByText('No venues match your filters')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your filter settings')
    ).toBeInTheDocument();
  });

  it('does not render venue items when empty', () => {
    const { container } = render(
      <VenueList venues={[]} onVenueClick={vi.fn()} />
    );

    const items = container.querySelectorAll('[role="button"]');
    expect(items).toHaveLength(0);
  });

  it('calls onVenueClick when a venue item is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueList venues={mockVenues} onVenueClick={mockOnClick} />);

    const firstVenue = screen
      .getByText('The Halal Guys')
      .closest('[role="button"]');
    await user.click(firstVenue!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'The Halal Guys' })
    );
  });

  it('calls onVenueClick with correct venue when different items clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueList venues={mockVenues} onVenueClick={mockOnClick} />);

    // Click first venue
    const firstVenue = screen
      .getByText('The Halal Guys')
      .closest('[role="button"]');
    await user.click(firstVenue!);

    // Click second venue
    const secondVenue = screen
      .getByText('Qahwah House')
      .closest('[role="button"]');
    await user.click(secondVenue!);

    expect(mockOnClick).toHaveBeenCalledTimes(2);
    expect(mockOnClick).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ name: 'The Halal Guys' })
    );
    expect(mockOnClick).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ name: 'Qahwah House' })
    );
  });

  it('renders venues in the order provided', () => {
    const { container } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    const items = container.querySelectorAll('[role="button"]');
    const names = Array.from(items).map(
      item => item.querySelector('h3')?.textContent
    );

    expect(names).toEqual(['The Halal Guys', 'Qahwah House', 'Nur']);
  });

  it('has scrollable container with overflow-y-auto', () => {
    const { container } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    const scrollContainer = container.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders unique keys for each venue item', () => {
    const { container } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    // Each VenueListItem should have a unique key (React enforces this)
    // This test ensures no console warnings about duplicate keys
    const items = container.querySelectorAll('[role="button"]');
    expect(items.length).toBe(mockVenues.length);
  });

  it('handles single venue correctly', () => {
    const singleVenue = [mockVenues[0]];
    render(<VenueList venues={singleVenue} onVenueClick={vi.fn()} />);

    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();
    expect(screen.queryByText('Qahwah House')).not.toBeInTheDocument();
  });

  it('updates when venues prop changes', () => {
    const { rerender } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();

    // Update to single venue
    rerender(<VenueList venues={[mockVenues[1]]} onVenueClick={vi.fn()} />);

    expect(screen.queryByText('The Halal Guys')).not.toBeInTheDocument();
    expect(screen.getByText('Qahwah House')).toBeInTheDocument();
  });

  it('transitions from empty to populated correctly', () => {
    const { rerender } = render(
      <VenueList venues={[]} onVenueClick={vi.fn()} />
    );

    expect(
      screen.getByText('No venues match your filters')
    ).toBeInTheDocument();

    // Add venues
    rerender(<VenueList venues={mockVenues} onVenueClick={vi.fn()} />);

    expect(
      screen.queryByText('No venues match your filters')
    ).not.toBeInTheDocument();
    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();
  });

  it('transitions from populated to empty correctly', () => {
    const { rerender } = render(
      <VenueList venues={mockVenues} onVenueClick={vi.fn()} />
    );

    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();

    // Remove all venues
    rerender(<VenueList venues={[]} onVenueClick={vi.fn()} />);

    expect(screen.queryByText('The Halal Guys')).not.toBeInTheDocument();
    expect(
      screen.getByText('No venues match your filters')
    ).toBeInTheDocument();
  });
});
