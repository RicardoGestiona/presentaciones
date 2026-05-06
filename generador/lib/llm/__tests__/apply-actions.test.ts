import { describe, it, expect } from 'vitest';
import { applyActions } from '../apply-actions';
import type { Deck, Action } from '../../schema';

describe('applyActions', () => {
  const baseDeck: Deck = {
    name: 'test',
    title: 'Test',
    brand: 'gestiona',
    slides: [
      { type: 'title', h1: 'Slide 1' },
      { type: 'section', h2: 'Slide 2' },
      { type: 'closing', h2: 'Slide 3' },
    ],
  };

  it('updates a slide', () => {
    const actions: Action[] = [
      {
        type: 'update_slide',
        index: 0,
        patch: { h1: 'Updated Title' },
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.slides[0].type).toBe('title');
    expect((result.slides[0] as any).h1).toBe('Updated Title');
  });

  it('adds a slide', () => {
    const actions: Action[] = [
      {
        type: 'add_slide',
        index: 1,
        slide: { type: 'section', h2: 'New Section' },
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.slides).toHaveLength(4);
    expect((result.slides[1] as any).h2).toBe('New Section');
  });

  it('deletes a slide', () => {
    const actions: Action[] = [
      {
        type: 'delete_slide',
        index: 1,
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.slides).toHaveLength(2);
    expect((result.slides[1] as any).h2).toBe('Slide 3');
  });

  it('moves a slide', () => {
    const actions: Action[] = [
      {
        type: 'move_slide',
        from: 0,
        to: 2,
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.slides).toHaveLength(3);
    expect((result.slides[2] as any).h1).toBe('Slide 1');
  });

  it('changes brand', () => {
    const actions: Action[] = [
      {
        type: 'change_brand',
        brand: 'esfirma',
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.brand).toBe('esfirma');
  });

  it('renames deck', () => {
    const actions: Action[] = [
      {
        type: 'rename_deck',
        name: 'renamed-deck',
        title: 'Renamed Title',
      },
    ];

    const result = applyActions(baseDeck, actions);
    expect(result.name).toBe('renamed-deck');
    expect(result.title).toBe('Renamed Title');
  });

  it('applies multiple actions in sequence', () => {
    const actions: Action[] = [
      { type: 'update_slide', index: 0, patch: { h1: 'Updated' } },
      { type: 'add_slide', index: 1, slide: { type: 'section', h2: 'New' } },
      { type: 'change_brand', brand: 'esfirma' },
    ];

    const result = applyActions(baseDeck, actions);
    expect((result.slides[0] as any).h1).toBe('Updated');
    expect(result.slides).toHaveLength(4);
    expect(result.brand).toBe('esfirma');
  });

  it('does not mutate original deck', () => {
    const actions: Action[] = [
      { type: 'change_brand', brand: 'esfirma' },
    ];

    const result = applyActions(baseDeck, actions);
    expect(baseDeck.brand).toBe('gestiona');
    expect(result.brand).toBe('esfirma');
  });
});
