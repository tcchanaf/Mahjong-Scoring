import { patterns, patternOrder } from "./constant"

// 十三么，十六不搭
export function isContainSpecialPattern(handCounts, requiredTiles) {    
    for (let tile in requiredTiles) {
        if (!handCounts[tile] || handCounts[tile] < requiredTiles[tile]) {
          return false;
        }
      }

    return true;
}

// call only tiles.length is 3
export function isSequence(tiles) {
    if (tiles.length !== 3) return false;
    return tiles[0] + 1 === tiles[1] && tiles[1] + 1 === tiles[2];
}

// call only tiles.length is 3
export function isTriplet(tiles) {
    if (tiles.length !== 3) return false;
    return tiles[0] === tiles[1] && tiles[1] === tiles[2];
}

export function getHandCount(handTiles) {
    const handCount = {};
    for (const tile of handTiles) {
        handCount[tile] = (handCount[tile] || 0) + 1;
    }

    return handCount;
}

export function fromHandCountToList(handCount) {
    const handList = [];
    for (const tile in handCount) {
        const count = handCount[tile];
        for (let i = 0; i < count; i++) {
            handList.push(Number(tile));
        }
    }
    return handList;
}


//TODO openGroup split by order, split prioirity (tripket > sequence)
export function splitToGroups(closedHandCount, openHandCount) {
    const closedGroups = [];
    const openGroups = [];
    const pairGroup = [];
    let tmpClosedHandCount = {...closedHandCount}
    splitHelper(openHandCount, openGroups); //open Hand

    //closed Hand prioritising sequence
    for (let tile in tmpClosedHandCount) {
        tile = Number(tile);
        if (tmpClosedHandCount[tile] > 1) { // find the pair first
            if (tmpClosedHandCount[tile] === 2) {
                delete tmpClosedHandCount[tile];
            } else {
                tmpClosedHandCount[tile] -= 2;
            }
            if (splitHelper(tmpClosedHandCount, closedGroups)) {
                pairGroup.push([tile, tile])
                break;   
            }
                tmpClosedHandCount[tile] = (tmpClosedHandCount[tile] || 0) + 2;
        }
    }

    return [closedGroups, openGroups, pairGroup];
}

export function isWin(closedGroups, openGroups) {
    let fullGroups = [...openGroups, ...closedGroups];

    return fullGroups.length === 5;
}

function splitHelper(handCount, groups) {
    if (Object.keys(handCount).length === 0) {
        return true;
    }

    for (let tile in handCount) {
        tile = Number(tile);
        if ((tile + 1) in handCount && (tile + 2) in handCount) {
            // if this is the sequence tile
            for (let i = 0; i < 3; i++) {  // remove the sequence tiles
                if (handCount[tile + i] === 1) {
                    delete handCount[tile + i];
                } else {
                    handCount[tile + i] -= 1;
                }
            }

            if (splitHelper(handCount, groups)) {
                groups.push([tile, tile + 1, tile + 2]);
                return true;
            } else {
                for (let i = 0; i < 3; i++) {  // add the sequence tiles back
                    handCount[tile + i] = (handCount[tile + i] || 0) + 1;
                }
            }
        }

        if (handCount[tile] >= 3) {
            // assume quadruplet
            if (handCount[tile] === 4) {
                delete handCount[tile];
                if (splitHelper(handCount, groups)) {
                    groups.push([tile, tile, tile, tile]);
                    return true;
                } else {
                    handCount[tile] = 4;
                }
            }

            // if this is the triplet tile
            if (handCount[tile] === 3) {
                delete handCount[tile];
            } else {
                handCount[tile] -= 3;
            }
            if (splitHelper(handCount, groups)) {
                groups.push([tile, tile, tile]);
                return true;
            } else {
                handCount[tile] = (handCount[tile] || 0) + 3;
                return false;
            }
        }
        
        // If no valid set can be formed, return false
        return false;
    }

    return false;
}


export function addResult(resultDict, faanItem, relatedTiles, faanCount) {
    if (!relatedTiles) relatedTiles = [];
    if (!faanCount) faanCount = getFaanCount(faanItem);

    if (faanItem in patterns) {
        if (!(faanItem in resultDict)) {
            resultDict[faanItem] = [];
        }
        resultDict[faanItem].push([faanItem, faanCount, relatedTiles]);
    }
}

export function toResultList(resultDict) {
    const resultList = [];

    for ( const [patternName, _] of patternOrder){
        if (patternName in resultDict) {
            const results = resultDict[patternName];
            results.forEach(([patternName, count, relatedTiles]) => {
                resultList.push([patternName, count, relatedTiles]);
            });
        }
    };

    return resultList;
}


function getFaanCount(faanItem) {
    return patterns[faanItem];
}