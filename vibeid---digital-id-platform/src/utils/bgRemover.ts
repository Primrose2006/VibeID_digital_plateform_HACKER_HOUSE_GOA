/**
 * Client-side Canvas Image Background Removal & Subject Cutout Processor
 */

export interface BgRemovalOptions {
  threshold?: number; // 0 to 100 sensitivity
  edgeSmooth?: number; // 0 to 10 blur/softness
  outputBgColor?: string; // '#C81E45' for signature reference circle, 'transparent', '#0A3825', etc.
  isCircularCrop?: boolean;
  scale?: number; // 0.5 to 2.0
  offsetX?: number; // -100 to 100
  offsetY?: number; // -100 to 100
}

/**
 * Removes or replaces background from an HTML Image or DataURL using Canvas pixel analysis
 */
export async function removeImageBackground(
  imageSrc: string,
  options: BgRemovalOptions = {}
): Promise<string> {
  const {
    threshold = 35,
    edgeSmooth = 2,
    outputBgColor = '#C81E45',
    isCircularCrop = true,
    scale = 1.0,
    offsetX = 0,
    offsetY = 0,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 600; // High resolution square canvas
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Fill background if circular crop or custom bg color
      ctx.clearRect(0, 0, size, size);

      if (isCircularCrop && outputBgColor !== 'transparent') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = outputBgColor;
        ctx.fill();
        ctx.restore();
      } else if (!isCircularCrop && outputBgColor !== 'transparent') {
        ctx.fillStyle = outputBgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Create offscreen canvas for background subtraction analysis
      const offCanvas = document.createElement('canvas');
      offCanvas.width = img.naturalWidth || size;
      offCanvas.height = img.naturalHeight || size;
      const offCtx = offCanvas.getContext('2d');

      if (!offCtx) {
        reject(new Error('Offscreen canvas context failed'));
        return;
      }

      offCtx.drawImage(img, 0, 0);
      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const pixels = imgData.data;

      // Sample border pixels (corners) to detect dominant background color
      const cornerSamples = [
        [0, 0],
        [offCanvas.width - 1, 0],
        [0, offCanvas.height - 1],
        [offCanvas.width - 1, offCanvas.height - 1],
        [Math.floor(offCanvas.width / 2), 0],
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      cornerSamples.forEach(([x, y]) => {
        const idx = (y * offCanvas.width + x) * 4;
        bgR += pixels[idx];
        bgG += pixels[idx + 1];
        bgB += pixels[idx + 2];
      });
      bgR = Math.round(bgR / cornerSamples.length);
      bgG = Math.round(bgG / cornerSamples.length);
      bgB = Math.round(bgB / cornerSamples.length);

      // Distance thresholding with soft alpha feathering
      const maxDistance = 441.67; // sqrt(255^2 * 3)
      const normThreshold = (threshold / 100) * maxDistance;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Euclidean color distance from background sample
        const dist = Math.sqrt(
          (r - bgR) * (r - bgR) +
          (g - bgG) * (g - bgG) +
          (b - bgB) * (b - bgB)
        );

        if (dist < normThreshold) {
          // Feather alpha near boundary
          const featherRange = normThreshold * 0.3;
          if (dist > normThreshold - featherRange) {
            const alphaFactor = (dist - (normThreshold - featherRange)) / featherRange;
            pixels[i + 3] = Math.round(pixels[i + 3] * alphaFactor);
          } else {
            pixels[i + 3] = 0;
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      // Now draw subject onto main canvas with scale and offset
      ctx.save();
      if (isCircularCrop) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.clip();
      }

      // Calculate subject draw aspect ratio
      const aspect = offCanvas.width / offCanvas.height;
      let drawW = size * scale;
      let drawH = (size / aspect) * scale;
      if (drawH < size * scale) {
        drawH = size * scale;
        drawW = size * aspect * scale;
      }

      const drawX = (size - drawW) / 2 + offsetX;
      const drawY = (size - drawH) / 2 + offsetY;

      ctx.drawImage(offCanvas, drawX, drawY, drawW, drawH);
      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for background removal'));
    };

    img.src = imageSrc;
  });
}
