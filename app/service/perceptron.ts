// 0: rock, 1: scissors, 2: paper

const N = 1000;

const v = [0, 0, 0];
const x = Array(3 * N).fill(0);
const w = Array(9 * N).fill(0);

/**
 *  Receive the opponent's hand and update the weight.
 */
export function perceptron(m: number) {
  let i, j, k;
  const prec = [-1, -1, -1];
  prec[m] = 1;

  for (k = 0; k < 3; k++) {
    if (prec[k] * v[k] <= 0) {
      for (j = 0; j < 3 * N + 1; j++) {
        w[(3 * N + 1) * k + j] += prec[k] * x[j];
      }
    }
  }

  for (i = 0; i < 3 * N - 3; i++) {
    x[3 * N - 1 - i] = x[3 * N - 4 - i];
  }

  for (i = 0; i < 3; i++) {
    x[i] = prec[i];
  }

  for (k = 0; k < 3; k++) {
    v[k] = 0;
    for (j = 0; j < 3 * N + 1; j++) {
      v[k] += w[(3 * N + 1) * k + j] * x[j];
    }
  }
}

/**
 *  Predict the next opponent's hand.
 */
export function predict() {
  let k, kMax, vMax;
  vMax = v[0];
  kMax = 0;
  for (k = 1; k < 3; k++) {
    if (v[k] >= vMax) {
      vMax = v[k];
      kMax = k;
    }
  }
  return kMax;
}
