import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../system-prompt';
import { BRANDS, SLIDE_TYPES } from '../../schema';

describe('buildSystemPrompt', () => {
  const prompt = buildSystemPrompt();

  it('returns non-empty string', () => {
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(500);
  });

  it('lists every brand', () => {
    for (const brand of BRANDS) {
      expect(prompt).toContain(`- ${brand}`);
    }
  });

  it('lists every slide type', () => {
    for (const type of SLIDE_TYPES) {
      expect(prompt).toContain(`- ${type}`);
    }
  });

  it('declares the action contract', () => {
    expect(prompt).toContain('"actions"');
    expect(prompt).toContain('update_slide');
    expect(prompt).toContain('add_slide');
    expect(prompt).toContain('delete_slide');
    expect(prompt).toContain('move_slide');
    expect(prompt).toContain('change_brand');
    expect(prompt).toContain('rename_deck');
  });

  it('mentions JSON-only output requirement', () => {
    expect(prompt.toLowerCase()).toContain('json');
  });
});
