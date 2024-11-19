import { allClosedHand, pair } from "../utils/wining";


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

test('門清', () => {
  const openHands = [];
  const results = []
  allClosedHand(openHands, results);
  expect(results.length).toEqual(1);
});