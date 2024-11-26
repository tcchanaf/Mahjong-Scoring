import { 
    threeChiefs,
    fourHappiness,
    honorTile,
} from '../utils/honor';
import { isStraight } from '../utils/flush';
import { getHandCount, toResultList, splitToGroups, isWin, isSequence } from '../utils/commonUtils';



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
    const resultDict = {};
    expect(threeChiefs(fullHandCount, resultDict)).toBe(true);
    expect("小三元" in resultDict).toEqual(true);
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
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, resultDict)).toBe(false);
    expect("小三元" in resultDict).toEqual(false);
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
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, resultDict)).toBe(true);
    expect("大三元" in resultDict).toEqual(true);
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
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, resultDict)).toBe(false);
    expect("大三元" in resultDict).toEqual(false);

  });



  test('大四喜', () => {
    const hands = [
      1, 1, 1,// 東南西北
      3, 3, 3,
      5, 5, 5,
      7, 7, 7,
      201, 201, 201,
      301, 301
    ];
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(fourHappiness(fullHandCount, resultDict)).toBe(true);
    expect("大四喜" in resultDict).toEqual(true);
  });

  test('小四喜', () => {
    const hands = [
      1, 1, 1,// 東南西北
      3, 3, 3,
      5, 5, 5,
      107, 107, 107,
      201, 201, 201,
      7, 7
    ];
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    expect(fourHappiness(fullHandCount, resultDict)).toBe(true);
    expect("小四喜" in resultDict).toEqual(true);
  });
  
  test('番子', () => {
    const hands = [
      11, 11, 11,
      13, 13, 13,
      1, 1, 1,// 東
      203, 204, 205,
      201, 201, 201,
      301, 301
  ];
    const seat = 1; // 東位
    const wind = 1; //東圈
    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    honorTile(fullHandCount, wind, seat, resultDict);
    expect(resultDict["番子"][0][1]).toEqual(7);
  });
  
  test('番子', () => {
    const hands = [
      11, 11, 11, // 中
      13, 13, 13, // 發
      1, 1, 1,// 東
      15, 15, 15, //白
      201, 201, 201,
      301, 301
  ];
    const seat = 1; // 東位
    const wind = 1; //東圈
    const resultDict = {"大三元": []};
    const fullHandCount = getHandCount(hands);
    honorTile(fullHandCount, wind, seat, resultDict);
    expect(resultDict["番子"][0][1]).toEqual(3);
  });
  

  test('無字', () => {
    const hands = [
      101, 101, 101,
      103, 103, 103,
      104, 105, 106,
      205, 205, 205,
      201, 201, 201,
      301, 301
  ];

    const resultDict = {};
    const fullHandCount = getHandCount(hands);
    honorTile(fullHandCount, 1, 1, resultDict);
    expect("無字" in resultDict).toEqual(true);
  });

test('字一色 小四喜 番子', () => {
  const hands = [
      11, 11, 11,
      13, 13, 13,
      1, 1, 1,
      3, 3, 3,
      5, 5, 5,
      7, 7
  ];
  const seat = 1; // 東位
  const wind = 1; //東圈
  const fullHandCount = getHandCount(hands);
  const resultDict = {};
  fourHappiness(fullHandCount, resultDict);
  expect(isStraight(hands, resultDict)).toBe(true);
  honorTile(fullHandCount, wind, seat, resultDict);
  expect("字一色" in resultDict).toBe(true);
  expect("小四喜" in resultDict).toEqual(true);
  expect(resultDict["番子"][0][1]).toEqual(4);
});
  