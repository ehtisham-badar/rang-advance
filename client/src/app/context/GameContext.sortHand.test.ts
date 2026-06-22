import { describe, expect, test } from 'vitest';

import { sortHand, type Card } from './GameContext';

describe('sortHand', () => {
  test('alternates red and black suits while keeping rank order inside each suit', () => {
    const hand: Card[] = [
      { suit: 'S', value: 12, id: 'S-12' },
      { suit: 'D', value: 14, id: 'D-14' },
      { suit: 'C', value: 3, id: 'C-3' },
      { suit: 'H', value: 10, id: 'H-10' },
      { suit: 'S', value: 2, id: 'S-2' },
      { suit: 'D', value: 2, id: 'D-2' },
      { suit: 'H', value: 4, id: 'H-4' },
      { suit: 'C', value: 11, id: 'C-11' },
    ];

    const sorted = sortHand(hand);

    expect(sorted.map((card) => card.id)).toEqual([
      'H-4',
      'H-10',
      'C-3',
      'C-11',
      'D-2',
      'D-14',
      'S-2',
      'S-12',
    ]);
  });
});