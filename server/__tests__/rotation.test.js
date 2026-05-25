import { computeBatterRotationOrder } from '../rooms.js';
import { getNextBatterIndex } from '../gameLogic/rotation.js';

describe('rotation order', () => {
    test('card/round table order advances from player 1 to 2 to 3 to 4', () => {
        expect([0, 1, 2, 3].map(getNextBatterIndex)).toEqual([1, 2, 3, 0]);
        expect(computeBatterRotationOrder(0)).toEqual([0, 1, 2, 3]);
        expect(computeBatterRotationOrder(2)).toEqual([2, 3, 0, 1]);
    });
});
