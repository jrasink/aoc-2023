const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const CELLS = {
  empty: '.',
  mirrorLeft: '/',
  mirrorRight: '\\',
  splitterVertical: '|',
  splitterHorizontal: '-'
};

const DIRECTIONS = {
  N: 'N',
  E: 'E',
  S: 'S',
  W: 'W'
};

const map = input.split('\n').map((s) => s.split(''));
const height = map.length;
const width = map[0].length;

const range = (n) => [...Array(n)].map((_, i) => i);

const draw = (map) => map.map((s) => s.join('')).join('\n');

const step = (pos, dir) => {
  const [x, y] = pos;

  if (dir === DIRECTIONS.N) {
    const w = y - 1;
    if (w < 0) {
      return null;
    }
    return [x, w];
  }

  if (dir === DIRECTIONS.S) {
    const w = y + 1;
    if (w >= height) {
      return null;
    }
    return [x, w];
  }

  if (dir === DIRECTIONS.E) {
    const v = x + 1;
    if (v >= width) {
      return null;
    }
    return [v, y];
  }

  if (dir === DIRECTIONS.W) {
    const v = x - 1;
    if (v < 0) {
      return null;
    }
    return [v, y];
  }

  throw `not a direction: '${dir}'`;
};

const next = (passMap, pos, dir) => {
  const [x, y] = pos;
  const cell = map[y][x];

  const ds = [];

  if (cell === CELLS.empty) {
    ds.push(dir);
  }

  if (cell === CELLS.mirrorLeft) {
    if (dir === DIRECTIONS.N) {
      ds.push(DIRECTIONS.E);
    }

    if (dir === DIRECTIONS.E) {
      ds.push(DIRECTIONS.N);
    }

    if (dir === DIRECTIONS.S) {
      ds.push(DIRECTIONS.W);
    }

    if (dir === DIRECTIONS.W) {
      ds.push(DIRECTIONS.S);
    }
  }

  if (cell === CELLS.mirrorRight) {
    if (dir === DIRECTIONS.N) {
      ds.push(DIRECTIONS.W);
    }

    if (dir === DIRECTIONS.W) {
      ds.push(DIRECTIONS.N);
    }

    if (dir === DIRECTIONS.S) {
      ds.push(DIRECTIONS.E);
    }

    if (dir === DIRECTIONS.E) {
      ds.push(DIRECTIONS.S);
    }
  }

  if (cell === CELLS.splitterVertical) {
    if ([DIRECTIONS.E, DIRECTIONS.W].includes(dir)) {
      ds.push(DIRECTIONS.N);
      ds.push(DIRECTIONS.S);
    } else {
      ds.push(dir);
    }
  }

  if (cell === CELLS.splitterHorizontal) {
    if ([DIRECTIONS.N, DIRECTIONS.S].includes(dir)) {
      ds.push(DIRECTIONS.E);
      ds.push(DIRECTIONS.W);
    } else {
      ds.push(dir);
    }
  }

  return ds.reduce((xs, d) => {
    const p = step(pos, d);
    if (p !== null) {
      return [...xs, { pos: p, dir: d }];
    }
    return xs;
  }, []).filter(({ pos: [x, y], dir }) => {
    return passMap[y][x][dir] === false
  });
}

const walk = (passMap, pos, dir) => {
  const [x, y] = pos;
  passMap[y][x][dir] = true;
  const ns = next(passMap, pos, dir);
  for (const { pos, dir } of ns) {
    walk(passMap, pos, dir);
  }
}

// console.log(draw(map));

// const foo = [{ pos: [3, 0], dir: DIRECTIONS.S }];

const foo = [];

for (let x = 0; x < width; x++) {
  foo.push({ pos: [x, 0], dir: DIRECTIONS.S });
  foo.push({ pos: [x, height - 1], dir: DIRECTIONS.N });
}

for (let y = 0; y < height; y++) {
  foo.push({ pos: [0, y], dir: DIRECTIONS.E });
  foo.push({ pos: [width - 1, y], dir: DIRECTIONS.W });
}

const bar = foo.map(({ pos, dir }) => {
  const passMap = range(height).map(() => range(width).map(() => {
    return Object.values(DIRECTIONS).reduce((o, k) => ({ ...o, [k]: false }), {});
  }));

  walk(passMap, pos, dir);

  const passed = (o) => Object.values(DIRECTIONS).reduce((b, k) => b || o[k], false);
  const energized = passMap.map((row) => row.map(passed));

  // console.log(draw(energized.map((row) => row.map((b) => b ? '#' : '.'))));

  const count = energized.map((row) => row.reduce((n, b) => b ? n + 1 : n, 0)).reduce((a, b) => a + b);

  return count;
})

const n = bar.reduce((a, b) => a < b ? b : a);

console.log(n);

// 8185
