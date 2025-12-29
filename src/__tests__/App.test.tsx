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
    expect(
      screen.getByLabelText(/View details for The Halal Guys/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/View details for Qahwah House/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/View details for Nur/i)).toBeInTheDocument();
  });

  it('shows venue details when marker is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially, the popup card should not be visible (no Close button)
    expect(screen.queryByText('Close')).not.toBeInTheDocument();

    // Click the marker for The Halal Guys
    const marker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(marker);

    // Venue popup card should appear with Close button
    expect(screen.getByText('Close')).toBeInTheDocument();
    // Venue appears in both sidebar and popup
    expect(screen.getAllByText('The Halal Guys')).toHaveLength(2);
  });

  it('displays correct halal status badge', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click The Halal Guys (fully-halal)
    const halalGuysMarker = screen.getByLabelText(
      /View details for The Halal Guys/i
    );
    await user.click(halalGuysMarker);
    expect(screen.getByText('fully-halal')).toBeInTheDocument();
  });

  it('closes venue details when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open details
    const marker = screen.getByLabelText(/View details for The Halal Guys/i);
    await user.click(marker);

    // Verify popup is visible (has Close button)
    expect(screen.getByText('Close')).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    // Popup should be gone (no Close button)
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('switches between different venues', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click first venue
    const halalGuysMarker = screen.getByLabelText(
      /View details for The Halal Guys/i
    );
    await user.click(halalGuysMarker);
    expect(screen.getAllByText('The Halal Guys')).toHaveLength(2); // sidebar + popup
    expect(screen.getByText('Close')).toBeInTheDocument();

    // Click second venue (should replace first in popup)
    const qahwahMarker = screen.getByLabelText(
      /View details for Qahwah House/i
    );
    await user.click(qahwahMarker);

    // Popup should show second venue
    expect(screen.getAllByText('Qahwah House')).toHaveLength(2); // sidebar + popup
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('shows correct venue type badge', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Qahwah House (cafe)
    const qahwahMarker = screen.getByLabelText(
      /View details for Qahwah House/i
    );
    await user.click(qahwahMarker);

    expect(screen.getByText('cafe')).toBeInTheDocument();
  });

  it('displays all venue information in popup', async () => {
    const user = userEvent.setup();
    render(<App />);

    const marker = screen.getByLabelText(/View details for Nur/i);
    await user.click(marker);

    // Check popup is displayed with venue information
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getAllByText('Nur')).toHaveLength(2); // sidebar + popup
  });
});
