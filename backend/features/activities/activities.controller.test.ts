import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('./activities.service', () => ({
  calculateActivity: vi.fn(),
  getActivities: vi.fn(),
}));

import { createActivity, listActivities } from './activities.controller';
import { calculateActivity, getActivities } from './activities.service';

const mockedCalculate = vi.mocked(calculateActivity);
const mockedGetActivities = vi.mocked(getActivities);

function mockResponse(): Response & { body: unknown } {
  const res = {} as Response & { body: unknown };
  res.status = vi.fn(function (this: unknown) {
    return this as Response;
  }) as unknown as Response['status'];
  res.json = vi.fn((body: unknown) => {
    res.body = body;
    return res;
  }) as unknown as Response['json'];
  return res;
}

describe('createActivity', () => {
  beforeEach(() => {
    mockedCalculate.mockReset();
  });

  it('returns 400 and does not call the service for an invalid body', async () => {
    const req = { body: { activity: '' } } as Request;
    const res = mockResponse();

    await createActivity(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request body' });
    expect(mockedCalculate).not.toHaveBeenCalled();
  });

  it('returns the saved entry for a valid body', async () => {
    const saved = { id: 1, category: 'Fitness', activity: 'Run', note: null, xpEarned: 100, timestamp: new Date() };
    mockedCalculate.mockResolvedValue(saved);
    const req = { body: { category: 'Fitness', activity: 'Run' } } as Request;
    const res = mockResponse();

    await createActivity(req, res);

    expect(mockedCalculate).toHaveBeenCalledWith({ category: 'Fitness', activity: 'Run' });
    expect(res.json).toHaveBeenCalledWith(saved);
  });

  it('returns 500 with a generic error when the service throws', async () => {
    mockedCalculate.mockRejectedValue(new Error('db down'));
    const req = { body: { category: 'Fitness', activity: 'Run' } } as Request;
    const res = mockResponse();

    await createActivity(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error posting the entry' });
  });
});

describe('listActivities', () => {
  beforeEach(() => {
    mockedGetActivities.mockReset();
  });

  it('returns the activity list from the service', async () => {
    const entries = [
      { id: 2, category: 'Learning', activity: 'Read', note: 'chapter', xpEarned: 150, timestamp: new Date() },
      { id: 1, category: 'Fitness', activity: 'Run', note: null, xpEarned: 100, timestamp: new Date() },
    ];
    mockedGetActivities.mockResolvedValue(entries);
    const req = {} as Request;
    const res = mockResponse();

    await listActivities(req, res);

    expect(mockedGetActivities).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(entries);
  });

  it('returns 500 with a generic error when the service throws', async () => {
    mockedGetActivities.mockRejectedValue(new Error('db down'));
    const req = {} as Request;
    const res = mockResponse();

    await listActivities(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching activities' });
  });
});
