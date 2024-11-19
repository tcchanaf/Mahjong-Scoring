import { 
    threeChiefs,
    honorTile,
} from '../utils/honor';
import { getHandCount, splitToGroups, isWin, isSequence } from '../utils/commonUtils';



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
    const results = [];
    expect(threeChiefs(fullHandCount, results)).toBe(true);
    expect(results[0][0]).toEqual("小三元");
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
    const results = [];
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, results)).toBe(false);
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
    const results = [];
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, results)).toBe(true);
    expect(results[0][0]).toEqual("大三元");
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
    const results = [];
    const fullHandCount = getHandCount(hands);
    expect(threeChiefs(fullHandCount, results)).toBe(false);
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
    const isThreeChiefs = false;
    const isFourHappiness = false;
    const results = []
    const fullHandCount = getHandCount(hands);
    honorTile(fullHandCount, isThreeChiefs, isFourHappiness, wind, seat, results);
    expect(results[0][1]).toEqual(7);
  });
  
  test('番子', () => {
    const hands = [
      11, 11, 11,
      13, 13, 13,
      1, 1, 1,// 東
      15, 15, 15,
      201, 201, 201,
      301, 301
  ];
    const seat = 1; // 東位
    const wind = 1; //東圈
    const isThreeChiefs = true;
    const isFourHappiness = false;
    const results = []
    const fullHandCount = getHandCount(hands);
    honorTile(fullHandCount, isThreeChiefs, isFourHappiness, wind, seat, results);
    expect(results[0][1]).toEqual(3);
  });
  