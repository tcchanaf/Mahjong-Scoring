export const tileMapping = {
    101: '1筒', 102: '2筒', 103: '3筒', 104: '4筒', 105: '5筒', 106: '6筒', 107: '7筒', 108: '8筒', 109: '9筒',
    201: '1條', 202: '2條', 203: '3條', 204: '4條', 205: '5條', 206: '6條', 207: '7條', 208: '8條', 209: '9條',
    301: '1萬', 302: '2萬', 303: '3萬', 304: '4萬', 305: '5萬', 306: '6萬', 307: '7萬', 308: '8萬', 309: '9萬',
    1: '東', 3: '南', 5: '西', 7: '北',
    11: '中', 13: '發', 15: '白',
    21: '春', 23: '夏', 25: '秋', 27: '冬',
};

export function calculateScore(openHand, closedHand) {
    const wind = 1; //TODO as input, default 東圈 東位
    const seat = 1;

    let fanCount = 0;
    let results = []; //format: [["faan name", faan count, [related tiles], ...]

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];
    fullHand.sort((a, b) => a - b);

    const fullHandCount = getHandCount(fullHand);
    const closedHandCount = getHandCount(closedHand);
    const openHandCount = getHandCount(openHand);
    fanCount += 5;

    const [closedGroups, openGroups] = splitToGroups(closedHandCount, openHandCount);

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
    const threeChiefs = isThreeChiefs(fullHandCount, results); // 大小三元
    const fourHappiness = fourHappiness(fullHandCount, results); // //大四喜, 小四喜, 大三風, 小三風
    honorTile(fullHandCount, threeChiefs, fourHappiness, wind, seat, results);
    

    if (isAllTerminals(fullHand)) fanCount += 13; // 清么九

    
    // Add more scoring rules here

    return fanCount;
}

// 番子 東南西北 中發白 
// TODO test case
export function honorTile(fullHandCount, threeChiefs, fourHappiness, wind, seat, results) {
    let honorTiles;
    if (fourHappiness) {
        honorTiles = [11, 13, 15]; //avoid double count 
    } else if (threeChiefs) {
        honorTiles = [1, 3, 5, 7]; //avoid double count 
    } else {
        honorTiles = [1, 3, 5, 7, 11, 13, 15]; //東南西北 中發白
    }
    let faanCount = 0;

    honorTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            if (tile === wind) {
                faanCount += 1;
            }
            if (tile === seat) {
                faanCount += 1;
            }
        }
    });

    if (faanCount > 0) {
        results.push(["番子", faanCount, []]);
    }
}

// 將眼
export function pair(closedGroups, results) { //TODO handle seven pairs
    for (const group of closedGroups) {
        if (group.length === 2) {
            if (group[0] < 100) {
                continue;
            }
            const pair = group[0] % 10;
            if (pair === 2 || pair === 5 || pair === 8) {
                results.push(["將眼", 2, [group[0], group[0]]])
            }
        }
    }
}

// 暗刻
export function closedTriplets(closedGroups, results) {
    const tmpClosedHandGroups = closedGroups.filter(group => group.length > 2);
    let tripletCount = 0;
    const groups = []
    // if 暗三般高 -> 三暗刻: 123, 123, 123, 123 -> 111, 222, 333, 123
    const sequenceCounts = {};
    for (const group of tmpClosedHandGroups) {
        if (group[0] === group[1] || group[1] === group[2]) {
            tripletCount += 1;
            groups.push(group);
        } else if (isSequence(group)) {
            const sequenceKey = group[0];
            sequenceCounts[sequenceKey] = (sequenceCounts[sequenceKey] || 0) + 1;
        }
    }

    for (let sequence in sequenceCounts) {
        if (sequenceCounts[sequence] >= 3) { //暗三般高
            tripletCount += 3;
            sequence = Number(sequence);
            groups.push([sequence, sequence, sequence]);
            groups.push([sequence + 1, sequence + 1, sequence + 1]);
            groups.push([sequence + 2, sequence + 2, sequence + 2]);
        }
    }

    if (tripletCount === 2) {
        results.push(["二暗刻", 3, groups])
    } else if (tripletCount === 3) {
        results.push(["三暗刻", 10, groups])
    } else if (tripletCount === 4) {
        results.push(["四暗刻", 30, groups])
    } else if (tripletCount === 5) {
        results.push(["五暗刻", 80, groups])
    } //TODO 間間糊
}

//大四喜, 小四喜, 大三風, 小三風
// TODO test case
export function fourHappiness(fullHandCount, results) {
    const windTiles = [1, 3, 5, 7]; //東南西北
    let tripletCount = 0;
    let pairCount = 0;
    windTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            tripletCount++;
        } else if (fullHandCount[tile] === 2) {
            pairCount++;
        }
    });

    if (tripletCount === 4) {
        results.push(["大四喜", 80, []]);
    } else if (tripletCount === 3 && pairCount === 1) {
        results.push(["小四喜", 60, []]);
    } else if (tripletCount === 3) {
        results.push(["大三風", 30, []]);
    } else if (tripletCount === 2 && pairCount === 1) {
        results.push(["小三風", 15, []]);
    }

    return tripletCount >= 3 || (tripletCount >= 2 && pairCount === 1);
}


export function isThreeChiefs(fullHandCount, results) {// 大小三元	
    const dragonTiles = [11, 13, 15]; //中, 發, 白
    
    let tripletCount = 0;
    let pairCount = 0;
    dragonTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            tripletCount++;
        } else if (fullHandCount[tile] === 2) {
            pairCount++;
        }
    });

    if (tripletCount === 3) {
        results.push(["大三元", 40, []]);
    } else if (tripletCount === 2 && pairCount === 1) {
        results.push(["小三元", 20, []]);
    }

    return tripletCount === 3 || (tripletCount === 2 && pairCount === 1);
}


export function splitToGroups(closedHandCount, openHandCount) {
    const closedGroups = [];
    const openGroups = [];
    let tmpClosedHandCount = {...closedHandCount}
    splitHelper(openHandCount, openGroups); //open Hand

    //closed Hand prioritising sequence
    for (let tile in tmpClosedHandCount) {
        tile = Number(tile);
        if (tmpClosedHandCount[tile] > 1) { // find the pair first
            if (tmpClosedHandCount[tile] === 2) {
                delete tmpClosedHandCount[tile];
            } else {
                tmpClosedHandCount[tile] -= 2;
            }
            if (splitHelper(tmpClosedHandCount, closedGroups)) {
                closedGroups.push([tile, tile])
                break;   
            }
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

function splitHelper(handCount, groups) {
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

            if (splitHelper(handCount, groups)) {
                groups.push([tile, tile + 1, tile + 2]);
                return true;
            } else {
                for (let i = 0; i < 3; i++) {  // add the sequence tiles back
                    handCount[tile + i] = (handCount[tile + i] || 0) + 1;
                }
            }
        }

        if (handCount[tile] >= 3) {
            // assume quadruplet
            if (handCount[tile] === 4) {
                delete handCount[tile];
                if (splitHelper(handCount, groups)) {
                    groups.push([tile, tile, tile, tile]);
                    return true;
                } else {
                    handCount[tile] = 4;
                }
            }

            // if this is the triplet tile
            if (handCount[tile] === 3) {
                delete handCount[tile];
            } else {
                handCount[tile] -= 3;
            }
            if (splitHelper(handCount, groups)) {
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
