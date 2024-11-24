import { patterns } from '../utils/constant';
import { getHandCount, splitToGroups, isWin, isSequence, addResult, toResultList } from '../utils/commonUtils';
import { thirteenOrphans, sixteenNotMatch, sevenPairs } from '../utils/special';
import { 
    isPureStraight, isMixedStraight
} from '../utils/flush';
import { allClosedHand, pair } from "../utils/wining";
import { 
    threeChiefs, honorTile, fourHappiness
} from '../utils/honor';
import { flowerFaan, noFlowerNoHonor, noFlowerNoHonorAllSequence } from '../utils/flower';
import { specialButtons } from '../utils/constant';
import { allSequence } from '../utils/combination';


export function calculateScore(openHand, closedHand, flowers, wind, seat, specialFaans) {
    let fanCount = 0;
    let resultDict = []; //format: {faanName: [["faanName", faan count, [related tiles],[...]], faanName2: []...}

    handleSpecialFaan(specialFaans, resultDict);

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];
    fullHand.sort((a, b) => a - b);

    const fullHandCount = getHandCount(fullHand);
    const closedHandCount = getHandCount(closedHand);
    const openHandCount = getHandCount(openHand);
    fanCount += 5;

    const [closedGroups, openGroups, pairGroup] = splitToGroups(closedHandCount, openHandCount);



    const isNormalWu = isWin(closedGroups, openGroups);
    if (thirteenOrphans(closedHandCount, resultDict)) {  // 十三么
        addResult("十三么", []);
    }
    else if (sixteenNotMatch(closedHandCount, resultDict)) {// 十六不搭
        results.push(["十六不搭", 40, []]);
    }
    else if (sevenPairs(closedHandCount, resultDict)){ // 嚦咕嚦咕
        results.push(["嚦咕嚦咕", 40, []]);
    } 
    else if (!isNormalWu) {
        return [
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十三么", 100, [1, 3, 5, 7, 11,  13, 15, 101, 109, 201, 209, 301, 309]],
            ["十六么", 100, []],
            ["十六么", 100, []],
        ];
        // return [0, []];
    }

    allClosedHand(openHand, resultDict); //門清
    

    if (isPureStraight(fullHand)) fanCount += 80; // 清一色
    else if (isMixedStraight(fullHand)) fanCount += 30; // 混一色

    if (isAllTriplets(fullHandCount)) fanCount += 30; // 對對糊
    allSequence(closedGroups, openGroups, resultDict); //平胡

    // if (isAllHonors(fullHand)) fanCount += 10; // 字一色
    threeChiefs(fullHandCount, resultDict); // 大小三元
    fourHappiness(fullHandCount, resultDict); // //大四喜, 小四喜, 大三風, 小三風
    flowerFaan(flowers, seat, resultDict); // 花
    honorTile(fullHandCount, wind, seat, resultDict); // 番子
    noFlowerNoHonor(resultDict);  //無字花
    noFlowerNoHonorAllSequence(resultDict); //無字花大平胡

    pair(pairGroup, resultDict); //將眼


    if (isAllTerminals(fullHand)) fanCount += 13; // 清么九

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
    addResult(resultDict, "叮");
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





