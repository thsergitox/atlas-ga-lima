export const tilePoint = (lon, lat, zoom) => [
  (lon + 180) / 360 * 2 ** zoom * 256,
  (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 2 ** zoom * 256
];

export function viewport(points, width, height) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min(Math.max(80, width - 100) / Math.max(1, maxX - minX), Math.max(80, height - 115) / Math.max(1, maxY - minY));
  const w = width / scale, h = height / scale;
  return { x: (minX + maxX - w) / 2, y: (minY + maxY - h) / 2 - 15 / scale, w, h, scale };
}

export function separateMarkers(points, scale) {
  const placed = [];
  return points.map(([x, y]) => {
    const options = [[0, 0]];
    for (const radius of [30, 52, 74, 96]) {
      for (let i = 0; i < 12; i++) options.push([Math.cos(i * Math.PI / 6) * radius, Math.sin(i * Math.PI / 6) * radius]);
    }
    const offset = options.find(([dx, dy]) => placed.every(([px, py]) => Math.hypot(x * scale + dx - px, y * scale + dy - py) >= 29)) || options.at(-1);
    placed.push([x * scale + offset[0], y * scale + offset[1]]);
    return [x + offset[0] / scale, y + offset[1] / scale];
  });
}

export const pathFor = coordinates => coordinates.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
