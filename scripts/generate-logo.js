import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// Generate a high-resolution 512x512 PNG logo for GramBiz AI
function generatePng(width, height) {
  const buffer = Buffer.alloc(width * height * 4);

  // Helper to set RGBA
  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    // Alpha blending
    const srcA = a / 255;
    const dstA = buffer[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);

    if (outA > 0) {
      buffer[idx] = Math.round((r * srcA + buffer[idx] * dstA * (1 - srcA)) / outA);
      buffer[idx + 1] = Math.round((g * srcA + buffer[idx + 1] * dstA * (1 - srcA)) / outA);
      buffer[idx + 2] = Math.round((b * srcA + buffer[idx + 2] * dstA * (1 - srcA)) / outA);
      buffer[idx + 3] = Math.round(outA * 255);
    }
  }

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.46;
  const innerR = width * 0.41;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth outer shadow & background rounded badge
      if (dist <= outerR) {
        const t = (dy + outerR) / (2 * outerR);
        // Rich Emerald to Forest Deep Green gradient
        const r = Math.round(5 + t * 15);
        const g = Math.round(120 + (1 - t) * 45);
        const b = Math.round(60 + t * 40);

        // Anti-aliased boundary
        const edgeAlpha = Math.min(1, Math.max(0, outerR - dist));
        setPixel(x, y, r, g, b, Math.round(edgeAlpha * 255));
      }
    }
  }

  // Draw golden border ring
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= innerR && dist <= outerR - 4) {
        const ringAlpha = Math.min(1, Math.min(dist - innerR, (outerR - 4) - dist));
        if (ringAlpha > 0) {
          // Warm gold gradient
          const t = (dx + outerR) / (2 * outerR);
          const gr = Math.round(245 + t * 10);
          const gg = Math.round(180 + t * 40);
          const gb = Math.round(40 + t * 30);
          setPixel(x, y, gr, gg, gb, Math.round(ringAlpha * 220));
        }
      }
    }
  }

  // Draw central stylized geometry:
  // 1. Sprout leaf left (agri)
  // 2. Growth curve / Rupee fin-tech arc right
  // 3. AI glowing nodes & upward arrow / star
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / (width * 0.35); // -1 to 1 normalized
      const ny = (y - cy) / (height * 0.35); // -1 to 1 normalized

      // Leaf 1: Left agrarian curved leaf
      // Parametric leaf equation: ((nx + 0.3)^2 + (ny + 0.1)^2) < 0.35 and shape cut
      const leafX = nx + 0.32;
      const leafY = ny + 0.15;
      const dLeaf1 = Math.sqrt(leafX * leafX + (leafY * 1.3) * (leafY * 1.3));
      const leafAngle = Math.atan2(leafY, leafX);

      if (leafX < 0.2 && leafY > -0.65 && leafY < 0.5) {
        const shape = Math.sin((leafY + 0.65) / 1.15 * Math.PI) * 0.45;
        if (leafX > -shape && leafX < 0.05) {
          const edgeDist = Math.min(leafX + shape, 0.05 - leafX) * 20;
          const alpha = Math.min(1, Math.max(0, edgeDist));
          // Bright lime/mint green to gold
          const lr = Math.round(180 + leafY * 50);
          const lg = Math.round(240 + leafY * 20);
          const lb = Math.round(100);
          setPixel(x, y, lr, lg, lb, Math.round(alpha * 255));
        }
      }

      // Sprout Leaf 2 (Upper central shoot)
      const topLeafX = nx + 0.05;
      const topLeafY = ny + 0.45;
      if (topLeafY > -0.8 && topLeafY < 0.1 && topLeafX > -0.25 && topLeafX < 0.25) {
        const topShape = Math.sin((topLeafY + 0.8) / 0.9 * Math.PI) * 0.22;
        if (topLeafX > -topShape && topLeafX < topShape) {
          const edgeDist = (topShape - Math.abs(topLeafX)) * 25;
          const alpha = Math.min(1, Math.max(0, edgeDist));
          setPixel(x, y, 230, 255, 140, Math.round(alpha * 255));
        }
      }

      // Financial Growth Arc & Rupee bar right side
      // Rising exponential curve representing fintech loan growth
      // y = -0.5 * (x - 0.2)^2
      const arcTargetY = -0.7 * Math.pow(nx - 0.1, 2) + 0.35 * (nx);
      const arcDist = Math.abs(ny - arcTargetY);
      if (nx >= -0.15 && nx <= 0.75 && ny >= -0.65 && ny <= 0.55) {
        if (arcDist < 0.11) {
          const edgeDist = (0.11 - arcDist) * 20;
          const alpha = Math.min(1, Math.max(0, edgeDist));
          // Golden amber fintech curve
          const ar = Math.round(255);
          const ag = Math.round(215 - nx * 30);
          const ab = Math.round(60 + nx * 40);
          setPixel(x, y, ar, ag, ab, Math.round(alpha * 255));
        }
      }

      // Rupee horizontal balance crossbars
      // Upper bar
      if (nx >= 0.05 && nx <= 0.65 && Math.abs(ny - (-0.15)) < 0.045) {
        const edgeDist = (0.045 - Math.abs(ny - (-0.15))) * 30;
        const alpha = Math.min(1, Math.max(0, edgeDist));
        setPixel(x, y, 255, 235, 120, Math.round(alpha * 255));
      }
      // Lower bar
      if (nx >= 0.05 && nx <= 0.55 && Math.abs(ny - (0.02)) < 0.045) {
        const edgeDist = (0.045 - Math.abs(ny - (0.02))) * 30;
        const alpha = Math.min(1, Math.max(0, edgeDist));
        setPixel(x, y, 255, 235, 120, Math.round(alpha * 255));
      }

      // AI Sparkle Node at top right (Star / 4-point node)
      const starX = nx - 0.62;
      const starY = ny - (-0.55);
      const starDist = Math.sqrt(starX * starX + starY * starY);
      if (starDist < 0.22) {
        const p1 = Math.abs(starX) + Math.abs(starY);
        if (p1 < 0.16) {
          const alpha = Math.min(1, Math.max(0, (0.16 - p1) * 25));
          setPixel(x, y, 255, 255, 255, Math.round(alpha * 255));
        }
      }

      // Center glowing core dot
      const dotX = nx - 0.0;
      const dotY = ny - 0.42;
      const dotDist = Math.sqrt(dotX * dotX + dotY * dotY);
      if (dotDist < 0.08) {
        const alpha = Math.min(1, Math.max(0, (0.08 - dotDist) * 30));
        setPixel(x, y, 255, 245, 180, Math.round(alpha * 255));
      }
    }
  }

  return encodePNG(width, height, buffer);
}

// Minimal pure-node PNG encoder
function encodePNG(width, height, rgbaBuffer) {
  // Raw scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  let srcOffset = 0;

  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // Filter: None
    rgbaBuffer.copy(scanlines, scanOffset, srcOffset, srcOffset + width * 4);
    scanOffset += width * 4;
    srcOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 implementation for PNG
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write 512x512 logo PNG
const logoPng = generatePng(512, 512);
fs.writeFileSync(path.join(publicDir, 'grambiz-logo.png'), logoPng);
fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);

// Write 128x128 favicon PNG
const faviconPng = generatePng(128, 128);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconPng);

console.log('Successfully created /public/grambiz-logo.png, /public/logo.png, and /public/favicon.png');
