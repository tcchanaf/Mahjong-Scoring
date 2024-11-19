import { 
    isPureStraight,
    isMixedStraight,
    bunGou,
    ziMui,
    flushDragon
} from '../utils/flush';
import { patterns } from "../utils/constant"
import { getHandCount, splitToGroups, isWin, isSequence } from '../utils/commonUtils';

    // Test for "清一色" (Pure Straight)
test('isPureStraight should return true for valid Pure Straight hand', () => {
    const hands = [
        101, 102, 103,
        101, 102, 103,
        101, 102, 103,
        109, 109, 109,
        108, 108, 108,
        102, 102
    ];
    expect(isPureStraight(hands)).toBe(true);
});

test('isPureStraight should return false for invalid hand', () => {
    const hands = [
        101, 102, 103,
        101, 102, 103,
        101, 102, 103,
        109, 109, 109,
        108, 108, 108,
        11, 11
    ]; // Mixed with honors
    expect(isPureStraight(hands)).toBe(false);
});

// Test for "混一色" (Mixed Straight)
test('isMixedStraight should return true for valid Mixed Straight hand', () => {
    const hands = [
        101, 102, 103,
        101, 102, 103,
        101, 102, 103,
        109, 109, 109,
        108, 108, 108,
        11, 11
    ];;
    expect(isMixedStraight(hands)).toBe(true);
});

test('isMixedStraight should return false for invalid hand', () => {
    const hands = [
        101, 102, 103,
        101, 102, 103,
        101, 102, 103,
        109, 109, 109,
        208, 208, 208,
        102, 102
    ]; // Mixed but missing honor
    expect(isMixedStraight(hands)).toBe(false);
});

test('般高', () => {
    const closedGroups = [
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const openGroups = [
        [301, 302, 303],
        [201, 202, 203],
    ];
    const results = [];
    bunGou(closedGroups, openGroups, results);
    expect(results[0][0]).toBe(patterns["三般高"][0]);
});

test('大三姊妹', () => {
    const closedGroups = [
        [101, 101, 101], 
        [102, 102, 102], 
        [103, 103, 103], 
    ];
    const openGroups = [
        [301, 302, 303],
        [201, 202, 203],
    ];
    const pairGroups = [
        [104, 104]
    ];
    const results = [];
    ziMui(closedGroups, openGroups, pairGroups, results);
    expect(results[0][0]).toBe(patterns["大三姊妹"][0]);
});

test('小三姊妹', () => {
    const closedGroups = [
        [101, 101, 101], 
        [102, 102, 102], 
    ];
    const openGroups = [
        [301, 302, 303],
        [201, 202, 203],
        [103, 104, 105], 
    ];
    const pairGroups = [
        [103, 103]
    ];
    const results = [];
    ziMui(closedGroups, openGroups, pairGroups, results);
    expect(results[0][0]).toBe(patterns["小三姊妹"][0]);
});

test('明清龍', () => {
    const closedGroups = [
        [301, 302, 303],
        [301, 302, 303], 
    ];
    const openGroups = [
        [304, 305, 306],
        [307, 308, 309],
        [103, 104, 105], 
    ];

    const results = [];
    flushDragon(closedGroups, openGroups, results);
    expect(results[0][0]).toBe(patterns["明清龍"][0]);
    console.log(results);
});
