// 糊牌類

// 將眼
export function pair(closedGroups, results) {
    for (const group of closedGroups) {
        if (group.length === 2) {
            if (group[0] < 100) {
                continue;
            }
            const pair = group[0] % 10;
            if (pair === 2 || pair === 5 || pair === 8) {
                results.push(["將眼", 2, [group[0], group[0]]])
            }
        }
    }
}

// 門清
export function allClosedHand(openHand,  results) { //
    if (openHand.length === 0) {
        results.push(["門清", 3, []]);
    }
}