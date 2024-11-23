// 糊牌類
import { addResult } from '../utils/commonUtils';

// 將眼
export function pair(closedGroups, resultDict) {
    for (const group of closedGroups) {
        if (group.length === 2) {
            if (group[0] < 100) {
                continue;
            }
            const pair = group[0] % 10;
            if (pair === 2 || pair === 5 || pair === 8) {
                addResult(resultDict, "將眼", [group[0], group[0]]);
            }
        }
    }
}

// 門清
export function allClosedHand(openHand,  resultDict) {
    if (openHand.length === 0) {
        addResult(resultDict, "門清");
    }
}