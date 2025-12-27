import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Map } from '../Map';
import { mockVenues } from '../../../data/mockVenues';

describe('Map Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Map venues={mockVenues} onMarkerClick={vi.fn()} />
    );
    expect(container).toBeTruthy();
  });

  it('renders all venue markers', () => {
    const { container } = render(
      <Map venues={mockVenues} onMarkerClick={vi.fn()} />
    );

    // Should render 3 markers (one for each mock venue)
    const markers = container.querySelectorAll(
      'button[aria-label*="View details"]'
    );
    expect(markers).toHaveLength(3);
  });

  it('renders markers with correct venue names in aria-labels', () => {
    render(<Map venues={mockVenues} onMarkerClick={vi.fn()} />);

    expect(
      screen.getByLabelText(/View details for The Halal Guys/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/View details for Qahwah House/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/View details for Nur/i)).toBeInTheDocument();
  });

  it('calls onMarkerClick with correct venue when marker is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<Map venues={mockVenues} onMarkerClick={mockOnClick} />);

    const halalGuysMarker = screen.getByLabelText(
      /View details for The Halal Guys/i
    );
    await user.click(halalGuysMarker);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'The Halal Guys',
      })
    );
  });

  it('handles multiple marker clicks', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<Map venues={mockVenues} onMarkerClick={mockOnClick} />);

    // Click first marker
    const halalGuysMarker = screen.getByLabelText(
      /View details for The Halal Guys/i
    );
    await user.click(halalGuysMarker);

    // Click second marker
    const qahwahMarker = screen.getByLabelText(
      /View details for Qahwah House/i
    );
    await user.click(qahwahMarker);

    expect(mockOnClick).toHaveBeenCalledTimes(2);
    expect(mockOnClick).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ name: 'Qahwah House' })
    );
  });

  it('renders empty map when no venues provided', () => {
    const { container } = render(<Map venues={[]} onMarkerClick={vi.fn()} />);

    const markers = container.querySelectorAll(
      'button[aria-label*="View details"]'
    );
    expect(markers).toHaveLength(0);
  });

  it('does not crash when onMarkerClick is not provided', async () => {
    const user = userEvent.setup();
    render(<Map venues={mockVenues} />);

    const marker = screen.getByLabelText(/View details for The Halal Guys/i);

    // Should not throw error
    await expect(user.click(marker)).resolves.not.toThrow();
  });
});
