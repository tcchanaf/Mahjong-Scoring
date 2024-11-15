import { 
    splitToGroups, 
    getHandCount
} from '../utils/scoring'; // Adjust the path to where your utility functions are located

describe('Mahjong Hand Validations', () => {

    it('should correctly split a hand into groups for both closed and open hands', () => {
        const closedHandCount = [301, 302, 303, 101, 102, 103, 101, 102, 103, 201, 201, 201, 204, 204]; // closed hand list
        const openHandCount = [301, 301, 301]; // open hand list (triplet)
        
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
                [301, 302, 303],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201],
                [204, 204]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });

    it('handle an empty hand', () => {
        const closedHandCount = []; 
        const openHandCount = []; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        expect(new Set(closedGroups)).toEqual(
            new Set([
            ]));
        expect(openGroups).toEqual([]);
    });

    it('handle an triplet hand, prioritizing sequence', () => {
        const closedHandCount = [101, 101, 101, 102, 102, 102, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 102, 103],
                [101, 102, 103],
                [101, 102, 103],
                [201, 201, 201],
                [1, 1]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });

    it('handle an triplet hand', () => {
        const closedHandCount = [101, 101, 101, 105, 105, 105, 103, 103, 103, 201, 201, 201, 1, 1]; 
        const openHandCount = [301, 301, 301]; 
        const [closedGroups, openGroups] = splitToGroups(getHandCount(closedHandCount), getHandCount(openHandCount));

        // Check the result of closed and open hand groups
        expect(new Set(closedGroups)).toEqual(
            new Set([
                [101, 101, 101],
                [105, 105, 105],
                [103, 103, 103],
                [201, 201, 201],
                [1, 1]
            ]));
        expect(openGroups).toEqual([[301, 301, 301]]);
    });
});