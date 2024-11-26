import { 
    isStraight, bunGou, ziMui, flushDragon, tileHog
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
    const resultDict = {};
    expect(isStraight(hands, resultDict)).toBe(true);
    expect("清一色" in resultDict).toBe(true);
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
    const resultDict = {};
    expect(isStraight(hands, resultDict)).toBe(true);
    expect("混一色" in resultDict).toBe(true);
});

// Test for "混一色" (Mixed Straight)
test('isMixedStraight should return true for valid Mixed Straight hand', () => {
    const hands = [
        11, 11, 11,
        101, 102, 103,
        101, 102, 103,
        101, 102, 103,
        108, 108, 108,
        109, 109
    ];;
    const resultDict = {};
    expect(isStraight(hands, resultDict)).toBe(true);
    expect("混一色" in resultDict).toBe(true);
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
    const resultDict = {};
    expect(isStraight(hands, resultDict)).toBe(false);
    expect("混一色" in resultDict).toBe(false);
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
    const resultDict = {};
    bunGou(closedGroups, openGroups, resultDict);
    expect("三般高" in resultDict).toBe(true);
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
    const resultDict = {};
    ziMui(closedGroups, openGroups, pairGroups, resultDict);
    expect("大三姊妹" in resultDict).toBe(true);
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
    const resultDict = {};
    ziMui(closedGroups, openGroups, pairGroups, resultDict);
    expect("小三姊妹" in resultDict).toBe(true);
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

    const resultDict = {};
    flushDragon(closedGroups, openGroups, resultDict);
    expect("明清龍" in resultDict).toBe(true);
});

test('四歸一四歸二四歸四', () => {
    const closedGroups = [
        [305, 305, 305],
        [305, 306, 307], 
    ];
    const openGroups = [
        [306, 307, 308],
        [307, 308, 309],
        [307, 308, 309],
    ];
    const pairGroups = [
        [306, 306]
    ];

    const fullHandCount = getHandCount([...closedGroups.flat(), ...openGroups.flat(), ...pairGroups.flat()]);
    const resultDict = {};
    tileHog(fullHandCount, closedGroups, openGroups, pairGroups, resultDict);

    expect("四歸一" in resultDict).toBe(true);
    expect(resultDict["四歸一"][0][2][0]).toBe(305);

    expect("四歸二" in resultDict).toBe(true);
    expect(resultDict["四歸二"][0][2][0]).toBe(306);

    expect("四歸四" in resultDict).toBe(true);
    expect(resultDict["四歸四"][0][2][0]).toBe(307);
});

test('四歸一四歸二四歸四', () => {
    const closedGroups = [
        [305, 306, 307], 
        [305, 306, 307], 
    ];
    const openGroups = [
        [305, 306, 307], 
        [305, 306, 307], 
        [101, 102, 103],
    ];
    const pairGroups = [
        [1, 1]
    ];

    const fullHandCount = getHandCount([...closedGroups.flat(), ...openGroups.flat(), ...pairGroups.flat()]);
    const resultDict = {};
    tileHog(fullHandCount, closedGroups, openGroups, pairGroups, resultDict);

    expect("四歸四" in resultDict).toBe(true);
    expect(resultDict["四歸四"].length).toBe(3);
});

