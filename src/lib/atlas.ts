export const pathways = [
  { name: "Cell cycle", color: "#4e79a7", genes: ["CDK1", "CCNB1", "CCNA2", "MKI67", "TOP2A", "BUB1"] },
  { name: "DNA repair", color: "#f28e2b", genes: ["BRCA1", "BRCA2", "ATM", "RAD51", "PALB2", "CHEK2"] },
  { name: "Cytotoxic", color: "#59a14f", genes: ["CD8A", "NKG7", "GZMB", "PRF1", "GNLY", "GZMA"] },
  { name: "Signaling", color: "#e15759", genes: ["EGFR", "KRAS", "PIK3CA", "BRAF", "PTEN", "AKT1"] },
  { name: "Hormone", color: "#b07aa1", genes: ["ESR1", "PGR", "AR", "GATA3", "FOXA1", "XBP1"] },
  { name: "Hypoxia", color: "#76b7b2", genes: ["HIF1A", "VEGFA", "LDHA", "SLC2A1", "CA9", "EPO"] },
  { name: "Globin", color: "#edc948", genes: ["HBB", "HBA1", "HBA2", "HBD", "HBG1", "HBG2"] },
] as const;

export const programs = [
  { name: "Stress", hue: 8, x: 34, y: 30 },
  { name: "Myeloid", hue: 208, x: 68, y: 27 },
  { name: "Cycle", hue: 24, x: 50, y: 46 },
  { name: "Interferon", hue: 274, x: 72, y: 58 },
  { name: "Stroma", hue: 128, x: 30, y: 66 },
  { name: "Secretion", hue: 46, x: 52, y: 74 },
  { name: "Vascular", hue: 338, x: 58, y: 36 },
] as const;

export const geneNames = pathways.flatMap((pathway) => [...pathway.genes]);
export const geneColors = pathways.flatMap((pathway) =>
  pathway.genes.map(() => pathway.color),
);
const geneGroups = pathways.flatMap((pathway, index) =>
  pathway.genes.map(() => index),
);

export const embeddingCount = 10000;
const barsPerProgram = 520;
export const fieldCount = programs.length * barsPerProgram;

export type EmbedPoint = { x: number; y: number; gene: number };
export type FieldBar = {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: number;
  light: number;
  sat: number;
};

export const diseases = [
  {
    name: "Malaria",
    color: "#c44536",
    sigma: 4.4,
    foci: [
      [3.4, 6.5], [8.5, 12.0], [-13.2, 8.5], [15.3, -4.3], [32.6, 0.3],
      [36.8, -1.3], [39.2, -6.8], [32.6, -15.4], [-60.0, -3.1], [-48.5, -1.5],
      [100.5, 13.8], [102.6, 17.9], [105.8, 21.0], [87.3, 22.6], [78.5, 17.4],
    ],
  },
  {
    name: "Dengue",
    color: "#e07a2f",
    sigma: 3.2,
    foci: [
      [100.5, 13.75], [106.7, 10.8], [106.8, -6.2], [121.0, 14.6], [101.7, 3.1],
      [103.8, 1.35], [72.9, 19.1], [90.4, 23.8], [77.2, 28.6], [-43.2, -22.9],
      [-34.9, -8.05], [-66.9, 10.5], [-70.0, 18.5], [-80.2, 25.8], [114.2, -8.6],
    ],
  },
  {
    name: "Cholera",
    color: "#2f6f8f",
    sigma: 2.8,
    foci: [
      [90.4, 23.7], [88.4, 22.6], [67.0, 24.9], [72.8, 19.0], [44.2, 15.4],
      [-72.3, 18.5], [3.4, 6.5], [32.6, -25.9], [-77.0, -12.0], [39.7, -4.0],
    ],
  },
  {
    name: "Influenza",
    color: "#3d7a4a",
    sigma: 1.8,
    foci: [
      [-74.0, 40.7], [-87.6, 41.9], [-118.2, 34.05], [-0.1, 51.5], [2.3, 48.9],
      [13.4, 52.5], [37.6, 55.8], [139.7, 35.7], [126.9, 37.6], [116.4, 39.9],
      [121.5, 31.2], [-46.6, -23.5], [151.2, -33.9], [28.0, 41.0], [-99.1, 19.4],
      [77.2, 28.6], [72.8, 19.1],
    ],
  },
  {
    name: "Tuberculosis",
    color: "#6b4c7a",
    sigma: 3.5,
    foci: [
      [72.8, 19.1], [77.2, 28.6], [88.4, 22.6], [67.0, 24.9], [106.8, -6.2],
      [121.0, 14.6], [3.4, 6.5], [28.0, -26.2], [-77.0, -12.0], [37.6, 55.8],
      [114.1, 22.3], [100.5, 13.8],
    ],
  },
] as const;

const casesPerFocus = 460;

export type DiseaseCase = { lon: number; lat: number; disease: number };

export type AtlasSnapshot = {
  matrix: number[][];
  points: EmbedPoint[];
  bars: FieldBar[];
  cases: DiseaseCase[];
};

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number) {
  const left = Math.max(1e-9, random());
  const right = random();
  return Math.sqrt(-2 * Math.log(left)) * Math.cos(Math.PI * 2 * right);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function chordMatrix(random: () => number) {
  const count = geneNames.length;
  const matrix = Array.from({ length: count }, () => Array<number>(count).fill(0));
  for (let row = 0; row < count; row += 1) {
    for (let column = row + 1; column < count; column += 1) {
      const same = geneGroups[row] === geneGroups[column];
      if (!same && random() > 0.3) continue;
      const weight = same ? 1.4 + random() * 5.5 : random() ** 0.65 * 2.8;
      matrix[row][column] = weight;
      matrix[column][row] = weight;
    }
  }
  for (let index = 0; index < count; index += 1) {
    const next = index + 1 < count && geneGroups[index + 1] === geneGroups[index] ? index + 1 : index - 1;
    const weight = Math.max(matrix[index][next], 2 + random() * 3);
    matrix[index][next] = weight;
    matrix[next][index] = weight;
  }
  return matrix;
}

function embedding(random: () => number): EmbedPoint[] {
  const points: EmbedPoint[] = [];
  for (let index = 0; index < embeddingCount; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * (random() < 0.08 ? 1.12 : 0.94);
    const x = radius * Math.cos(angle) + gaussian(random) * 0.035;
    const y = radius * Math.sin(angle) + gaussian(random) * 0.035;
    const gene = clamp(460 + x * 70 + y * 50 + (random() - 0.5) * 460, 280, 980);
    points.push({ x, y, gene });
  }
  return points;
}

function field(random: () => number): FieldBar[] {
  const bars: FieldBar[] = [];
  for (const program of programs) {
    const originX = program.x + (random() - 0.5) * 14;
    const originY = program.y + (random() - 0.5) * 14;
    const spreadX = 6.5 + random() * 3;
    const spreadY = 4.2 + random() * 2;
    for (let index = 0; index < barsPerProgram; index += 1) {
      bars.push({
        x: clamp(originX + gaussian(random) * spreadX, 1, 99),
        y: clamp(originY + gaussian(random) * spreadY, 1, 99),
        w: 1.7 + random() * 2.6,
        h: 0.52 + random() * 0.28,
        hue: program.hue + (random() - 0.5) * 18,
        light: 40 + random() * 30,
        sat: 55 + random() * 28,
      });
    }
  }
  return bars;
}

function diseaseCases(random: () => number): DiseaseCase[] {
  const cases: DiseaseCase[] = [];
  diseases.forEach((disease, diseaseIndex) => {
    for (const focus of disease.foci) {
      const originLon = focus[0] + (random() - 0.5) * 5;
      const originLat = focus[1] + (random() - 0.5) * 3.5;
      for (let index = 0; index < casesPerFocus; index += 1) {
        cases.push({
          lon: originLon + gaussian(random) * disease.sigma,
          lat: clamp(originLat + gaussian(random) * disease.sigma * 0.72, -54, 70),
          disease: diseaseIndex,
        });
      }
    }
  });
  return cases;
}

export function createAtlas(seed: number): AtlasSnapshot {
  const random = mulberry32(seed * 9973 + 17);
  return {
    matrix: chordMatrix(random),
    points: embedding(random),
    bars: field(random),
    cases: diseaseCases(random),
  };
}

export function mixMatrix(from: number[][], to: number[][], t: number) {
  const count = from.length;
  const matrix = Array.from({ length: count }, () => Array<number>(count).fill(0));
  for (let row = 0; row < count; row += 1) {
    for (let column = 0; column < count; column += 1) {
      const start = from[row][column];
      const end = to[row][column];
      if (start === 0 && end === 0) continue;
      const left = start === 0 ? 0.001 : start;
      const right = end === 0 ? 0.001 : end;
      matrix[row][column] = left + (right - left) * t;
    }
  }
  return matrix;
}

export function mixSnapshot(from: AtlasSnapshot, to: AtlasSnapshot, t: number): AtlasSnapshot {
  return {
    matrix: mixMatrix(from.matrix, to.matrix, t),
    points: from.points.map((point, index) => {
      const next = to.points[index];
      return {
        x: point.x + (next.x - point.x) * t,
        y: point.y + (next.y - point.y) * t,
        gene: point.gene + (next.gene - point.gene) * t,
      };
    }),
    bars: from.bars.map((bar, index) => {
      const next = to.bars[index];
      return {
        x: bar.x + (next.x - bar.x) * t,
        y: bar.y + (next.y - bar.y) * t,
        w: bar.w + (next.w - bar.w) * t,
        h: bar.h + (next.h - bar.h) * t,
        hue: bar.hue + (next.hue - bar.hue) * t,
        light: bar.light + (next.light - bar.light) * t,
        sat: bar.sat + (next.sat - bar.sat) * t,
      };
    }),
    cases: from.cases.map((item, index) => {
      const next = to.cases[index];
      return {
        lon: item.lon + (next.lon - item.lon) * t,
        lat: item.lat + (next.lat - item.lat) * t,
        disease: item.disease,
      };
    }),
  };
}
