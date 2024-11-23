import { 
    isAllTriplets,
    closedTriplets
} from '../utils/scoring';
import { getHandCount, splitToGroups, isWin, isSequence } from '../utils/commonUtils';



  // Test for "對對糊" (All Triplets)
  test('isAllTriplets should return true for valid All Triplets hand', () => {
    const hands = [
        101, 101, 101,
        201, 201, 201,
        301, 301, 301, 
        11, 11, 11,
        203, 203, 203,
        13, 13
        ];
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(isAllTriplets(fullHandCount, resultDict)).toBe(true);
    expect("對對胡" in resultDict).toBe(true);

  });

  test('isAllTriplets should return false for invalid hand', () => {
    const hands = [
        101, 101, 101,
        201, 201, 201,
        301, 301, 301, 
        11, 11, 11,
        203, 204, 205,
        13, 13
    ]; // Mixed sequences and triplets
    const resultDict = {};
    expect(isAllTriplets(hands, resultDict)).toBe(false);
    expect("對對胡" in resultDict).toBe(false);

  });


test('暗刻', () => {
    const closedGroups = [
        [102, 102], 
        [301, 301, 301],
        [101, 101, 101], 
        [102, 102, 102],
        [201, 202, 203], 
    ];
    const resultDict = {};
    closedTriplets(closedGroups, resultDict);
    expect("三暗刻" in resultDict).toBe(true);
});

test('暗刻 123, 123, 123', () => {
    const closedGroups = [
        [102, 102], 
        [301, 301, 301],
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const resultDict = {};
    closedTriplets(closedGroups, resultDict);
    expect("四暗刻" in resultDict).toBe(true);
});



//   // Test for "清么九" (Pure Terminals)
//   test('isAllTerminals should return true for valid Pure Terminals hand', () => {
//     const hands = [101, 109, 201, 209, 301, 309, 11, 13, 15]; // Only terminals
//     expect(isAllTerminals(hands)).toBe(true);
//   });

//   test('isAllTerminals should return false for invalid hand', () => {
//     const hands = [101, 102, 103, 201, 202, 203, 301, 302, 303]; // Contains middle tiles
//     expect(isAllTerminals(hands)).toBe(false);
//   });

