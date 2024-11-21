import { patterns } from '../utils/constant';
import { getHandCount, splitToGroups, isWin, isSequence } from '../utils/commonUtils';
import { thirteenOrphans, sixteenNotMatch, sevenPairs } from '../utils/special';
import { 
    isPureStraight,
    isMixedStraight
} from '../utils/flush';
import { allClosedHand, pair } from "../utils/wining";
import { 
    allSequence,
} from '../utils/combination';
import { 
    threeChiefs,
    honorTile,
    fourHappiness
} from '../utils/honor';


export function calculateScore(openHand, closedHand, flowers, wind, seat) {
    let fanCount = 0;
    let results = []; //format: [["faan name", faan count, [related tiles], ...]

    // Combine open and closed hands for total hand evaluation
    const fullHand = [...openHand, ...closedHand];
    fullHand.sort((a, b) => a - b);

    const fullHandCount = getHandCount(fullHand);
    const closedHandCount = getHandCount(closedHand);
    const openHandCount = getHandCount(openHand);
    fanCount += 5;

    const [closedGroups, openGroups, pairGroup] = splitToGroups(closedHandCount, openHandCount);

    const isNormalWu = isWin(closedGroups, openGroups);
    let isThirteenOrphans = false;
    let isSixteenNotMatch = false;
    let isSevenPairs = false;
    if (thirteenOrphans(closedHandCount, results)) {  // 十三么
        fanCount += 100;
        isThirteenOrphans = true;
        results.push(["十三么", 100, [1, 3, 5]]);
        results.push(["十六么", 100, [11, 13, 15]]);
    }
    else if (sixteenNotMatch(closedHandCount, results)) {// 十六不搭
        fanCount += 40; 
        isSixteenNotMatch = true;
        results.push(["十六不搭", 40, []]);
    }
    else if (sevenPairs(closedHandCount, results)){ // 嚦咕嚦咕
        fanCount += 40;
        isSevenPairs = true;
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

    if (isNormalWu) {
        allClosedHand(openHand, results);
    }

    if (isPureStraight(fullHand)) fanCount += 80; // 清一色
    else if (isMixedStraight(fullHand)) fanCount += 30; // 混一色

    if (isAllTriplets(fullHandCount)) fanCount += 30; // 對對糊

    // if (isAllHonors(fullHand)) fanCount += 10; // 字一色
    const isThreeChiefs = threeChiefs(fullHandCount, results); // 大小三元
    const isFourHappiness = fourHappiness(fullHandCount, results); // //大四喜, 小四喜, 大三風, 小三風
    honorTile(fullHandCount, isThreeChiefs, isFourHappiness, wind, seat, results);
    

    if (isAllTerminals(fullHand)) fanCount += 13; // 清么九

    
    // Add more scoring rules here

    return [fanCount, results];
}


// 暗刻
export function closedTriplets(closedGroups, results) {
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
        results.push(["二暗刻", 3, groups])
    } else if (tripletCount === 3) {
        results.push(["三暗刻", 10, groups])
    } else if (tripletCount === 4) {
        results.push(["四暗刻", 30, groups])
    } else if (tripletCount === 5) {
        results.push(["五暗刻", 80, groups])
    } //TODO 間間糊
}


export function isAllTriplets(fullHandCount) { // 對對糊
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

    return pairCount === 1 && tripletCount === (Object.keys(fullHandCount).length - 1);
}


function isAllTerminals(fullHand) {
    return fullHand.every(tile => {
        const remainder = tile % 10;
        return remainder === 1 || remainder === 9 || (tile >= 1 && tile <= 7);
    });
}





