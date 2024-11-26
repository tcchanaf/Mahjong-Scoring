import { 
    allSequence, twoFiveSevenSuit
} from '../utils/combination';
import { honorTile } from "../utils/honor";
import { 
    isSequence, 
    getHandCount
} from '../utils/commonUtils';

test('平胡', () => {
    const closedGroups = [
        [102, 102], 
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const openGroups = [
        [301, 302, 303],
        [201, 202, 203],
    ];

    const resultDict = {};
    expect(allSequence(closedGroups, openGroups, resultDict)).toBe(true);
    expect("平胡" in resultDict).toBe(true);
});

test('平糊 false with triplet', () => {
    const closedGroups = [
        [102, 102], 
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const openGroups = [
        [203, 203, 303],
        [201, 202, 203],
    ];
    
    const resultDict = {};
    expect(allSequence(closedGroups, openGroups, resultDict)).toBe(false);
    expect("平胡" in resultDict).toBe(false);
});


test('缺一門', () => {
    const hands = [
        101, 101, 101,
        201, 201, 201,
        201, 202, 203, 
        101, 102, 103,
        203, 203, 203,
        104, 104
        ];
    const fullHandCount = getHandCount(hands);
    const resultDict = {};
    honorTile(fullHandCount, 1, 1, resultDict);
    expect("無字" in resultDict).toBe(true);
    twoFiveSevenSuit(fullHandCount, [], resultDict);
    expect("缺一門" in resultDict).toBe(true);
    expect("無字" in resultDict).toBe(false);
});


test('五門齊', () => {
    const hands = [
        101, 101, 101,
        201, 201, 201,
        201, 202, 203, 
        301, 302, 303,
        1, 1, 1,
        11, 11
    ];
    const flowers = [21, 23];
    const fullHandCount = getHandCount(hands);
    const resultDict = {};
    twoFiveSevenSuit(fullHandCount, flowers, resultDict);
    expect("五門齊" in resultDict).toBe(true);
});

test('七門齊', () => {
    const hands = [
        101, 101, 101,
        201, 201, 201,
        201, 202, 203, 
        301, 302, 303,
        1, 1, 1,
        11, 11
    ];
    const flowers = [21, 23, 31];
    const fullHandCount = getHandCount(hands);
    const resultDict = {};
    twoFiveSevenSuit(fullHandCount, flowers, resultDict);
    expect("七門齊" in resultDict).toBe(true);
});