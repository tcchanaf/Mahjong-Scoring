import { 
    thirteenOrphans, 
    sixteenNotMatch, 
    sevenPairs
} from '../utils/special';

import { 
    splitToGroups,
    getHandCount
} from '../utils/commonUtils';

describe('Mahjong Hand Validations', () => {
    it('should correctly split a hand into groups for both closed and open hands', () => {
        const closedHandCount = [301, 302, 303, 101, 102, 103, 101, 102, 103, 201, 201, 201, 204, 204]; // closed hand list
        const openHandCount = [301, 301, 301]; // open hand list (triplet)
        
        const [closedGroups, openGroups, pairGroup] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
                [301, 302, 303],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
        expect(pairGroup).toEqual([[204, 204]]);
        });

    it('splitToGroups handle an empty hand', () => {
        const closedHandCount = []; 
        const openHandCount = []; 
        const [closedGroups, openGroups, pairGroup] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
            ]));
        expect(openGroups).toEqual([]);
    });

    it('splitToGroups handle an triplet hand, prioritizing sequence', () => {
        const closedHandCount = [101, 101, 101, 102, 102, 102, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups, pairGroup] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 102, 103],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201],
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
        expect(pairGroup).toEqual([[1, 1]]);

    });

    it('splitToGroups handle an triplet hand', () => {
        const closedHandCount = [101, 101, 101, 105, 105, 105, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups, pairGroup] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 101, 101],
                [105, 105, 105],
                [103, 103, 103],
                [201, 201, 201],
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
        expect(pairGroup).toEqual([[1, 1]]);
    });

    it('splitToGroups handle a quadruplet hand', () => {
        const closedHandCount = [101, 101, 101, 101, 102, 102, 102, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups, pairGroup] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 101, 101, 101],
                [102, 102, 102],
                [103, 103, 103],
                [201, 201, 201],
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
        expect(pairGroup).toEqual([[1, 1]]);

    });

      // Test for "十三么" (Hong Kong Thirteen Orphans)
    test('thirteenOrphans should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 309, 101, 102, 103, 201]; // with one sequence
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(thirteenOrphans(fullHandCount, resultDict)).toBe(true);
        expect("十三么" in resultDict).toEqual(true);

    });
    test('thirteenOrphans should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 309, 101, 101, 101, 109]; // with one triplet
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(thirteenOrphans(fullHandCount, resultDict)).toBe(true);
        expect("十三么" in resultDict).toEqual(true);
    });

    test('thirteenOrphans should return false for invalid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 109, 201, 209, 301, 308, 1, 1, 1, 3]; // Invalid, not enough Orphan tiles
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(thirteenOrphans(fullHandCount, resultDict)).toBe(false);
        expect("十三么" in resultDict).toEqual(false);
    });

    // Test for "十六不搭"
    test('sixteenNotMatch should return true for valid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 104, 107, 201, 204, 207, 301, 304, 307, 1];
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(sixteenNotMatch(fullHandCount, resultDict)).toBe(true);
        expect("十六不搭" in resultDict).toEqual(true);
    });

    test('sixteenNotMatch should return false for invalid hand', () => {
        const hands = [1, 3, 5, 7, 11, 13, 15, 101, 104, 107, 201, 204, 207, 301, 304, 304, 1]; // Contains mismatched sequence
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(sixteenNotMatch(fullHandCount, resultDict)).toBe(false);
    });

    // Test for "嚦咕嚦咕" (Seven Pairs)
    test('sevenPairs should return true for valid Seven Pairs hand', () => {
        const hands = [101, 101, 201, 201, 301, 301, 1, 1, 3, 3, 5, 5, 11, 11, 13, 13, 13];
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(sevenPairs(fullHandCount, resultDict)).toBe(true);
        expect("嚦咕嚦咕" in resultDict).toEqual(true);

    });

    test('sevenPairs should return false for invalid hand', () => {
        const hands = [101, 101, 201, 201, 301, 301, 1, 1, 3, 3, 5, 5, 7, 7, 9, 9, 102]; // Missing pair for 7
        const fullHandCount = getHandCount(hands);
        const resultDict = {};
        expect(sevenPairs(fullHandCount, resultDict)).toBe(false);
        expect("嚦咕嚦咕" in resultDict).toEqual(false);

    });
});