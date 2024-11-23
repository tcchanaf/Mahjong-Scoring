// 單色
import { getHandCount,isTriplet, isSequence, addResult } from '../utils/commonUtils';


export function isPureStraight(fullHand) { // 清一色
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit);
}

export function isMixedStraight(fullHand) { // 混一色
    const suit = Math.floor(fullHand[0] / 100) * 100;
    return fullHand.every(tile => Math.floor(tile / 100) * 100 === suit || tile < 100);
}

// 般高 
export function bunGou(closedGroups, openGroups, resultDict) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => isSequence(group));
    const allHandGroupsCount = getHandCount(allHandGroups);
    for (const group of allHandGroups) {
        if (allHandGroupsCount[group] === 2) {
            addResult(resultDict, "一般高", group);
        } else if (allHandGroupsCount[group] === 3) {
            addResult(resultDict, "三般高", group);
        } else if (allHandGroupsCount[group] === 5) {
            addResult(resultDict, "四般高", group);
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
    const closedDragons = closedGroups.filter(group => isSequence(group) || group[0] in dragonTiles).map(group => group[0]);
    const closedDragonSet = new Set(closedDragons);
    const openDragons = openGroups.filter(group => isSequence(group) || group[0] in dragonTiles).map(group => group[0]);

    const fullHandDragons = [...closedDragons, ...openDragons];
    const fullHandDragonSet = new Set(fullHandDragons);
    fullHandDragons.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < fullHandDragons.length - 2; i++) {
        const first = fullHandDragons[i];
        if (first % 100 !== 1) continue; // start with 101, 201, 301
        const second = first + 3;
        const third = second + 3;
        console.log(second, fullHandDragonSet, fullHandDragonSet.has(second) );

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
