import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

const persisted = [
  { id: 1, category: 'Fitness', activity: 'Run', note: null, xpEarned: 100, timestamp: '2026-01-01T09:00:00.000Z' },
];

function jsonResponse(body: unknown) {
  return Promise.resolve({ ok: true, json: async () => body });
}

function stubFetchForApp(initial: unknown) {
  const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'POST') {
      return jsonResponse({ id: 2, category: 'Fitness', activity: 'Walk', note: null, xpEarned: 100, timestamp: '2026-01-02T10:00:00.000Z' });
    }
    return jsonResponse(initial);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the shell with an Add Activity button and empty state', async () => {
    stubFetchForApp([]);
    render(<App />);

    expect(screen.getByRole('button', { name: 'Add Activity' })).toBeInTheDocument();
    expect(await screen.findByText(/No activities yet/)).toBeInTheDocument();
    expect(screen.queryByText('Submit Activity')).not.toBeInTheDocument();
  });

  it('renders the fetched activity list on mount', async () => {
    stubFetchForApp(persisted);
    render(<App />);

    expect(await screen.findByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
  });

  it('opens the activity form modal when Add Activity is clicked', async () => {
    stubFetchForApp([]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add Activity' }));

    expect(screen.getByText('Submit Activity')).toBeInTheDocument();
  });

  it('closes the modal when Close is clicked', async () => {
    stubFetchForApp([]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add Activity' }));
    expect(screen.getByText('Submit Activity')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Submit Activity')).not.toBeInTheDocument();
  });

  it('adds a submitted activity to the running list and closes the modal', async () => {
    stubFetchForApp([]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add Activity' }));
    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Walk');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Walk')).toBeInTheDocument();
    expect(screen.queryByText('Submit Activity')).not.toBeInTheDocument();
  });
});
