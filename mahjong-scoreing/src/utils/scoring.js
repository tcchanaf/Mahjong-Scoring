export const tileMapping = {
    101: '1筒', 102: '2筒', 103: '3筒', 104: '4筒', 105: '5筒', 106: '6筒', 107: '7筒', 108: '8筒', 109: '9筒',
    111: '1條', 112: '2條', 113: '3條', 114: '4條', 115: '5條', 116: '6條', 117: '7條', 118: '8條', 119: '9條',
    121: '1萬', 122: '2萬', 123: '3萬', 124: '4萬', 125: '5萬', 126: '6萬', 127: '7萬', 128: '8萬', 129: '9萬',
    1: '東風', 2: '南風', 3: '西風', 4: '北風', 5: '白龍', 6: '發財', 7: '中發',
    11: '春', 12: '夏', 13: '秋', 14: '冬',
};

export function calculateScore(openHand, closedHand) {
    let fanCount = 0;

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];

    if (!isWin(fullHand)) {
        return 0
    }

    // Basic winning hand
    fanCount += 5;

    // Check for various hand types
    if (isAllPungs(fullHand, openHand)) fanCount += 3; // 對對和
    if (isSevenPairsWithPair(closedHand)) fanCount += 40; // 七對 (加一對)
    if (isPureStraight(fullHand)) fanCount += 70; // 清一色
    if (isAllHonors(fullHand)) fanCount += 10; // 字一色
    if (isAllTerminals(fullHand)) fanCount += 13; // 清么九
    if (isHongKongThirteenOrphans(closedHand)) fanCount += 1000; // 十三么
    if (is16NotMatch(closedHand)) fanCount += 10000; // 十六不搭
    
    // Add more scoring rules here

    return fanCount;
}

function isWin(fullHand) {
    if (fullHand.length !== 17) {
        return false;
    }
    return true;
}

function isAllPungs(fullHand, openHand) {
    // This function needs to be implemented to check for all pongs/kongs
    // It should account for the extra pair in a 17-tile hand
    return false; // Placeholder
}

function isSevenPairsWithPair(closedHand) {
    if (closedHand.length !== 17) return false;
    const pairCounts = {};
    for (const tile of closedHand) {
        pairCounts[tile] = (pairCounts[tile] || 0) + 1;
    }
    const counts = Object.values(pairCounts);
    return counts.filter(count => count === 2).length === 7 &&
           counts.filter(count => count === 3).length === 1;
}

function isPureStraight(fullHand) {
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit);
}

function isAllHonors(fullHand) {
    return fullHand.every(tile => tile >= 1 && tile <= 7);
}

function isAllTerminals(fullHand) {
    return fullHand.every(tile => {
        const remainder = tile % 10;
        return remainder === 1 || remainder === 9 || (tile >= 1 && tile <= 7);
    });
}

// 十三么，十六不搭
function isContainSpecialPattern(closedHand, requiredTiles) {
    if (closedHand.length !== 17) return false;

    const handCounts = {};
    for (const tile of closedHand) {
        handCounts[tile] = (handCounts[tile] || 0) + 1;
    }
    
    const requiredTilesArray = Array.from(requiredTiles);
    const hasRequiredTiles = requiredTilesArray.every(tile => handCounts[tile] >= 1);

    if (!hasRequiredTiles) {
        return {};
    }

    for (const tile of requiredTiles) {
        if (handCounts[tile]) {
            handCounts[tile]--; 
            if (handCounts[tile] === 0) {
                delete handCounts[tile]; 
            }
        }
    }

    return handCounts;
}

function is16NotMatch (closedHand) {
    const requiredTiles = new Set([
        1, 2, 3, 4, 5, 6, 7, // 番子
    ]);

    const handCounts = isContainSpecialPattern(closedHand, requiredTiles);
    if (handCounts.length === 0) {
        return false;
    }

    let hasOnePair = false;
    for (let tile of Object.keys(handCounts)) {
        tile = Number(tile);
        if ((tile < 10 && handCounts[tile] === 1) || (tile > 10 && handCounts[tile] === 2)) { // 眼
            if (hasOnePair) {
                return false;
            } else {
                hasOnePair = true;
            }
        } else if ((tile + 1) in handCounts || (tile + 2) in handCounts) {
            return false;
        } else if (handCounts[tile] > 2){
            return false;
        }
    };

    return true;
}

//十三么
function isHongKongThirteenOrphans(closedHand) {
    const requiredTiles = new Set([
        101, 109, // 1筒, 9筒
        111, 119, // 1條, 9條
        121, 129, // 1萬, 9萬
        1, 2, 3, 4, 5, 6, 7, // 番子
    ]);

    const handCounts = isContainSpecialPattern(closedHand, requiredTiles);
    if (handCounts.length === 0) {
        return false;
    }


    let remainingTiles = [];
    Object.keys(handCounts).forEach(tile => {
        tile = Number(tile);
        if (handCounts[tile] === 1) {
            if (tile > 10) { //不是番子
                remainingTiles.push(tile);
            }
        } else if (handCounts[tile] === 2) {
            if (requiredTiles.has(tile)){
                remainingTiles.push(tile); // 眼 1123 -> remainingTiles: [1,2,3]
            } else { // 1223 
                return false;
            }
        } else if (handCounts[tile] === 4) { // 2222
            return false; 
        }// else if (handCounts[tile] === 3) { // 刻子 1119
    });

    if (remainingTiles.length === 1) {
        return requiredTiles.has(remainingTiles[0]);
    }
    
    // 123, 234
    remainingTiles.sort((a, b) => a - b);
    if (remainingTiles.length === 3) {
        return isSequence(remainingTiles);
    }

    // 6789, 1239, 4569...
    let tmpTiles = remainingTiles.slice(0, 3);
    if (isSequence(tmpTiles)) {
        if (requiredTiles.has(remainingTiles[3])) {
            return true;
        }
    }

    // 1234, 1789, 1567
    tmpTiles = remainingTiles.slice(1, 4);
    if (isSequence(tmpTiles)) {
        if (requiredTiles.has(remainingTiles[0])) {
            return true;
        }
    }

    return false;
}
    

// call only tiles.length is 3
function isSequence(tiles) {
    return tiles[0] + 1 === tiles[1] && tiles[1] + 1 === tiles[2];
}

// Helper function to check if a tile can form a valid sequence
function isValidSequence(tile) {
    const sequences = [
        [101, 102, 103], // 1筒, 2筒, 3筒
        [111, 112, 113], // 1條, 2條, 3條
        [121, 122, 123], // 1萬, 2萬, 3萬
    ];
    return sequences.some(sequence => sequence.includes(tile));
}

