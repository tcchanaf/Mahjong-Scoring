import { 
    isPureStraight,
    isMixedStraight,
    isAllTriplets,
    isJuniorThreeChiefs,
    isGrandThreeChiefs,
    pair,
    closedTriplets,
    getHandCount
} from '../utils/scoring'; // Adjust the path to where your utility functions are located

describe('Mahjong Hand Validations', () => {
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
    const fullHandCount = getHandCount(hands);
    expect(isAllTriplets(fullHandCount)).toBe(true);
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
    expect(isAllTriplets(hands)).toBe(false);
  });

//   // Test for "字一色" (All Honors)
//   test('isAllHonors should return true for valid All Honors hand', () => {
//     const hands = [1, 3, 5, 7, 11, 13, 15, 1, 3, 5, 7, 11, 13]; // Only honors (winds and dragons)
//     expect(isAllHonors(hands)).toBe(true);
//   });

//   test('isAllHonors should return false for invalid hand', () => {
//     const hands = [1, 3, 5, 7, 101, 102, 103, 11, 13, 15]; // Contains a number tile
//     expect(isAllHonors(hands)).toBe(false);
//   });

  // Test for "小三元" (Junior Three Chiefs)
  test('isJuniorThreeChiefs should return true for valid Junior Three Chiefs hand', () => {
    const hands = [
        11, 11, 11,
        13, 13, 13,
        203, 204, 205,
        201, 201, 201,
        301, 301, 301, 
        15, 15,
        ];
    const fullHandCount = getHandCount(hands);
    expect(isJuniorThreeChiefs(fullHandCount)).toBe(true);
  });

  test('isJuniorThreeChiefs should return false for invalid hand', () => {
    const hands = [
        11, 11, 11,
        13, 13, 13,
        1, 1, 1, // 東
        203, 204, 205,
        201, 201, 201,
        301, 301, 
    ];
    const fullHandCount = getHandCount(hands);
    expect(isJuniorThreeChiefs(fullHandCount)).toBe(false);
  });

  // Test for "大三元" (Grand Three Chiefs)
  test('isGrandThreeChiefs should return true for valid Grand Three Chiefs hand', () => {
    const hands = [
        11, 11, 11,
        13, 13, 13,
        15, 15, 15,
        203, 204, 205,
        201, 201, 201,
        301, 301
    ];
    const fullHandCount = getHandCount(hands);
    expect(isGrandThreeChiefs(fullHandCount)).toBe(true);
  });

  test('isGrandThreeChiefs should return false for invalid hand', () => {
    const hands = [
        11, 11, 11,
        13, 13, 13,
        1, 1, 1,// 東
        203, 204, 205,
        201, 201, 201,
        301, 301
    ];// Missing one dragon triplet
    const fullHandCount = getHandCount(hands);
    expect(isGrandThreeChiefs(fullHandCount)).toBe(false);
  });

  test('should push "將眼" when tile has last digit 2, 5, or 8', () => {
    const closedGroups = [
        [102, 102],  // "將眼"
        [301, 302, 303],
        [101, 102, 103], 
    ];
    const results = []
    pair(closedGroups, results);
    expect(results.length).toEqual(1);
});

test('暗刻', () => {
    const closedGroups = [
        [102, 102], 
        [301, 301, 301],
        [101, 101, 101], 
        [102, 102, 102],
        [201, 202, 203], 
    ];
    const results = []
    closedTriplets(closedGroups, results);
    console.log(results);
    expect(results[0][0]).toEqual("三暗刻");
});

test('暗刻 123, 123, 123', () => {
    const closedGroups = [
        [102, 102], 
        [301, 301, 301],
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const results = []
    closedTriplets(closedGroups, results);
    console.log(results);
    expect(results[0][0]).toEqual("四暗刻");
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

});
