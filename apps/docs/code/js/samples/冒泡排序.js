//从小到大
const arr = [1, 2, 5, 81, 4, 52, 56, 62, 5];
for (let i = 0; i, arr.length; i++) {
  let flag = true;
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      const temp = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = temp;
      flag = false;
    }
  }
  if (flag) {
    break;
  }
}
console.log(arr);
