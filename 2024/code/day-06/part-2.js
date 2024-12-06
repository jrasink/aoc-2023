export default (input) => {
  const C = {
    free: '.',
    obstacle: '#'
  };

  const D = {
    n: '^',
    s: 'v',
    e: '>',
    w: '<'
  };

  const rows = input.split('\n').length;
  const cols = input.split('\n').shift().length;
  const value = ({ x, y }) => rows * y + x;
  const isInside = ({ x, y }) => y >= 0 && y < rows && x >= 0 && x < cols;

  const blocked = input.split('\n').reduce((blocked, s, y) => s.split('').reduce((blocked, s, x) => s === C.obstacle ? [...blocked, value({ x, y })] : blocked, blocked), []);
  const isBlocked = (bs, p) => bs.includes(value(p))

  const start = input.split('\n').reduce((start, s, y) => s.split('').reduce((start, s, x) => Object.values(D).reduce((start, d) => s === d ? ({ x, y, d }) : start, start), start, null));

  const move = ({ x, y, d }) => {
    switch (d) {
      case D.n:
        return { x, y: y - 1, d };
      case D.s:
        return { x, y: y + 1, d };
      case D.e:
        return { x: x + 1, y, d };
      case D.w:
        return { x: x - 1, y, d };
    }
  };

  const rot = ({ x, y, d }) => {
    switch (d) {
      case D.n:
        return { x, y, d: D.e };
      case D.s:
        return { x, y, d: D.w };
      case D.e:
        return { x, y, d: D.s };
      case D.w:
        return { x, y, d: D.n };
    }
  };

  const visited = (path, p) => {
    for (const { x, y, d } of path) {
      if (x === p.x && y === p.y && d === p.d) {
        return true;
      }
    }
    return false;
  }

  const walk = (bs, p) => {
    const path = [{ x: p.x, y: p.y, d: p.d }];

    let c = p;

    while (true) {
      const k = move(c);

      if (!isInside(k)) {
        return { path, loop: false };
      }

      if (visited(path, k)) {
        return { path, loop: true };
      }

      if (isBlocked(bs, k)) {
        c = rot(c);
      } else {
        c = k;
      }

      path.push({ x: c.x, y: c.y, d: c.d });
    }
  };

  const { path } = walk(blocked, start);

  const candidates = path.map(move).filter(isInside).filter((p) => !isBlocked(blocked, p)).reduce((cs, { x, y }) => {
    for (const c of cs) {
      if (c.x === x && c.y === y) {
        return cs;
      }
    }
    return [...cs, { x, y }];
  }, []);

  const tested = candidates.map((c) => {
    const bs = [...blocked, value(c)];
    const { loop } = walk(bs, start);
    return loop;
  });

  const n = tested.filter((b) => b).length;

  return n;
}
