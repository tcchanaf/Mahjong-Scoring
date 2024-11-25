// 糊牌類
import { addResult, isTriplet } from '../utils/commonUtils';

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

// 對碰 假獨 獨獨 //TODO handle 十三么 十六不搭 嚦咕嚦咕
export function winingTile(closedHand, closedGroups, pairGroup, resultDict) {
    const winingTile = closedHand[closedHand.length - 1];
    const pairTile = pairGroup[0][0];

    for (const group of closedGroups) {
        const ind = group.indexOf(winingTile);
        if (ind === -1) continue;
        if (isTriplet(group)) {
            addResult(resultDict, "對碰");
            return;
        }
        if (ind === 1) { //卡窿
            addResult(resultDict, "獨獨");
            return;
        }
        if ((winingTile % 100 === 3 && ind === 2) || (winingTile % 100 === 7 && ind === 0)) { // 12(3) or (7)89
            addResult(resultDict, "獨獨");
            return;
        }
        if (pairTile === winingTile) { // not 卡窿 and === pairTile
            addResult(resultDict, "假獨");
            return;
        }
    }
    if (pairTile === winingTile) {
        addResult(resultDict, "獨獨");
    }
}
