import { getHandCount, splitToGroups, isWin, isSequence, addResult, toResultList } from '../utils/commonUtils';
import { thirteenOrphans, sixteenNotMatch, sevenPairs } from '../utils/special';
import { 
    isStraight, bunGou, ziMui, flushDragon, tileHog
} from '../utils/flush';
import { 
    hingDai, nonFlushDragon,
} from '../utils/nonFlush';

import { allClosedHand, pair, winingTile } from "../utils/wining";
import { 
    threeChiefs, honorTile, fourHappiness
} from '../utils/honor';
import { flowerFaan, noFlowerNoHonor, noFlowerNoHonorAllSequence } from '../utils/flower';
import { specialButtons } from '../utils/constant';
import { allSequence, twoFiveSevenSuit } from '../utils/combination';


export function calculateScore(openHand, closedHand, flowers, wind, seat, specialFaans) {
    let resultDict = {}; //format: {faanName: [["faanName", faan count, [related tiles],[...]], faanName2: []...}

    handleSpecialFaan(specialFaans, resultDict);

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];
    fullHand.sort((a, b) => a - b);

    const fullHandCount = getHandCount(fullHand);
    const closedHandCount = getHandCount(closedHand);
    const openHandCount = getHandCount(openHand);

    const [closedGroups, openGroups, pairGroups] = splitToGroups(closedHandCount, openHandCount);


    const isNormalWu = isWin(closedGroups, openGroups);
    if (thirteenOrphans(closedHandCount, resultDict)) {  // 十三么
        addResult(addResult, "十三么", []);
    }
    else if (sixteenNotMatch(closedHandCount, resultDict)) {// 十六不搭
        addResult(addResult, "十六不搭", []);
    }
    else if (sevenPairs(closedHandCount, resultDict)){ // 嚦咕嚦咕
        addResult(addResult, "嚦咕嚦咕", []);
    } 
    else if (!isNormalWu) {
        return [
            ["詐胡", 0, []],
        ];
    }

    allClosedHand(openHand, resultDict); //門清
    

    isStraight(fullHand, resultDict); // 清一色 混一色 字一色

    isAllTriplets(fullHandCount, resultDict); // 對對糊
    allSequence(closedGroups, openGroups, resultDict); //平胡

    threeChiefs(fullHandCount, resultDict); // 大小三元
    fourHappiness(fullHandCount, resultDict); // //大四喜, 小四喜, 大三風, 小三風
    flowerFaan(flowers, seat, resultDict); // 花
    honorTile(fullHandCount, wind, seat, resultDict); // 番子
    noFlowerNoHonor(resultDict);  //無字花
    noFlowerNoHonorAllSequence(resultDict); //無字花大平胡

    pair(pairGroups, resultDict); //將眼
    winingTile(closedHand, closedGroups, pairGroups, resultDict); // 對碰 假獨 獨獨

    flushDragon(closedGroups, openGroups, resultDict); //清龍
    nonFlushDragon(closedGroups, openGroups, resultDict); //雜龍
    ziMui(closedGroups, openGroups, pairGroups, resultDict); //姊妹
    hingDai(closedGroups, openGroups, pairGroups, resultDict); //兄弟
    bunGou(closedGroups, openGroups, resultDict); //般高

    twoFiveSevenSuit(fullHandCount, flowers, resultDict); //缺一門 七門齊 五門齊
    tileHog(fullHandCount, closedGroups, openGroups, pairGroups, resultDict);  //四歸一 四歸二 四歸四



    isAllTerminals(fullHand); // 清么九

    const results = toResultList(resultDict);

    return results;
}

export function handleSpecialFaan(specialFaans, resultDict) {
    const activeSpecialFaans = specialFaans
        .map((isActive, index) => (isActive ? specialButtons[index] : null))
        .filter(item => item !== null);
    for (const faanItem of activeSpecialFaans) {
        addResult(resultDict, faanItem);
    }
    addResult(resultDict, "底");
}

export function getTotalScore(resultList) {
    const score = resultList.reduce((total, result) => {
        return total + result[1];
      }, 0);
      return score;
}

// 暗刻
export function closedTriplets(closedGroups, resultDict) {
    const tmpClosedHandGroups = closedGroups.filter(group => group.length > 2);
    let tripletCount = 0;
    const groups = []
    // if 暗三般高 -> 三暗刻: 123, 123, 123, 123 -> 111, 222, 333, 123
    const sequenceCounts = {};
    for (const group of tmpClosedHandGroups) {
        if (group[0] === group[1] || group[1] === group[2]) {
            tripletCount += 1;
            groups.push(group);
        } else if (isSequence(group)) {
            const sequenceKey = group[0];
            sequenceCounts[sequenceKey] = (sequenceCounts[sequenceKey] || 0) + 1;
        }
    }

    for (let sequence in sequenceCounts) {
        if (sequenceCounts[sequence] >= 3) { //暗三般高
            tripletCount += 3;
            sequence = Number(sequence);
            groups.push([sequence, sequence, sequence]);
            groups.push([sequence + 1, sequence + 1, sequence + 1]);
            groups.push([sequence + 2, sequence + 2, sequence + 2]);
        }
    }

    if (tripletCount === 2) {
        addResult(resultDict, "二暗刻", groups);
    } else if (tripletCount === 3) {
        addResult(resultDict, "三暗刻", groups);
    } else if (tripletCount === 4) {
        addResult(resultDict, "四暗刻", groups);
    } else if (tripletCount === 5) {
        addResult(resultDict, "五暗刻", groups);
    } //TODO 間間糊
}

 // 對對糊 //TODO use groups instead of handCount
export function isAllTriplets(fullHandCount, resultDict) {
    let pairCount = 0;
    let tripletCount = 0;
    for (const tile in fullHandCount) {
        const count = fullHandCount[tile];
        if (count === 2) {
            pairCount += 1;
        } else if (count === 3 || count === 4) {
            tripletCount += 1;
        } else {
            return false;
        }
    }

    if (pairCount === 1 && tripletCount === (Object.keys(fullHandCount).length - 1)) {
        addResult(resultDict, "對對胡");
        return true;
    } else {
        return false;
    }
}


function isAllTerminals(fullHand) {
    return fullHand.every(tile => {
        const remainder = tile % 10;
        return remainder === 1 || remainder === 9 || (tile >= 1 && tile <= 7);
    });
}





