import { allClosedHand, pair } from "../utils/wining";


test('should push "將眼" when tile has last digit 2, 5, or 8', () => {
    const closedGroups = [
        [102, 102],  // "將眼"
    ];
    const results = {}
    pair(closedGroups, results);
    expect("將眼" in results).toEqual(true);
});

test('門清', () => {
  const openHands = [];
  const results = {}
  allClosedHand(openHands, results);
  expect("門清" in results).toEqual(true);
});