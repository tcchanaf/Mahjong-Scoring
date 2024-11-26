// 字類
import { tiles } from "./constant"
import { addResult } from './commonUtils'


// 番子 東南西北 中發白 無字
export function honorTile(fullHandCount, wind, seat, resultDict) {
    let honorTiles;
    if ("小三風" in resultDict || "大三風" in resultDict || "小四喜" in resultDict || "大四喜" in resultDict) {
        honorTiles = tiles["dragons"]; //avoid double count 
    } else if ("小三元" in resultDict || "大三元" in resultDict) {
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
        addResult(resultDict, "番子", [], faanCount);
    } else if (faanCount === 0 && honorTiles.length === 7) {
        addResult(resultDict, "無字");
    }
}

//大四喜, 小四喜, 大三風, 小三風
export function fourHappiness(fullHandCount, resultDict) {
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
        addResult(resultDict, "大四喜");
    } else if (tripletCount === 3 && pairCount === 1) {
        addResult(resultDict, "小四喜");
    } else if (tripletCount === 3) {
        addResult(resultDict, "大三風");
    } else if (tripletCount === 2 && pairCount === 1) {
        addResult(resultDict, "小三風");
    }

    return tripletCount >= 3 || (tripletCount >= 2 && pairCount === 1);
}


// 大小三元	
export function threeChiefs(fullHandCount, resultDict) {
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
        addResult(resultDict, "大三元");
    } else if (tripletCount === 2 && pairCount === 1) {
        addResult(resultDict, "小三元");
    }

    return tripletCount === 3 || (tripletCount === 2 && pairCount === 1);
}