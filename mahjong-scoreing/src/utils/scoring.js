export const tileMapping = {
    101: '1筒', 102: '2筒', 103: '3筒', 104: '4筒', 105: '5筒', 106: '6筒', 107: '7筒', 108: '8筒', 109: '9筒',
    201: '1條', 202: '2條', 203: '3條', 204: '4條', 205: '5條', 206: '6條', 207: '7條', 208: '8條', 209: '9條',
    301: '1萬', 302: '2萬', 303: '3萬', 304: '4萬', 305: '5萬', 306: '6萬', 307: '7萬', 308: '8萬', 309: '9萬',
    1: '東風', 3: '南風', 5: '西風', 7: '北風',
    11: '白龍', 13: '發財', 15: '中發',
    21: '春', 23: '夏', 25: '秋', 27: '冬',
};

export function calculateScore(openHand, closedHand) {
    let fanCount = 0;
    let results = [];

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];
    fullHand.sort((a, b) => a - b);

    const fullHandCount = getHandCount(fullHand);
    const closedHandCount = getHandCount(closedHand);
    const openHandCount = getHandCount(openHand);
    fanCount += 5;

    const [openGroups, closedGroups] = splitToGroups(closedHandCount, openHandCount);

    const isNormalWu = isWin(closedGroups, openGroups);
    if (isHongKongThirteenOrphans(closedHandCount, results)) fanCount += 100; // 十三么
    else if (is16NotMatch(closedHandCount, results)) fanCount += 40; // 十六不搭
    else if (isSevenPairs(closedHandCount, results)) fanCount += 40; // 嚦咕嚦咕
    else if (!isNormalWu) {
        return 0;
    }

    if (isPureStraight(fullHand)) fanCount += 80; // 清一色
    else if (isMixedStraight(fullHand)) fanCount += 30; // 混一色

    if (isAllTriplets(fullHandCount)) fanCount += 30; // 對對糊

    if (isAllHonors(fullHand)) fanCount += 10; // 字一色
    if (isJuniorThreeChiefs(fullHandCount)) fanCount += 30; // 小三元
    if (isGrandThreeChiefs(fullHandCount)) fanCount += 30; // 大三元
    

    if (isAllTerminals(fullHand)) fanCount += 13; // 清么九

    
    // Add more scoring rules here

    return fanCount;
}


export function isJuniorThreeChiefs(fullHandCount) {// 小三元	
    const dragonTiles = [11, 13, 15]; //中, 發, 白
    
    let tripletCount = 0;
    let pairCount = 0;

    dragonTiles.forEach(tile => {
        if (fullHandCount[tile] === 3) {
            tripletCount++;
        } else if (fullHandCount[tile] === 2) {
            pairCount++;
        }
    });

    return tripletCount === 2 && pairCount === 1;
}

export function isGrandThreeChiefs(fullHandCount) {// 大三元	
    const requiredTiles = {
        11: 3, 13: 3, 15: 3   // 中發白
    };
    if (!isContainSpecialPattern(fullHandCount, requiredTiles)) {
        return false;
    }
    return true;
}

export function splitToGroups(closedHandCount, openHandCount) {
    const closedGroups = [];
    const openGroups = [];
    const tmpClosedHandCount = {...closedHandCount}
    isWinHelper(openHandCount, openGroups); //open Hand

    //closed Hand
    for (let tile in tmpClosedHandCount) {
        tile = Number(tile);
        if (tmpClosedHandCount[tile] > 1) { // find the pair first
            if (tmpClosedHandCount[tile] === 2) {
                delete tmpClosedHandCount[tile];
            } else {
                tmpClosedHandCount[tile] -= 2;
            }
            if (isWinHelper(tmpClosedHandCount, closedGroups)) {
                closedGroups.push([tile, tile])
                break;            }
                tmpClosedHandCount[tile] = (tmpClosedHandCount[tile] || 0) + 2;
        }
    }

    return [closedGroups, openGroups];
}

function isWin(closedGroups, openGroups) {
    let fullGroups = {...openGroups, ...closedGroups};
    const pairCount = fullGroups.filter(group => group.length === 2).length;

    return pairCount === 1 && fullGroups.length === 6;
}

function isWinHelper(handCount, groups) {
    if (Object.keys(handCount).length === 0) {
        return true;
    }

    for (let tile in handCount) {
        tile = Number(tile);
        if ((tile + 1) in handCount && (tile + 2) in handCount) {
            // if this is the sequence tile
            for (let i = 0; i < 3; i++) {  // remove the sequence tiles
                if (handCount[tile + i] === 1) {
                    delete handCount[tile + i];
                } else {
                    handCount[tile + i] -= 1;
                }
            }

            if (isWinHelper(handCount, groups)) {
                groups.push([tile, tile + 1, tile + 2]);
                return true;
            } else {
                for (let i = 0; i < 3; i++) {  // add the sequence tiles back
                    handCount[tile + i] = (handCount[tile + i] || 0) + 1;
                }
            }
        }

        // if this is the triplet tile
        if (handCount[tile] >= 3) {
            if (handCount[tile] === 3) {
                delete handCount[tile];
            } else {
                handCount[tile] -= 3;
            }
            if (isWinHelper(handCount, groups)) {
                groups.push([tile, tile, tile]);
                return true;
            } else {
                handCount[tile] = (handCount[tile] || 0) + 3;
                return false;
            }
        }
        
        // If no valid set can be formed, return false
        return false;
    }

    return false;
}



export function getHandCount(handTiles) {
    const handCount = {};
    for (const tile of handTiles) {
        handCount[tile] = (handCount[tile] || 0) + 1;
    }

    return handCount;
}

function fromHandCountToList(handCount) {
    const handList = [];
    for (const tile in handCount) {
        const count = handCount[tile];
        for (let i = 0; i < count; i++) {
            handList.push(Number(tile));
        }
    }
    return handList;
}

export function isAllTriplets(fullHandCount) { // 對對糊
    let pairCount = 0;
    let tripletCount = 0;
    for (const tile in fullHandCount) {
        const count = fullHandCount[tile];
        if (count === 2) {
            pairCount += 1;
        } else if (count === 3 || count === 4) {
            tripletCount += 1;
        } else {
            return false;
        }
    }

    return pairCount === 1 && tripletCount === (Object.keys(fullHandCount).length - 1);
}

export function isSevenPairs(closedHandCount) { // 嚦咕嚦咕
    const sumOfTiles = Object.values(closedHandCount).reduce((sum, count) => sum + count, 0);
    if (sumOfTiles !== 17) return false;

    const counts = Object.values(closedHandCount);
    return counts.filter(count => count === 2).length === 7 &&
           counts.filter(count => count === 3).length === 1;
}

export function isPureStraight(fullHand) { // 清一色
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit);
}

export function isMixedStraight(fullHand) { // 混一色
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit || tile < 100);
}

function isAllHonors(fullHand) { // 字一色
    return fullHand.every(tile => tile >= 1 && tile <= 15);
}

function isAllTerminals(fullHand) {
    return fullHand.every(tile => {
        const remainder = tile % 10;
        return remainder === 1 || remainder === 9 || (tile >= 1 && tile <= 7);
    });
}

// 十三么，十六不搭, 大三元，大四喜
function isContainSpecialPattern(handCounts, requiredTiles) {    
    for (let tile in requiredTiles) {
        if (!handCounts[tile] || handCounts[tile] < requiredTiles[tile]) {
          return false;
        }
      }

    return true;
}

//十六不搭
export function is16NotMatch (closedHandCount) {
    const sumOfTiles = Object.values(closedHandCount).reduce((sum, count) => sum + count, 0);
    if (sumOfTiles !== 17) return false;
    const requiredTiles = {
        1: 1, 3: 1, 5: 1, 7: 1,   // 東南西北
        11: 1, 13: 1, 15: 1   // 中發白
    };
    if (!isContainSpecialPattern(closedHandCount, requiredTiles)) {
        return false;
    }

    // 眼
    let pairs = Object.entries(closedHandCount)
    .filter(([tile, count]) => count === 2) 
    .map(([tile, count]) => tile);

    let remainingHandCounts = {...closedHandCount}
    for (const tile in requiredTiles) {
        if (remainingHandCounts[tile]) {
            remainingHandCounts[tile] -= requiredTiles[tile]; 
            if (remainingHandCounts[tile] === 0) {
                delete remainingHandCounts[tile]; 
            }
        }
    }

    if (remainingHandCounts.length === 0) {
        return false;
    }

    if (pairs.length !== 1) {
        return false;
    }
    delete remainingHandCounts[pairs[0]]; // remove the pair

    for (let tile of Object.keys(remainingHandCounts)) {
        tile = Number(tile);
        if ((tile + 1) in remainingHandCounts || (tile + 2) in remainingHandCounts || remainingHandCounts[tile] > 2) {
            return false;
        }
    };

    return true;
}

//十三么
export function isHongKongThirteenOrphans(closedHandCount) {
    const sumOfTiles = Object.values(closedHandCount).reduce((sum, count) => sum + count, 0);
    if (sumOfTiles !== 17) return false;

    const requiredTiles = {
        101: 1, 109: 1, // 1筒, 9筒
        201: 1,  209: 1, // 1條, 9條
        301: 1, 309: 1, // 1萬, 9萬
        1: 1, 3: 1, 5: 1, 7: 1,   // 東南西北
        11: 1, 13: 1, 15: 1   // 中發白
    };

    if (!isContainSpecialPattern(closedHandCount, requiredTiles)) {
        return false;
    }

    let remainingHandCounts = {...closedHandCount}
    let remainingTiles = [];
    Object.keys(remainingHandCounts).forEach(tile => {
        tile = Number(tile);
        if (requiredTiles[tile]) { // eliminate those necessary tiles
            remainingHandCounts[tile] -= requiredTiles[tile];
        }
        if (remainingHandCounts[tile] === 0) {
            delete remainingHandCounts[tile];
        }
        else if (remainingHandCounts[tile] === 1) {
            remainingTiles.push(tile);
        } else if (remainingHandCounts[tile] === 2) {
            if (tile in requiredTiles){
                remainingTiles.push(tile); // 眼 1123 -> remainingTiles: [1,2,3]
            } else { // 1223 
                return false;
            }
        } else if (remainingTiles[tile] === 4) { // 2222
            return false; 
        }// else if (remainingTiles[tile] === 3) { // 刻子 1119
    });
    if (remainingTiles.length === 1) {
        return remainingTiles[0] in requiredTiles;
    }
    // 123, 234
    remainingTiles.sort((a, b) => a - b);
    if (remainingTiles.length === 3) {
        return isSequence(remainingTiles);
    }

    // 6789, 1239, 4569...
    let tmpTiles = remainingTiles.slice(0, 3);
    if (isSequence(tmpTiles)) {
        if (remainingTiles[3] in requiredTiles) {
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
