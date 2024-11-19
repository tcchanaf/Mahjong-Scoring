// 雜色
import { getHandCount,isTriplet, isSequence } from '../utils/commonUtils';
import { patterns } from '../utils/constant';

// 兄弟
export function hingDai(closedGroups, openGroups, results) {
    const allHandGroups = [...closedGroups, ...openGroups].filter(group => isTriplet(group));
    const allHandGroupsCount = getHandCount(allHandGroups);
    
}