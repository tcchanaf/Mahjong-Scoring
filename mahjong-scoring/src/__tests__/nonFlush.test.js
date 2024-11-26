import { 
    hingDai, nonFlushDragon, soengFung
} from '../utils/nonFlush';
import { patterns } from "../utils/constant"
import { getHandCount, splitToGroups, isWin, isSequence } from '../utils/commonUtils';

test('大三兄弟', () => {
    const closedGroups = [
        [101, 101, 101], 
        [102, 102, 102], 
    ];
    const openGroups = [
        [301, 301, 301],
        [201, 201, 201],
        [103, 104, 105], 
    ];
    const pairGroups = [
        [103, 103]
    ];
    const resultDict = {};
    hingDai(closedGroups, openGroups, pairGroups, resultDict);
    expect("大三兄弟" in resultDict).toBe(true);
});

test('小三兄弟', () => {
    const closedGroups = [
        [101, 101, 101], 
        [102, 102, 102], 
    ];
    const openGroups = [
        [301, 301, 301],
        [104, 104, 104],
        [103, 104, 105], 
    ];
    const pairGroups = [
        [201, 201]
    ];
    const resultDict = {};
    hingDai(closedGroups, openGroups, pairGroups, resultDict);
    expect("小三兄弟" in resultDict).toBe(true);
});

test('二兄弟', () => {
    const closedGroups = [
        [101, 101, 101], 
        [102, 102, 102], 
    ];
    const openGroups = [
        [301, 301, 301],
        [302, 302, 302],
        [103, 104, 105], 
    ];
    const pairGroups = [
        [305, 305]
    ];
    const resultDict = {};
    hingDai(closedGroups, openGroups, pairGroups, resultDict);
    expect("二兄弟" in resultDict).toBe(true);
    expect(resultDict["二兄弟"].length).toBe(2);
});


test('明雜龍', () => {
    const closedGroups = [
        [301, 302, 303],
        [301, 302, 303], 
    ];
    const openGroups = [
        [104, 105, 106],
        [207, 208, 209],
        [103, 104, 105], 
    ];

    const resultDict = {};
    nonFlushDragon(closedGroups, openGroups, resultDict);
    expect("明雜龍" in resultDict).toBe(true);
});

test('暗雜龍', () => {
    const closedGroups = [
        [301, 302, 303], 
        [104, 105, 106],
        [207, 208, 209],
    ];
    const openGroups = [
        [204, 205, 206],
        [307, 308, 309], 
    ];

    const resultDict = {};
    nonFlushDragon(closedGroups, openGroups, resultDict);
    expect(resultDict["暗雜龍"][0][2].toString()).toBe([301, 302, 303, 104, 105, 106,207, 208, 209].toString());
    expect("暗雜龍" in resultDict).toBe(true);
});


test('二相逢', () => {
    const closedGroups = [
        [301, 302, 303], 
        [101, 102, 103],
        [207, 208, 209],
    ];
    const openGroups = [
        [204, 205, 206],
        [307, 308, 309], 
    ];

    const resultDict = {};
    soengFung(closedGroups, openGroups, resultDict);
    expect(resultDict["二相逢"].length).toBe(2);
    expect("二相逢" in resultDict).toBe(true);
});

test('三相逢', () => {
    const closedGroups = [
        [301, 302, 303], 
        [101, 102, 103],
        [201, 202, 203],
    ];
    const openGroups = [
        [204, 205, 206],
        [307, 308, 309], 
    ];

    const resultDict = {};
    soengFung(closedGroups, openGroups, resultDict);
    expect("三相逢" in resultDict).toBe(true);
});

test('四同順', () => {
    const closedGroups = [
        [301, 302, 303], 
        [101, 102, 103],
        [201, 202, 203],
    ];
    const openGroups = [
        [301, 302, 303],
        [307, 308, 309], 
    ];

    const resultDict = {};
    soengFung(closedGroups, openGroups, resultDict);
    expect("四同順" in resultDict).toBe(true);
});