export const calculateScore = (hand) => {
    // 假設 hand 是一個牌型的數組
    let score = 0;
  
    // 這裏你可以編寫計算番數的邏輯，例如
    if (isSevenPairs(hand)) {
      score += 2;  // 假設七對是 2 番
    }
  
    if (isPureStraight(hand)) {
      score += 3;  // 假設清一色是 3 番
    }
  
    // 其他番型規則
  
    return score;
  };
  
  const isSevenPairs = (hand) => {
    // 判斷是否為七對
    // 如果 hand 符合七對的條件，返回 true
    return false; // 這是示範，具體邏輯需要根據手牌來實現
  };
  
  const isPureStraight = (hand) => {
    // 判斷是否為清一色
    return false; // 這是示範，具體邏輯需要根據手牌來實現
  };
  