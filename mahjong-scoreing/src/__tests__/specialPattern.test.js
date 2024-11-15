import { 
    splitToGroups, 
    isHongKongThirteenOrphans, 
    is16NotMatch, 
    isSevenPairs, 
    getHandCount
} from '../utils/scoring'; // Adjust the path to where your utility functions are located

describe('Mahjong Hand Validations', () => {
    it('should correctly split a hand into groups for both closed and open hands', () => {
        const closedHandCount = [301, 302, 303, 101, 102, 103, 101, 102, 103, 201, 201, 201, 204, 204]; // closed hand list
        const openHandCount = [301, 301, 301]; // open hand list (triplet)
        
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
                [301, 302, 303],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201],
                [204, 204]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });

    it('splitToGroups handle an empty hand', () => {
        const closedHandCount = []; 
        const openHandCount = []; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
            ]));
        expect(openGroups).toEqual([]);
    });

    it('splitToGroups handle an triplet hand, prioritizing sequence', () => {
        const closedHandCount = [101, 101, 101, 102, 102, 102, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 102, 103],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201],
                [1, 1]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });

    it('splitToGroups handle an triplet hand', () => {
        const closedHandCount = [101, 101, 101, 105, 105, 105, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 101, 101],
                [105, 105, 105],
                [103, 103, 103],
                [201, 201, 201],
                [1, 1]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });

      // Test for "十三么" (Hong Kong Thirteen Orphans)
    test('isHongKongThirteenOrphans should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 309, 101, 102, 103, 201]; // with one sequence
        const fullHandCount = getHandCount(hands);
        expect(isHongKongThirteenOrphans(fullHandCount)).toBe(true);
    });
    test('isHongKongThirteenOrphans should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 309, 101, 101, 101, 109]; // with one triplet
        const fullHandCount = getHandCount(hands);
        expect(isHongKongThirteenOrphans(fullHandCount)).toBe(true);
    });

    test('isHongKongThirteenOrphans should return false for invalid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 308, 1, 1, 1, 3]; // Invalid, not enough Orphan tiles
        const fullHandCount = getHandCount(hands);
        expect(isHongKongThirteenOrphans(fullHandCount)).toBe(false);
    });

    // Test for "十六不搭"
    test('is16NotMatch should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 104, 107, 201, 204, 207, 301, 304, 307, 1];
        const fullHandCount = getHandCount(hands);
        expect(is16NotMatch(fullHandCount)).toBe(true);
    });

    test('is16NotMatch should return false for invalid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 104, 107, 201, 204, 207, 301, 304, 304, 1]; // Contains mismatched sequence
        const fullHandCount = getHandCount(hands);
        expect(is16NotMatch(fullHandCount)).toBe(false);
    });

    // Test for "嚦咕嚦咕" (Seven Pairs)
    test('isSevenPairs should return true for valid Seven Pairs hand', () => {
        const hands = [101, 101, 201, 201, 301, 301, 1, 1, 3, 3, 5, 5, 11, 11, 13, 13, 13];
        const fullHandCount = getHandCount(hands);
        expect(isSevenPairs(fullHandCount)).toBe(true);
    });

    test('isSevenPairs should return false for invalid hand', () => {
        const hands = [101, 101, 201, 201, 301, 301, 1, 1, 3, 3, 5, 5, 7, 7, 9, 9, 102]; // Missing pair for 7
        const fullHandCount = getHandCount(hands);
        expect(isSevenPairs(fullHandCount)).toBe(false);
    });
});