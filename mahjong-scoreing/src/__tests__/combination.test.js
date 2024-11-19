import { 
    allSequence,
} from '../utils/combination';

import { 
    isSequence, 
    getHandCount
} from '../utils/commonUtils';

test('平糊', () => {
    const closedGroups = [
        [102, 102], 
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const openGroups = [
        [301, 302, 303],
        [201, 202, 203],
    ];
    
    expect(allSequence(closedGroups, openGroups)).toBe(true);
});

test('平糊 false with triplet', () => {
    const closedGroups = [
        [102, 102], 
        [101, 102, 103], 
        [101, 102, 103], 
        [101, 102, 103], 
    ];
    const openGroups = [
        [203, 203, 303],
        [201, 202, 203],
    ];
    
    expect(allSequence(closedGroups, openGroups)).toBe(false);
});