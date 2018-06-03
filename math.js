exports.fibonacci = (n) => {
  let fibos = [];
  let fiboval = 0;
  fibos[0] = 0;
  fibos[1] = 1;
  fibos[2] = 1;
  if (n < 3) {
    fiboval = fibos[n];
  }
  for (let i = 3; i <= n; i++) {
    fiboval = fibos[1] + fibos[2];
    fibos[2] = fibos[1];
    fibos[1] = fiboval;
  }
  return fiboval;
};