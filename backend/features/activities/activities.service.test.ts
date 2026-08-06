import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./activities.repository', () => ({
  saveActivity: vi.fn(async (data) => ({ id: 1, ...data, timestamp: new Date() })),
  findActivities: vi.fn(async () => []),
}));

import { calculateActivity } from './activities.service';
import { saveActivity } from './activities.repository';

const mockedSave = vi.mocked(saveActivity);

describe('calculateActivity', () => {
  beforeEach(() => {
    mockedSave.mockClear();
  });

  it('awards 100 base XP for an entry without a note', async () => {
    await calculateActivity({ category: 'Fitness', activity: 'Run' });
    expect(mockedSave).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Fitness', activity: 'Run', xpEarned: 100 })
    );
  });

  it('awards 150 XP when a note is filled in', async () => {
    await calculateActivity({ category: 'Fitness', activity: 'Run', note: 'morning run' });
    expect(mockedSave).toHaveBeenCalledWith(expect.objectContaining({ xpEarned: 150 }));
  });

  it('awards 1150 XP for the Neymar JR easter egg note', async () => {
    await calculateActivity({ category: 'Fitness', activity: 'Run', note: 'Neymar JR' });
    expect(mockedSave).toHaveBeenCalledWith(expect.objectContaining({ xpEarned: 1150 }));
  });

  it('returns the saved result from the repository', async () => {
    const result = await calculateActivity({ category: 'Fitness', activity: 'Run' });
    expect(result.id).toBe(1);
    expect(result.xpEarned).toBe(100);
  });
});
