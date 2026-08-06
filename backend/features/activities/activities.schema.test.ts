import { describe, it, expect } from 'vitest';
import { ActivityEntrySchema } from './activities.schema';

describe('ActivityEntrySchema', () => {
  it('accepts a valid entry with category, activity and note', () => {
    const result = ActivityEntrySchema.safeParse({ category: 'Fitness', activity: 'Run', note: 'morning' });
    expect(result.success).toBe(true);
  });

  it('accepts an entry without a note', () => {
    const result = ActivityEntrySchema.safeParse({ category: 'Fitness', activity: 'Run' });
    expect(result.success).toBe(true);
  });

  it('accepts an entry with an empty-string note', () => {
    const result = ActivityEntrySchema.safeParse({ category: 'Fitness', activity: 'Run', note: '' });
    expect(result.success).toBe(true);
  });

  it('rejects an entry missing category', () => {
    const result = ActivityEntrySchema.safeParse({ activity: 'Run' });
    expect(result.success).toBe(false);
  });

  it('rejects an entry missing activity', () => {
    const result = ActivityEntrySchema.safeParse({ category: 'Fitness' });
    expect(result.success).toBe(false);
  });

  it('rejects a whitespace-only category', () => {
    const result = ActivityEntrySchema.safeParse({ category: '   ', activity: 'Run' });
    expect(result.success).toBe(false);
  });

  it('rejects a whitespace-only activity', () => {
    const result = ActivityEntrySchema.safeParse({ category: 'Fitness', activity: '   ' });
    expect(result.success).toBe(false);
  });

  it('trims surrounding whitespace from category and activity', () => {
    const result = ActivityEntrySchema.safeParse({ category: '  Fitness  ', activity: '  Run  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe('Fitness');
      expect(result.data.activity).toBe('Run');
    }
  });
});
