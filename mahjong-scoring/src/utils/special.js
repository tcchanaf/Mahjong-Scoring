import { isContainSpecialPattern, isSequence, addResult } from './commonUtils'

//十六不搭
export function sixteenNotMatch (closedHandCount, resultDict) {
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
    addResult(resultDict, "十六不搭");

    return true;
}

//十三么
export function thirteenOrphans(closedHandCount, resultDict) {
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
        if (remainingTiles[0] in requiredTiles) {
            addResult(resultDict, "十三么");
            return true;
        } else {
            return false;
        }
    }
    // 123, 234
    remainingTiles.sort((a, b) => a - b);
    if (remainingTiles.length === 3) {
        if (isSequence(remainingTiles)) {
            addResult(resultDict, "十三么");

        } else {
            return false;
        }
    }

    // 6789, 1239, 4569...
    let tmpTiles = remainingTiles.slice(0, 3);
    if (isSequence(tmpTiles)) {
        if (remainingTiles[3] in requiredTiles) {
            addResult(resultDict, "十三么");
            return true;
        }
    }

    // 1234, 1789, 1567
    tmpTiles = remainingTiles.slice(1, 4);
    if (isSequence(tmpTiles)) {
        if (remainingTiles[0] in requiredTiles) {
            addResult(resultDict, "十三么");
            return true;
        }
    }

    return false;
}

export function sevenPairs(closedHandCount, resultDict) { // 嚦咕嚦咕
    const sumOfTiles = Object.values(closedHandCount).reduce((sum, count) => sum + count, 0);
    if (sumOfTiles !== 17) return false;

    const counts = Object.values(closedHandCount);
    if (counts.filter(count => count === 2).length === 7 && counts.filter(count => count === 3).length === 1) {
        addResult(resultDict, "嚦咕嚦咕");
        return true;
    } else {
        return false;
    }
}