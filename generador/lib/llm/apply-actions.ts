import { Deck, Slide, Action, validateDeck } from '../schema';

export function applyActions(deck: Deck, actions: Action[]): Deck {
  let result = structuredClone(deck);

  for (const action of actions) {
    switch (action.type) {
      case 'update_slide': {
        const idx = action.index;
        if (idx >= 0 && idx < result.slides.length) {
          result.slides[idx] = { ...result.slides[idx], ...action.patch };
        }
        break;
      }

      case 'add_slide': {
        const idx = action.index;
        result.slides.splice(Math.min(idx, result.slides.length), 0, action.slide);
        break;
      }

      case 'delete_slide': {
        const idx = action.index;
        if (idx >= 0 && idx < result.slides.length) {
          result.slides.splice(idx, 1);
        }
        break;
      }

      case 'move_slide': {
        const from = action.from;
        const to = action.to;
        if (from >= 0 && from < result.slides.length && to >= 0 && to <= result.slides.length) {
          const [slide] = result.slides.splice(from, 1);
          result.slides.splice(to, 0, slide);
        }
        break;
      }

      case 'change_brand': {
        result.brand = action.brand;
        break;
      }

      case 'rename_deck': {
        if (action.name) result.name = action.name;
        if (action.title) result.title = action.title;
        break;
      }

      default:
        const _exhaustive: never = action;
        throw new Error(`Unknown action type: ${_exhaustive}`);
    }
  }

  // Validate final result
  return validateDeck(result);
}
