// 雜色
import { getHandCount,isTriplet, isSequence, addResult } from '../utils/commonUtils';

// 兄弟
export function hingDai(closedGroups, openGroups, pairGroup, resultDict) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => isTriplet(group) && group[0] > 100);
    const pair = pairGroup[0][0];
    let groupCount = {};

    for (const group of allHandGroups) {
        const number = group[0] % 100;
        groupCount[number] = (groupCount[number] || []);
        groupCount[number].push(group);
    }

    for (const number in groupCount) {
        if (groupCount[number].length < 2) continue;
        if (groupCount[number].length === 2) {
            if (Number(number) === (pair % 100)) {
                addResult(resultDict, "小三兄弟", [...groupCount[number][0], ...groupCount[number][1], ...pairGroup[0]]);
            } else {
                addResult(resultDict, "二兄弟", [...groupCount[number][0], ...groupCount[number][1]]);
            }
        } else {
            addResult(resultDict, "大三兄弟", [...groupCount[number][0], ...groupCount[number][1], ...groupCount[number][2]]);
        }
    }
}


// 雜龍
export function nonFlushDragon(closedGroups, openGroups, resultDict) {
    let targetTiles = [];
    const dragonTiles = new Set([101, 104, 107, 201, 204, 207, 301, 304, 307]);
    const closedDragons = closedGroups.filter(group => isSequence(group) && dragonTiles.has(group[0])).map(group => group[0]);
    const closedDragonSet = new Set(closedDragons);
    const openDragons = openGroups.filter(group => isSequence(group) && dragonTiles.has(group[0])).map(group => group[0]);

    const fullHandDragons = [...closedDragons, ...openDragons];
    const fullHandDragonDict = {};
    for (const dragonTile of fullHandDragons) {
        const number = Number(dragonTile) % 100;
        fullHandDragonDict[number] = (fullHandDragonDict[number] || []);
        fullHandDragonDict[number].push(dragonTile);
    }

    fullHandDragons.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < fullHandDragons.length - 2; i++) {
        const first = fullHandDragons[i];
        if (first % 100 !== 1) continue; // start with 101, 201, 301
        const suit = Math.floor(first / 100) * 100;
        let suitSet = new Set([suit]);
        const isClosed = closedDragonSet.has(first);
        targetTiles = [first, first + 1, first + 2];
        if (nonFlushDragonHelper(suitSet, fullHandDragonDict, closedDragonSet, 4, isClosed, targetTiles, resultDict)) return;
    }
}

function nonFlushDragonHelper(suitSet, fullHandDragonDict, closedDragonSet, targetNumber, isClosed, targetTiles, resultDict) {
    if (!(targetNumber in fullHandDragonDict)) return false;
    for (let dragonTile of fullHandDragonDict[targetNumber]) {
        const suit = Math.floor(dragonTile / 100) * 100;
        if (suitSet.has(suit)) continue;
        if (isClosed && !closedDragonSet.has(dragonTile)) {
            isClosed = false;
        }
        targetTiles = [...targetTiles, dragonTile, dragonTile + 1, dragonTile + 2];
        if (targetNumber === 7) {
            if (isClosed) {
                addResult(resultDict, "暗雜龍", targetTiles);
            } else {
                addResult(resultDict, "明雜龍", targetTiles);
            }
            return true;
        }
        if (nonFlushDragonHelper(new Set([...suitSet, suit]), fullHandDragonDict, closedDragonSet, targetNumber + 3, isClosed, targetTiles, resultDict)) {
            return true;
        }
    }
}