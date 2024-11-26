import { isSequence, addResult } from "./commonUtils"

// 平胡
export function allSequence(closedGroups, openGroups, resultDict) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => group.length > 2);
    if(allHandGroups.every(group => isSequence(group)) && allHandGroups.length === 5) {
        addResult(resultDict, "平胡");
        return true;
    } else {
        return false;
    }
}

//缺一門
export function lackOneSuit(fullHandCount, resultDict) {
    let suitSet = new Set();
    for(let tile in fullHandCount) {
        tile = Number(tile);
        if (tile < 100) return false;
        const suit = Math.floor(tile / 100) * 100;
        suitSet.add(suit);
        if (suitSet.size > 2) {
            return false;
        }
    }

    if  (suitSet.size === 2) {
        if ("無字" in resultDict) {
            delete resultDict["無字"];
        }
        addResult(resultDict, "缺一門");
        return true;
    } else {
        return false;
    }
}