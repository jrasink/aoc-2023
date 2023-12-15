const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const parseInput = (s) => {
  const seqStrings = s.split('\n');
  const seqs = seqStrings.map((s) => s.split(' ').map((s) => parseInt(s, 10)));
  return seqs;
}

const binomialMemory = [];

const binomial = (n, k) => {
  if (!(n in binomialMemory)) {
    binomialMemory[n] = [];
  }

  if (!(k in binomialMemory[n])) {
    if (k == n || k == 0) {
      binomialMemory[n][k] = 1;
    } else {
      binomialMemory[n][k] = binomial(n - 1, k - 1) + binomial(n - 1, k);
    }
  }

  return binomialMemory[n][k];
}

const calculateDseqAtIndex = (seq, d, n) => {
  if (d > n) {
    return 0;
  }

  let r = 0;

  for (let i = 0, m = d + 1; i < m; i++) {
    const b = binomial(d, i);
    const s = Math.pow(-1, i % 2);
    r += (s * b * seq[n - i]);
  }

  return r;
}

const calculateDseq = (seq, d) => {
  const dseq = [];
  for (let i = 0; i < seq.length; i++) {
    dseq.push(calculateDseqAtIndex(seq, d, i));
  }
  return dseq;
}

const findDepth = (seq) => {
  for (let d=0;;d++) {
    const dseq = calculateDseq(seq, d);
    if (dseq.reduce((b, n) => b && (n === 0), true)) {
      return d;
    }
  }
}

const sequenceIndex = ({ seq, d }, n) => {
  // console.log(`finding seq [${seq.join(',')}] pos ${n}; depth is ${d}`);

  if (n >= 0) {
    // console.log(`finding seq [${seq.join(',')}] pos ${n}; depth is ${d} --> pos is known, ${seq[n]}`);
    return seq[n];
  }

  let r = 0;

  for (let i = 1, m = d; i <= m; i++) {
    const b = binomial(d, i);
    const s = - Math.pow(-1, i % 2);
    const p = sequenceIndex({ seq, d }, n + i);
    r += (s * b * p);
  }

  // console.log(`finding seq [${seq.join(',')}] pos ${n}; depth is ${d} --> pos is calculated, ${r}`);

  return r;
}

// we can expand the sequence and derived sequences like so:
// a[n] = a[n]
// b[n] = a[n] - a[n-1]
// c[n] = b[n] - b[n-1] = a[n] - 2 * a[n-1] + a[n-2]
// d[n] = c[n] - c[n-1] = (a[n] - 2 * a[n-1] + a[n-2]) - (a[n-1] - 2 * a[n-2] + a[n-3]) = a[n] - 3 * a[n-1] + 3 * a[n-2] - a[n-3]

// this means we can extrapolate the sequence like so:
// a[n] = a[n-1] + b[n]
//      = a[n-1] + b[n-1] + c[n]
//      = a[n-1] + b[n-1] + c[n-1] + ...

// given that from depth d all terms are zero, we can drop them; for example, at depth 3 we have:
// a[n] = a[n-1] + b[n-1] + c[n-1]
//      = 3 * a[n-1] - 3 * a[n-2] + a[n-3]

// or,
// a[n] - 3 * a[n-1] + 3 * a[n-2] - a[n-3] = 0

// so we solve part 2 using:
// a[n-3] = 3 * a[n-2] - 3 * a[n-1] + a[n]

// NOTE: in the general case, the coefficients are binominal and the sign is a power of -1.

const xs = parseInput(input).map((seq) => ({ seq, d: findDepth(seq) }));

const ys = xs.map((x) => sequenceIndex(x, -1));

const n = ys.reduce((a, b) => a + b);

console.log(n);

// 1022
