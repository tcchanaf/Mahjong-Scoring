// 單色
import { getHandCount,isTriplet, isSequence, addResult, fromLeadingTilesToSequences } from '../utils/commonUtils';


export function isPureStraight(fullHand, resultDict) { // 清一色
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit);
}

// 混一色 清一色 字一色
export function isStraight(fullHand, resultDict) { 
    let tmpFullHand = [...fullHand];
    tmpFullHand.sort((a, b) => a - b);
    const suit = Math.floor(tmpFullHand[tmpFullHand.length - 1] / 100) * 100;
    if (tmpFullHand.every(tile => Math.floor(tile / 100) * 100 === suit && tile > 100)) {
        addResult(resultDict, "清一色");
        return true;
    } else if (tmpFullHand.every(tile => tile < 100)) {
        addResult(resultDict, "字一色");
        return true;
    } else if (tmpFullHand.every(tile => Math.floor(tile / 100) * 100 === suit || tile < 100)) {
        addResult(resultDict, "混一色");
        return true;
    } 

    return false;
}

// 般高 
export function bunGou(closedGroups, openGroups, resultDict) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => isSequence(group)).map(group => group[0]);
    const allHandGroupsCount = getHandCount(allHandGroups);
    console.log("allHandGroupsCount", allHandGroupsCount);
    for (let leadingTile in allHandGroupsCount) {
        leadingTile = Number(leadingTile);
        if (allHandGroupsCount[leadingTile] === 2) {
            addResult(resultDict, "一般高", fromLeadingTilesToSequences([leadingTile, leadingTile]));
        } else if (allHandGroupsCount[leadingTile] === 3) {
            addResult(resultDict, "三般高", fromLeadingTilesToSequences([leadingTile, leadingTile, leadingTile]));
        } else if (allHandGroupsCount[leadingTile] === 4) {
            addResult(resultDict, "四般高", fromLeadingTilesToSequences([leadingTile, leadingTile, leadingTile, leadingTile]));
        }   
    }
}

// 姊妹
export function ziMui(closedGroups, openGroups, pairGroup, resultDict) {
    let targetTiles = [];
    const triplets = [...closedGroups, ...openGroups].filter(group => isTriplet(group)).map(group => group[0]);
    const pair = pairGroup[0][0];
    triplets.push(pair);
    triplets.sort((a, b) => a[0] - b[0]);

    let isLarge = false; //大三姊妹
    let isSmall = false; //小三姊妹

    for (let i = 0; i < triplets.length - 2; i++) {
        const first = triplets[i];
        const second = triplets[i + 1];
        const third = triplets[i + 2];

        // Check if these triplets are consecutive (e.g., 111, 222, 333)
        if (first + 1 === second && second + 1 === third) {
            if (first === pair || third === pair) {
                if (!isLarge) { // 大三姊妹 > 小三姊妹
                    isSmall = true;
                    if (first === pair)
                        targetTiles = [first, first, second, second, second, third, third, third];
                    else
                        targetTiles = [first, first, first, second, second, second, third, third];
                }
            } else {
                isLarge = true;
                targetTiles = [first, first, first, second, second, second, third, third, third];
            }
        }
    }
    if (isLarge) {
        addResult(resultDict, "大三姊妹", targetTiles);
    } else if (isSmall) {
        addResult(resultDict, "小三姊妹", targetTiles);
    }
}


// 清龍
export function flushDragon(closedGroups, openGroups, resultDict) {
    let targetTiles = [];
    const dragonTiles = new Set([101, 104, 107, 201, 204, 207, 301, 304, 307]);
    const closedDragons = closedGroups.filter(group => isSequence(group) && dragonTiles.has(group[0])).map(group => group[0]);
    const closedDragonSet = new Set(closedDragons);
    const openDragons = openGroups.filter(group => isSequence(group) && dragonTiles.has(group[0])).map(group => group[0]);

    const fullHandDragons = [...closedDragons, ...openDragons];
    const fullHandDragonSet = new Set(fullHandDragons);
    fullHandDragons.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < fullHandDragons.length - 2; i++) {
        const first = fullHandDragons[i];
        if (first % 100 !== 1) continue; // start with 101, 201, 301
        const second = first + 3;
        const third = second + 3;

        if (fullHandDragonSet.has(second) && fullHandDragonSet.has(third)) {
            targetTiles = [first, first + 1, first + 2, first + 3, first + 4, first + 5, first + 6, first + 7, first + 8];
            if (closedDragonSet.has(first) && closedDragonSet.has(second) && closedDragonSet.has(third)) { // 暗清龍 > 明清龍
                addResult(resultDict, "暗清龍", targetTiles);
            } else {
                addResult(resultDict, "明清龍", targetTiles);
            }
        }
    }
}

//四歸一 四歸二 四歸四
export function tileHog(fullHandCount, closedGroups, openGroups, pairGroups, resultDict) {
    let targetTiles = [];
    for (const tile in fullHandCount) {
        if (fullHandCount[tile] === 4) {
            targetTiles.push(Number(tile));
        }
    }

    const fullGroups = [...closedGroups, ...openGroups, ...pairGroups];
    for (const targetTile of targetTiles) {
        const numOfUse = fullGroups.filter(group => group.indexOf(targetTile) !== -1).length;
        if (numOfUse === 2) {
            addResult(resultDict, "四歸一", [targetTile]);
        } else if (numOfUse === 3) {
            addResult(resultDict, "四歸二", [targetTile]);
        } else if (numOfUse ===  4) {
            addResult(resultDict, "四歸四", [targetTile]);
        }
    }
}
