import Color from 'color';
import { ipcRenderer } from 'electron';
import { $ } from 'shared/utils/dom';
import { range } from 'shared/utils/math';
import { micaAlt } from 'shared/config/ui.json';

const SAMPLE_FACTOR = 100;
const BLUR_RADIUS = 4;
const BLUR_GRADIENT = 0.5;
const RES_SCALE = 200;
const blurParamA =
  (BLUR_RADIUS -
    Math.sqrt(4 * BLUR_RADIUS * BLUR_GRADIENT + Math.pow(BLUR_RADIUS, 2))) /
  2;
const blurParamB = BLUR_GRADIENT / blurParamA + 1;

type ImageData = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

async function getSampleData(
  src: string,
  width: number,
  height: number
): Promise<ImageData> {
  // Load Image
  let img = $.new('img');
  img.src = src;
  await new Promise((resolve) => (img.onload = resolve));
  // Basic Param
  let w = Math.floor(width / SAMPLE_FACTOR);
  let h = Math.floor(height / SAMPLE_FACTOR);
  let ratio = w / h;
  let imgRatio = img.width / img.height;
  // Canvas
  let canvas = $.new('canvas');
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext('2d')!;
  // Scale
  let sx = 0;
  let sy = 0;
  let sw = 0;
  let sh = 0;
  if (imgRatio > ratio) {
    sw = img.height * ratio;
    sh = img.height;
    sx = (img.width - sw) / 2;
  } else {
    sw = img.width;
    sh = img.width / ratio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  let data = ctx.getImageData(0, 0, w, h).data;
  // Filter
  /* for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    let color = Color.rgb(r, g, b).saturationv(100).value(6);
    data[i] = color.red();
    data[i + 1] = color.green();
    data[i + 2] = color.blue();
  } */
  return {
    data,
    width: w,
    height: h,
  };
}

function getWeight(x1: number, y1: number, x2: number, y2: number): number {
  const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  // return 1 / (d - blurParamA) + blurParamB;
  return 1 - d / BLUR_RADIUS;
}

function blurAndScale(sample: ImageData, dist: ImageData, value: number) {
  const rangeH = range(0, dist.width);
  const rangeV = range(0, dist.height);
  const rangeSH = range(0, sample.width);
  const rangeSV = range(0, sample.height);
  for (const y of rangeV) {
    for (const x of rangeH) {
      /* 
      Left/Right Stretch Alignment（左右拉伸对齐）
      @example
      0 1 2 3 4
      0   1   2
      */
      const sampleX = (x / (dist.width - 1)) * (sample.width - 1);
      const sampleY = (y / (dist.height - 1)) * (sample.height - 1);
      let weights = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      for (const sy of rangeSV) {
        for (const sx of rangeSH) {
          let weight = getWeight(sampleX, sampleY, sx, sy);
          if (weight <= 0) continue;
          weights += weight;
          sumR += sample.data[(sy * sample.width + sx) * 4 + 0] * weight;
          sumG += sample.data[(sy * sample.width + sx) * 4 + 1] * weight;
          sumB += sample.data[(sy * sample.width + sx) * 4 + 2] * weight;
        }
      }
      let color = Color.rgb(sumR / weights, sumG / weights, sumB / weights)
        .saturationv(100)
        .value(value);
      dist.data[y * dist.width * 4 + x * 4 + 0] = color.red();
      dist.data[y * dist.width * 4 + x * 4 + 1] = color.green();
      dist.data[y * dist.width * 4 + x * 4 + 2] = color.blue();
      dist.data[y * dist.width * 4 + x * 4 + 3] = 255;
    }
  }
}

interface ScreenSize {
  width: number;
  height: number;
  scale: number;
}
function createCanvas(
  { width, height, scale }: ScreenSize,
  sampleData: ImageData,
  value: number
): HTMLCanvasElement {
  let resHeight = Math.floor(height / RES_SCALE);
  let resWidth = Math.floor(width / RES_SCALE);
  let canvas = $.new('canvas');
  canvas.width = resWidth;
  canvas.height = resHeight;
  canvas.style.width = `${width / scale}px`;
  canvas.style.height = `${height / scale}px`;
  let ctx = canvas.getContext('2d')!;
  let data = ctx.createImageData(resWidth, resHeight);
  blurAndScale(
    sampleData,
    {
      data: data.data,
      width: resWidth,
      height: resHeight,
    },
    value
  );
  ctx.putImageData(data, 0, 0);
  return canvas;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#initmica) */
export async function initMica() {
  // BUG: Displaying exceptions on multiple screens
  // Get Sample Data
  let wallpaperPath = await ipcRenderer.invoke('os:getWallpaperPath');
  if (!wallpaperPath) return;
  let screenSize = (await ipcRenderer.invoke('os:getScreenSize')) as ScreenSize;
  let sampleData = await getSampleData(
    wallpaperPath,
    screenSize.width,
    screenSize.height
  );
  let micaDiv = $.new('div');
  micaDiv.classList.add('mica');
  micaDiv.classList.toggle('mica-alt', micaAlt);
  // Create Mica Canvas
  let lightCanvas = createCanvas(screenSize, sampleData, 94);
  lightCanvas.classList.add('mica-light');
  let darkCanvas = createCanvas(screenSize, sampleData, 6);
  darkCanvas.classList.add('mica-dark');
  micaDiv.append(lightCanvas, darkCanvas);
  document.body.prepend(micaDiv);
  // Handle Window Move
  ipcRenderer.on('win:move', (_, [x, y]) => {
    micaDiv.style.left = `-${x}px`;
    micaDiv.style.top = `-${y}px`;
  });
}
