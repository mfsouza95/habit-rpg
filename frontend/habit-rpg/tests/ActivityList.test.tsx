import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActivityList from '../src/components/ActivityList';

const entries = [
  { id: 2, category: 'Learning', activity: 'Read', note: 'chapter 3', xpEarned: 150, timestamp: '2026-01-02T10:00:00.000Z' },
  { id: 1, category: 'Fitness', activity: 'Run', note: null, xpEarned: 100, timestamp: '2026-01-01T09:00:00.000Z' },
];

describe('ActivityList', () => {
  it('shows an empty-state message when there are no entries', () => {
    render(<ActivityList activities={[]} />);

    expect(screen.getByText(/No activities yet/)).toBeInTheDocument();
  });

  it('renders category, activity, note, XP and timestamp for each entry', () => {
    render(<ActivityList activities={entries} />);

    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Learning')).toBeInTheDocument();
    expect(screen.getByText('chapter 3')).toBeInTheDocument();
    expect(screen.getByText('+150 XP')).toBeInTheDocument();

    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
    expect(screen.queryByText(/No activities yet/)).not.toBeInTheDocument();
  });

  it('omits the note when an entry has none', () => {
    render(<ActivityList activities={[entries[1]]} />);

    expect(screen.queryByText('chapter 3')).not.toBeInTheDocument();
  });
});
