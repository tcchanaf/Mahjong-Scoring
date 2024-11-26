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

//缺一門 七門齊 五門齊
export function twoFiveSevenSuit(fullHandCount, flowers, resultDict) {
    let suitSet = new Set();
    let hasHonor = false;
    for(let tile in fullHandCount) {
        tile = Number(tile);
        const suit = Math.floor(tile / 10) * 10;
        if (tile < 100) {
            hasHonor = true;
        }
        suitSet.add(suit);
    }

    if (suitSet.size === 2 && !hasHonor) {
        if ("無字" in resultDict) {
            delete resultDict["無字"];
        }
        addResult(resultDict, "缺一門");
        return true;
    } else if (suitSet.size === 5) {
        for (let flower of flowers) {
            suitSet.add(Math.floor(flower / 10) * 10);
        }
        if (suitSet.size === 7) {
            addResult(resultDict, "七門齊");
        } else {
            addResult(resultDict, "五門齊");
        }
    }
}