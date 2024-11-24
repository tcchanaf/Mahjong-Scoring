//花
import { addResult } from '../utils/commonUtils';

// 花 無花 正花 //TODO
export function flowerFaan(flowers, seat, resultDict) {
    let faanCount = 0
    const groups = [];
    for (const flower of flowers) {
        faanCount += 1;
        groups.push(flower);
        if (flower % 10 === seat) {
            faanCount += 1;
        }
    }
    if (faanCount > 0) {
        addResult(resultDict, "花", groups, faanCount);
    } else {
        addResult(resultDict, "無花", [], faanCount);
    }
}

// 無字花
export function noFlowerNoHonor(resultDict) {
    if ("無花" in resultDict && "無字" in resultDict) {
        delete resultDict["無花"];
        delete resultDict["無字"];
        addResult(resultDict, "無字花");
    }
}

export function noFlowerNoHonorAllSequence(resultDict) {
    if ("無字花" in resultDict && "平胡" in resultDict) {
        delete resultDict["無字花"];
        delete resultDict["平胡"];
        addResult(resultDict, "無字花大平胡");
    }
}