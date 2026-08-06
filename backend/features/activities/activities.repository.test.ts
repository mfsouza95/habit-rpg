import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/prisma', () => ({
  default: {
    activityLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import prisma from '../../shared/prisma';
import { saveActivity, findActivities } from './activities.repository';

const mockedCreate = vi.mocked(prisma.activityLog.create);
const mockedFindMany = vi.mocked(prisma.activityLog.findMany);

describe('saveActivity', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
  });

  it('creates an ActivityLog row with category, activity, note and xpEarned', async () => {
    const record = {
      id: 1,
      category: 'Fitness',
      activity: 'Run',
      note: 'morning run',
      xpEarned: 150,
      timestamp: new Date(),
    };
    mockedCreate.mockResolvedValue(record);

    const result = await saveActivity({ category: 'Fitness', activity: 'Run', note: 'morning run', xpEarned: 150 });

    expect(mockedCreate).toHaveBeenCalledWith({
      data: { category: 'Fitness', activity: 'Run', note: 'morning run', xpEarned: 150 },
    });
    expect(result).toEqual(record);
  });

  it('persists an entry without a note', async () => {
    mockedCreate.mockResolvedValue({
      id: 2,
      category: 'Learning',
      activity: 'Read',
      note: null,
      xpEarned: 100,
      timestamp: new Date(),
    });

    await saveActivity({ category: 'Learning', activity: 'Read', xpEarned: 100 });

    expect(mockedCreate).toHaveBeenCalledWith({
      data: { category: 'Learning', activity: 'Read', note: undefined, xpEarned: 100 },
    });
  });
});

describe('findActivities', () => {
  beforeEach(() => {
    mockedFindMany.mockReset();
  });

  it('returns activity rows ordered most recent first', async () => {
    const older = { id: 1, category: 'Fitness', activity: 'Run', note: null, xpEarned: 100, timestamp: new Date('2026-01-01') };
    const newer = { id: 2, category: 'Learning', activity: 'Read', note: 'chapter', xpEarned: 150, timestamp: new Date('2026-01-02') };
    mockedFindMany.mockResolvedValue([newer, older]);

    const result = await findActivities();

    expect(mockedFindMany).toHaveBeenCalledWith({ orderBy: { timestamp: 'desc' } });
    expect(result).toEqual([newer, older]);
  });

  it('returns an empty list when no rows exist', async () => {
    mockedFindMany.mockResolvedValue([]);

    const result = await findActivities();

    expect(result).toEqual([]);
  });
});
