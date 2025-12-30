import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VenueListItem } from '../VenueListItem';
import type { Venue } from 'src/types/venue';

const mockVenue: Venue = {
  id: '1',
  name: 'Test Restaurant',
  coordinates: { lat: 40.7614, lng: -73.9776 },
  halalStatus: 'fully-halal',
  venueType: 'restaurant',
  alcoholPolicy: 'none',
  cuisine: ['Middle Eastern', 'American'],
  priceRange: 2,
  address: '123 Test St, New York, NY 10001',
  website: 'https://test.com',
  instagram: '@testrestaurant',
  description: 'A test restaurant',
  photos: ['https://example.com/photo1.jpg'],
};

describe('VenueListItem Component', () => {
  it('renders venue name', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('renders venue address', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(
      screen.getByText('123 Test St, New York, NY 10001')
    ).toBeInTheDocument();
  });

  it('renders halal status badge with formatted text', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Fully Halal')).toBeInTheDocument();
  });

  it('renders venue type badge with formatted text', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
  });

  it('renders cuisine list', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Middle Eastern, American')).toBeInTheDocument();
  });

  it('renders correct number of dollar signs for price range', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    expect(screen.getByText('$$')).toBeInTheDocument();
  });

  it('displays venue photo when available', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    const image = screen.getByAltText('Test Restaurant');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo1.jpg');
  });

  it('displays placeholder image when no photos available', () => {
    const venueWithoutPhoto = { ...mockVenue, photos: undefined };
    render(<VenueListItem venue={venueWithoutPhoto} onClick={vi.fn()} />);
    const image = screen.getByAltText('Test Restaurant');
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    );
  });

  it('calls onClick with venue when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueListItem venue={mockVenue} onClick={mockOnClick} />);

    const item = screen.getByRole('button');
    await user.click(item);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockVenue);
  });

  it('calls onClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueListItem venue={mockVenue} onClick={mockOnClick} />);

    const item = screen.getByRole('button');
    item.focus();
    await user.keyboard('{Enter}');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockVenue);
  });

  it('calls onClick when Space key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<VenueListItem venue={mockVenue} onClick={mockOnClick} />);

    const item = screen.getByRole('button');
    item.focus();
    await user.keyboard(' ');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockVenue);
  });

  it('formats different halal statuses correctly', () => {
    const partiallyHalalVenue = {
      ...mockVenue,
      halalStatus: 'partially-halal' as const,
    };
    const { rerender } = render(
      <VenueListItem venue={partiallyHalalVenue} onClick={vi.fn()} />
    );
    expect(screen.getByText('Partially Halal')).toBeInTheDocument();

    const halalFriendlyVenue = {
      ...mockVenue,
      halalStatus: 'halal-friendly' as const,
    };
    rerender(<VenueListItem venue={halalFriendlyVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Halal Friendly')).toBeInTheDocument();
  });

  it('formats different venue types correctly', () => {
    const cafeVenue = { ...mockVenue, venueType: 'cafe' as const };
    const { rerender } = render(
      <VenueListItem venue={cafeVenue} onClick={vi.fn()} />
    );
    expect(screen.getByText('Cafe')).toBeInTheDocument();

    const bakeryVenue = { ...mockVenue, venueType: 'bakery' as const };
    rerender(<VenueListItem venue={bakeryVenue} onClick={vi.fn()} />);
    expect(screen.getByText('Bakery')).toBeInTheDocument();
  });

  it('renders correct price range for different values', () => {
    const budget = { ...mockVenue, priceRange: 1 as const };
    const { rerender } = render(
      <VenueListItem venue={budget} onClick={vi.fn()} />
    );
    expect(screen.getByText('$')).toBeInTheDocument();

    const upscale = { ...mockVenue, priceRange: 3 as const };
    rerender(<VenueListItem venue={upscale} onClick={vi.fn()} />);
    expect(screen.getByText('$$$')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    const item = screen.getByRole('button');

    expect(item).toHaveAttribute('tabIndex', '0');
  });

  it('applies hover styles class', () => {
    render(<VenueListItem venue={mockVenue} onClick={vi.fn()} />);
    const item = screen.getByRole('button');

    expect(item).toHaveClass('hover:bg-halal-green-50');
  });
});
