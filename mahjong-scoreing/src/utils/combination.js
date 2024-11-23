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