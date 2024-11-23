//花

// 花 無花 正花 //TODO
export function flowers(closedGroups, openGroups, results) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => isSequence(group));
    const allHandGroupsCount = getHandCount(allHandGroups);
    for (const group of allHandGroups) {
        if (allHandGroupsCount[group] === 2) {
            results.push([patterns["一般高"][0], patterns["一般高"][1], group]);
        } else if (allHandGroupsCount[group] === 3) {
            results.push([patterns["三般高"][0], patterns["三般高"][1], group]);
        } else if (allHandGroupsCount[group] === 5) {
            results.push([patterns["四般高"][0], patterns["四般高"][1], group]);
        }   
    }
}