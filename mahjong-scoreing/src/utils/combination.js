import { isSequence } from "./commonUtils"

// 平糊
export function allSequence(closedGroups, openGroups) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => group.length > 2);
    return allHandGroups.every(group => isSequence(group)) && allHandGroups.length === 5;
}