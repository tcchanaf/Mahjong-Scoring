import { allClosedHand, pair, winingTile } from "../utils/wining";


test('將眼', () => {
    const closedGroups = [
        [102, 102],  // "將眼"
    ];
    const resultDict = {}
    pair(closedGroups, resultDict);
    expect("將眼" in resultDict).toEqual(true);
});

test('門清', () => {
  const openHands = [];
  const resultDict = {}
  allClosedHand(openHands, resultDict);
  expect("門清" in resultDict).toEqual(true);
});

test('對碰', () => {
  const closedHand = [ 
    11, 11, 11, // 中
    13, 13, 13, // 發
    1, 1, 1,// 東
    15, 15, 15, //白
    301, 301,
    201, 201, 201,
  ];
  const closedGroups = [
    [11, 11, 11],
    [13, 13, 13],
    [1, 1, 1],
    [15, 15, 15],
    [201, 201, 201],
  ];
  const pairGroup = [[301, 301]];
  const resultDict = {}
  winingTile(closedHand, closedGroups, pairGroup, resultDict);
  expect("對碰" in resultDict).toEqual(true);
});

test('假獨', () => {
  const closedHand = [ 
    11, 11, 11, // 中
    13, 13, 13, // 發
    1, 1, 1,// 東
    15, 15, 15, //白
    301, 302, 303,
    301, 301,
  ];
  const closedGroups = [
    [11, 11, 11],
    [13, 13, 13],
    [1, 1, 1],
    [15, 15, 15],
    [301, 302, 303],
  ];
  const pairGroup = [[301, 301]];
  const resultDict = {}
  winingTile(closedHand, closedGroups, pairGroup, resultDict);
  expect("假獨" in resultDict).toEqual(true);
});

test('獨獨, 食眼', () => {
  const closedHand = [ 
    11, 11, 11, // 中
    13, 13, 13, // 發
    1, 1, 1,// 東
    15, 15, 15, //白
    302, 303, 304,
    301, 301,
  ];
  const closedGroups = [
    [11, 11, 11],
    [13, 13, 13],
    [1, 1, 1],
    [15, 15, 15],
    [302, 303, 304],
  ];
  const pairGroup = [[301, 301]];
  const resultDict = {}
  winingTile(closedHand, closedGroups, pairGroup, resultDict);
  expect("獨獨" in resultDict).toEqual(true);
});

test('獨獨 卡窿', () => {
  const closedHand = [ 
    11, 11, 11, // 中
    13, 13, 13, // 發
    1, 1, 1,// 東
    15, 15, 15, //白
    301, 301,
    302, 304, 303
  ];
  const closedGroups = [
    [11, 11, 11],
    [13, 13, 13],
    [1, 1, 1],
    [15, 15, 15],
    [302, 303, 304],
  ];
  const pairGroup = [[301, 301]];
  const resultDict = {}
  winingTile(closedHand, closedGroups, pairGroup, resultDict);
  expect("獨獨" in resultDict).toEqual(true);
});

test('0 對碰 假獨 獨獨', () => {
  const closedHand = [ 
    11, 11, 11, // 中
    13, 13, 13, // 發
    1, 1, 1,// 東
    15, 15, 15, //白
    301, 301,
    302, 303, 304
  ];
  const closedGroups = [
    [11, 11, 11],
    [13, 13, 13],
    [1, 1, 1],
    [15, 15, 15],
    [302, 303, 304],
  ];
  const pairGroup = [[301, 301]];
  const resultDict = {}
  winingTile(closedHand, closedGroups, pairGroup, resultDict);
  expect(Object.keys(resultDict).length).toEqual(0);
});