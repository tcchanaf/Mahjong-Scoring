// 字類
import { tiles } from "./constant"

//無字 TODO Test case
export function noHonorTile(fullHandCount,  results) {
    let honorTiles = tiles["faanzi"]; //東南西北 中發白

    honorTiles.forEach(tile => {
        if (fullHandCount[tile] > 0) {
            return false;
        }
    });

    return true;
}


// 番子 東南西北 中發白 
// TODO test case
export function honorTile(fullHandCount, threeChiefs, fourHappiness, wind, seat, results) {
    let honorTiles;
    if (fourHappiness) {
        honorTiles = tiles["dragons"]; //avoid double count 
    } else if (threeChiefs) {
        honorTiles = tiles["winds"]; //avoid double count 
    } else {
        honorTiles = tiles["faanzi"]; //東南西北 中發白
    }
    let faanCount = 0;

    honorTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            faanCount += 1;
            if (tile > 10) {  //中發白 2番
                faanCount += 1;
            }
            if (tile === wind) {
                faanCount += 1;
            }
            if (tile === seat) {
                faanCount += 1;
            }
        }
    });

    if (faanCount > 0) {
        results.push(["番子", faanCount, []]);
    }
}

//大四喜, 小四喜, 大三風, 小三風
// TODO test case
export function fourHappiness(fullHandCount, results) {
    const windTiles = [1, 3, 5, 7]; //東南西北
    let tripletCount = 0;
    let pairCount = 0;
    windTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            tripletCount++;
        } else if (fullHandCount[tile] === 2) {
            pairCount++;
        }
    });

    if (tripletCount === 4) {
        results.push(["大四喜", 80, []]);
    } else if (tripletCount === 3 && pairCount === 1) {
        results.push(["小四喜", 60, []]);
    } else if (tripletCount === 3) {
        results.push(["大三風", 30, []]);
    } else if (tripletCount === 2 && pairCount === 1) {
        results.push(["小三風", 15, []]);
    }

    return tripletCount >= 3 || (tripletCount >= 2 && pairCount === 1);
}


export function threeChiefs(fullHandCount, results) {// 大小三元	
    const dragonTiles = tiles["dragons"]; //中, 發, 白
    
    let tripletCount = 0;
    let pairCount = 0;
    dragonTiles.forEach(tile => {
        if (fullHandCount[tile] >= 3) {
            tripletCount++;
        } else if (fullHandCount[tile] === 2) {
            pairCount++;
        }
    });

    if (tripletCount === 3) {
        results.push(["大三元", 40, []]);
    } else if (tripletCount === 2 && pairCount === 1) {
        results.push(["小三元", 20, []]);
    }

    return tripletCount === 3 || (tripletCount === 2 && pairCount === 1);
}