function insertNumber(num, arr) {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] < num) left = mid + 1;
    else right = mid - 1;
  }
  arr.splice(left, 0, num);
}

function isValid(num, arr) {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (Math.abs(arr[mid] - num) < 5) return false;
    if (arr[mid] < num) left = mid + 1;
    else right = mid - 1;
  }
  return true;
}

const getLegData = (items) => {
  let result = [];
  return items.slice(0, items.length - 1).map((item, index) => {
    return Array.from(Array(index % 2 ? 2 : 3), (_, i) => {
      const random = Math.floor(Math.random() * 160) + 10;
      const legValid = (leg) => {
        // 랜덤 수가 중복이거나 다리의 간격이 10이하면 새로운 랜덤 생성
        if (!isValid(leg, result))
          return legValid(Math.floor(Math.random() * 160) + 10);
        else {
          insertNumber(leg, result);
          return leg;
        }
      };
      const value = legValid(random);

      return {
        from: index,
        to: index + 1,
        value: value,
      };
    });
  });
};

export default getLegData;
