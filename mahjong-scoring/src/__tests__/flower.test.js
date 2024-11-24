import { 
    flowerFaan, noFlowerNoHonor, noFlowerNoHonorAllSequence
} from '../utils/flower';
import { patterns } from "../utils/constant"
import { getHandCount, splitToGroups, isWin, isSequence, toResultList } from '../utils/commonUtils';

test('有花', () => {
    const flowers = [
        21, 23, 25, 27, 31, 33, 35, 37
    ];
    const resultDict = {};
    const seat = 1;
    flowerFaan(flowers, seat, resultDict);
    const resultList = toResultList(resultDict);
    expect(resultList[0][1]).toBe(10);
});

test('正花', () => {
    const flowers = [
        23, 33
    ];
    const resultDict = {};
    const seat = 3;
    flowerFaan(flowers, seat, resultDict);
    const resultList = toResultList(resultDict);
    expect(resultList[0][1]).toBe(4);
});

test('爛花', () => {
    const flowers = [
        21, 31
    ];
    const resultDict = {};
    const seat = 3;
    flowerFaan(flowers, seat, resultDict);
    const resultList = toResultList(resultDict);
    expect(resultList[0][1]).toBe(2);
});

test('無花', () => {
    const flowers = [];
    const resultDict = {};
    const seat = 1;
    flowerFaan(flowers, seat, resultDict);
    const resultList = toResultList(resultDict);
    expect(resultList[0][1]).toBe(1);
    expect("無花" in resultDict).toBe(true);
});

test('無字花', () => {
    const flowers = [];
    const resultDict = {"無花": [], "無字": []};
    noFlowerNoHonor(resultDict);
    expect("無字花" in resultDict).toBe(true);
    expect("無花" in resultDict).toBe(false);
    expect("無字" in resultDict).toBe(false);
});

test('無字花大平胡', () => {
    const flowers = [];
    const resultDict = {"無字花": [], "平胡": []};
    noFlowerNoHonorAllSequence(resultDict);
    expect("無字花大平胡" in resultDict).toBe(true);
    expect("無花" in resultDict).toBe(false);
    expect("無字" in resultDict).toBe(false);
    expect("無字花" in resultDict).toBe(false);
});