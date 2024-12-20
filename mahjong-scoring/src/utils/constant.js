export const tileMapping = {
    101: '1筒', 102: '2筒', 103: '3筒', 104: '4筒', 105: '5筒', 106: '6筒', 107: '7筒', 108: '8筒', 109: '9筒',
    201: '1條', 202: '2條', 203: '3條', 204: '4條', 205: '5條', 206: '6條', 207: '7條', 208: '8條', 209: '9條',
    301: '1萬', 302: '2萬', 303: '3萬', 304: '4萬', 305: '5萬', 306: '6萬', 307: '7萬', 308: '8萬', 309: '9萬',
    1: '東', 3: '南', 5: '西', 7: '北',
    11: '中', 13: '發', 15: '白',
    21: '春', 23: '夏', 25: '秋', 27: '冬',
    31: '梅', 33: '蘭', 35: '菊', 37: '竹',
};


export const tiles = {
    tungzi: [101, 102, 103, 104, 105, 106, 107, 108, 109],  // 筒子: 1筒 to 9筒
    sokzi: [201, 202, 203, 204, 205, 206, 207, 208, 209],  // 條: 1條 to 9條
    maanzi: [301, 302, 303, 304, 305, 306, 307, 308, 309],  // 萬子: 1萬 to 9萬
    faanzi: [1, 3, 5, 7, 11, 13, 15],  // 番子: 東, 南, 西, 北, 中, 發, 白
    winds: [1, 3, 5, 7], //東風, 南風, 西風, 北風
    dragons: [11, 13, 15], //中, 發, 白
    flowers: [21, 23, 25, 27, 31, 33, 35, 37]// 花: 春, 夏, 秋, 冬
};


export const patternOrder = [
    ["底", 5], ["叮", 5], ["即食", 5],
    ["十三么", 80], ["十六不搭", 40], ["嚦咕嚦咕", 40],
    ["混一色", 30], ["清一色", 80], ["對對胡", 30], ["字一色", 80],
    ["小三元", 20], ["大三元", 40], 
    ["小三風", 15], ["大三風", 30], ["小四喜", 60], ["大四喜", 80], 
    ["無花", 1], ["花", 2],  ["正花", 2], ["爛花", 1],
    ["番子", 1],   ["無字", 1], ["雞胡", 10],
    ["無字花", 5], ["無字花大平胡", 10], ["門清", 3],
    ["對碰", 1],   ["假獨", 1], ["獨獨", 2],
    ["平胡", 3],   ["將眼", 1], ["老少", 2],
    ["海底撈月", 20],["自摸", 1], ["門清自摸", 5],
    ["全求人", 15], ["半求人", 8],
    ["花上食胡", 1], ["摃上食胡", 1], ["搶摃食胡", 1], ["摃上摃食胡", 30], ["搶摃上摃食胡", 30],
    ["十只內", 10], ["七只內", 20], 
    ["明摃", 1], ["暗摃", 2],   
    ["二暗刻", 3], ["三暗刻", 10], ["四暗刻", 30], ["五暗刻", 80], ["間間胡", 100],
    ["一般高", 3], ["三般高", 15], ["四般高", 30],
    ["二相逢", 2], ["三相逢", 10], ["四同順", 20], ["五同順", 40],
    ["小三姊妹", 8], ["大三姊妹", 15],
    ["二兄弟", 3], ["小三兄弟", 10], ["大三兄弟", 15],
    ["明清龍", 10], ["暗清龍", 20], ["明雜龍", 8], ["暗雜龍", 15],
    ["五門齊", 10], ["七門齊", 15], ["缺一門", 5],
    ["四歸一", 5], ["四歸二", 10], ["四歸四", 20],
    ["斷么", 5], ["全帶混么", 10], ["全帶么", 15], ["混么", 30], ["清么", 80],
    ["天胡", 100], ["地胡", 80], ["人胡", 80],
  ];

  export const patterns = patternOrder.reduce((acc, [name, value]) => {
    acc[name] = value;
    return acc;
}, {});
export const specialButtons = [
    "自摸", "天胡", "地胡", "人胡", "摃上食胡", "摃上摃食胡",
    "花上食胡", "搶摃食胡", "十只內", "七只內", "叮", "即食",
];