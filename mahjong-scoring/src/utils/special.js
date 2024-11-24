import { isContainSpecialPattern, isSequence, addResult, fromHandCountToList, isTriplet } from './commonUtils'

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
    Object.keys(remainingHandCounts).forEach(tile => {
        tile = Number(tile);
        if (requiredTiles[tile]) { // remove those necessary tiles
            remainingHandCounts[tile] -= requiredTiles[tile];
        }
        if (remainingHandCounts[tile] === 0) {
            delete remainingHandCounts[tile];
        }
    });

    let remainingTiles = fromHandCountToList(remainingHandCounts);
    if (remainingTiles.length !== 4) return false
    remainingTiles.sort((a, b) => a - b);
    if (remainingTiles[0] in requiredTiles && (isSequence(remainingTiles.slice(1, 4)) || isTriplet(remainingTiles.slice(1, 4)))) {
        addResult(resultDict, "十三么");
        return true;
    } else if (remainingTiles[3] in requiredTiles && (isSequence(remainingTiles.slice(0, 3)) || isTriplet(remainingTiles.slice(0, 3)))) {
        addResult(resultDict, "十三么");
        return true;
    } else {
        return false;
    }    
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