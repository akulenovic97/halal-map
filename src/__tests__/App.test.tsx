import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Integration Tests', () => {
  it('renders the app header', () => {
    render(<App />);

    expect(screen.getByText('Halal Map NYC')).toBeInTheDocument();
    expect(
      screen.getByText('Discover halal restaurants and cafes in New York City')
    ).toBeInTheDocument();
  });

  it('renders the map with venue markers', () => {
    render(<App />);

    // All 3 mock venues should have markers
    expect(screen.getByLabelText(/View details for The Halal Guys/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/View details for Qahwah House/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/View details for Nur/i)).toBeInTheDocument();
  });

  it('shows venue details when marker is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially, venue details should not be visible
    expect(screen.queryByText('307 W 53rd St, New York, NY 10019')).not.toBeInTheDocument();

    // Click the marker for The Halal Guys
    const marker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(marker);

    // Venue details should appear
    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();
    expect(screen.getByText('307 W 53rd St, New York, NY 10019')).toBeInTheDocument();
    expect(screen.getByText('fully-halal')).toBeInTheDocument();
    expect(screen.getByText('restaurant')).toBeInTheDocument();
  });

  it('displays correct halal status badge', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click The Halal Guys (fully-halal)
    const halalGuysMarker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(halalGuysMarker);
    expect(screen.getByText('fully-halal')).toBeInTheDocument();
  });

  it('closes venue details when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open details
    const marker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(marker);

    // Verify details are visible
    expect(screen.getByText('307 W 53rd St, New York, NY 10019')).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    // Details should be gone
    expect(screen.queryByText('307 W 53rd St, New York, NY 10019')).not.toBeInTheDocument();
  });

  it('switches between different venues', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click first venue
    const halalGuysMarker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(halalGuysMarker);
    expect(screen.getByText('The Halal Guys')).toBeInTheDocument();

    // Click second venue (should replace first)
    const qahwahMarker = screen.getByLabelText(/View details for Qahwah House/i);
    await user.click(qahwahMarker);

    expect(screen.getByText('Qahwah House')).toBeInTheDocument();
    expect(screen.getByText('176 Orchard St, New York, NY 10002')).toBeInTheDocument();
    expect(screen.getByText('halal-friendly')).toBeInTheDocument();
  });

  it('shows correct venue type badge', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Qahwah House (cafe)
    const qahwahMarker = screen.getByLabelText(/View details for Qahwah House/i);
    await user.click(qahwahMarker);

    expect(screen.getByText('cafe')).toBeInTheDocument();
  });

  it('displays all venue information in popup', async () => {
    const user = userEvent.setup();
    render(<App />);

    const marker = screen.getByLabelText(/View details for Nur/i);
    await user.click(marker);

    // Check all expected information is displayed
    expect(screen.getByText('Nur')).toBeInTheDocument();
    expect(screen.getByText('34 E 20th St, New York, NY 10003')).toBeInTheDocument();
    expect(screen.getByText('partially-halal')).toBeInTheDocument();
    expect(screen.getByText('restaurant')).toBeInTheDocument();
  });
});
