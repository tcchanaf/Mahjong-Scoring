// 糊牌類
import { addResult } from '../utils/commonUtils';

// 將眼
export function pair(pairGroup, resultDict) {
    for (const group of pairGroup) {
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
    if ("十三么" in resultDict || "十六不搭" in resultDict || "嚦咕嚦咕" in resultDict) return;

    if (openHand.length === 0) {
        if ("自摸" in resultDict) {
            addResult(resultDict, "門清自摸");
        } else {
            addResult(resultDict, "門清");
        }
    }
}