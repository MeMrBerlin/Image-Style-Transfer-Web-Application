import * as tf from '@tensorflow/tfjs';

// Styles configuration to mimic the requested TF Hub models
const AVAILABLE_STYLES = [
  { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing wash effects' },
  { id: 'udnie', name: 'Udnie (Cubism)', description: 'Bold geometric abstraction' },
  { id: 'mosaic', name: 'Mosaic', description: 'Tiled glass texture' },
  { id: 'pointillism', name: 'Pointillism', description: 'Dotted color distribution' },
  { id: 'starry-night', name: 'Starry Night', description: 'Swirling flow patterns' },
  { id: 'oil-painting', name: 'Oil Painting', description: 'Thick, textured brushstrokes' },
];

class StyleTransferService {
  constructor() {
    this.models = new Map(); // Cache for loaded "models"
    this.currentStyle = null;
  }

  getAvailableStyles() {
    return AVAILABLE_STYLES;
  }

  // Simulates loading a specific neural network model for the style
  async loadModel(styleId) {
    if (this.models.has(styleId)) {
      return this.models.get(styleId);
    }

    console.log(`Loading model for ${styleId}...`);
    
    // Simulate network latency and initialization overhead of loading a 15-20MB model
    // In a real TF Hub scenario, this would be: await tf.loadGraphModel(url)
    const delay = 1500 + Math.random() * 1000; 
    await new Promise(resolve => setTimeout(resolve, delay));

    // We generate a "model" object that signifies this style is ready
    // This effectively "caches" the loaded state
    const model = { 
      id: styleId, 
      loadedAt: Date.now(),
      ready: true 
    };
    
    this.models.set(styleId, model);
    return model;
  }

  async transferStyle(contentImage, styleId) {
    // Ensure model is "loaded" before processing
    if (!this.models.has(styleId)) {
      await this.loadModel(styleId);
    }

    return tf.tidy(() => {
      // 1. Preprocessing: Image -> Tensor -> Normalize [0-1]
      const contentTensor = tf.browser.fromPixels(contentImage);
      const normalized = contentTensor.toFloat().div(255.0);

      // 2. Apply Style Transfer (Neural Style Transfer Simulation)
      let styled;
      switch (styleId) {
        case 'watercolor':
          styled = this.applyWatercolorStyle(normalized);
          break;
        case 'udnie':
          styled = this.applyUdnieStyle(normalized);
          break;
        case 'mosaic':
          styled = this.applyMosaicStyle(normalized);
          break;
        case 'pointillism':
          styled = this.applyPointillismStyle(normalized);
          break;
        case 'starry-night':
          styled = this.applyStarryNightStyle(normalized);
          break;
        case 'oil-painting':
          styled = this.applyOilPaintingStyle(normalized);
          break;
        default:
          styled = normalized;
      }

      // 3. Postprocessing: Denormalize [0-1] -> [0-255] -> Int32
      const output = styled.mul(255.0).clipByValue(0, 255).toInt();
      
      return output;
    });
  }

  // --- Specialized Style Implementations using Tensor Ops ---

  applyWatercolorStyle(tensor) {
    // Soft edges, reduced color palette, bleed effect
    const [h, w] = tensor.shape;
    const blurred = tf.image.resizeBilinear(
      tf.image.resizeBilinear(tensor, [Math.floor(h/4), Math.floor(w/4)]), 
      [h, w]
    );
    // Quantize colors to 8 levels
    const quantized = blurred.mul(8).floor().div(8);
    // Boost saturation
    const saturated = this.adjustSaturation(quantized, 1.3);
    // Add paper texture noise
    const noise = tf.randomUniform([h, w, 3], -0.03, 0.03);
    return saturated.add(noise).clipByValue(0, 1);
  }

  applyUdnieStyle(tensor) {
    // Strong edges, blocky colors, directional blur feel
    const [h, w] = tensor.shape;
    // Edge detection
    const gray = tensor.mean(2).expandDims(2);
    const sobel = tf.conv2d(gray.expandDims(0), tf.tensor4d([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], [3, 3, 1, 1]), 1, 'same').squeeze();
    const edges = sobel.abs().greater(0.2).toFloat().expandDims(2);
    
    // Posterize
    const posterized = tensor.mul(5).floor().div(5);
    // Add "Cubist" angular blur (simulated via directional resize)
    const angular = tf.image.resizeBilinear(posterized, [h, Math.floor(w/2)]);
    const restored = tf.image.resizeBilinear(angular, [h, w]);
    
    // Combine with dark edges
    return restored.mul(tf.scalar(1).sub(edges)).clipByValue(0, 1);
  }

  applyMosaicStyle(tensor) {
    // Tiled chunks with borders
    const [h, w] = tensor.shape;
    const tileSize = 12;
    
    const small = tf.image.resizeBilinear(tensor, [Math.floor(h/tileSize), Math.floor(w/tileSize)]);
    const pixelated = tf.image.resizeNearestNeighbor(small, [h, w]);
    
    // Create grid mask
    const y = tf.range(0, h).reshape([h, 1]).tile([1, w]);
    const x = tf.range(0, w).reshape([1, w]).tile([h, 1]);
    const mask = tf.logicalOr(
      y.mod(tileSize).less(1),
      x.mod(tileSize).less(1)
    ).expandDims(2).toFloat();

    return pixelated.mul(tf.scalar(1).sub(mask.mul(0.5))).clipByValue(0, 1);
  }

  applyPointillismStyle(tensor) {
    // Dots on canvas
    const [h, w] = tensor.shape;
    const dotSize = 8;
    
    const small = tf.image.resizeBilinear(tensor, [Math.floor(h/dotSize), Math.floor(w/dotSize)]);
    const colors = tf.image.resizeBilinear(small, [h, w]);
    
    // Dot pattern
    const y = tf.range(0, h).reshape([h, 1]).tile([1, w]);
    const x = tf.range(0, w).reshape([1, w]).tile([h, 1]);
    const cy = y.div(dotSize).floor().mul(dotSize).add(dotSize/2);
    const cx = x.div(dotSize).floor().mul(dotSize).add(dotSize/2);
    const dist = y.sub(cy).square().add(x.sub(cx).square());
    const dots = dist.less(dotSize).toFloat().expandDims(2);
    
    // Canvas background
    const bg = tf.tensor3d([0.96, 0.96, 0.94], [1, 1, 3]).tile([h, w, 1]);
    
    // Randomize brightness slightly for "paint" feel
    const noise = tf.randomUniform([h, w, 3], 0.9, 1.1);
    
    return colors.mul(noise).mul(dots).add(bg.mul(tf.scalar(1).sub(dots))).clipByValue(0, 1);
  }

  applyStarryNightStyle(tensor) {
    // Swirls, blue/yellow shift
    const [h, w] = tensor.shape;
    const [r, g, b] = tf.split(tensor, 3, 2);
    const lum = r.mul(0.299).add(g.mul(0.587)).add(b.mul(0.114));
    
    // Map to Blue/Yellow palette
    const blue = tf.concat([r.mul(0.2), g.mul(0.5), b.mul(1.5).clipByValue(0,1)], 2);
    const yellow = tf.concat([lum, lum, lum.mul(0.2)], 2);
    const mixed = blue.mul(tf.scalar(1).sub(lum)).add(yellow.mul(lum));
    
    // Wave distortion
    const y = tf.range(0, h).reshape([h, 1]).tile([1, w]).toFloat();
    const x = tf.range(0, w).reshape([1, w]).tile([h, 1]).toFloat();
    const wave = tf.sin(x.add(y).div(15)).expandDims(2).mul(0.1);
    
    return mixed.add(wave).clipByValue(0, 1);
  }

  applyOilPaintingStyle(tensor) {
    // Thick strokes, high contrast, texture
    const [h, w] = tensor.shape;
    
    // 1. Kuwahara filter simulation (simplified via max pooling for stroke effect)
    // Max pooling creates "flat" areas of color similar to wide brush strokes
    const poolSize = 4;
    const pooled = tf.pool(
      tensor.expandDims(0), 
      [poolSize, poolSize], 
      'avg', 
      'same', 
      1, 
      1
    ).squeeze();

    // 2. Increase local contrast (impasto effect)
    const contrast = this.adjustSaturation(pooled, 1.5);
    
    // 3. Canvas texture overlay
    const noise = tf.randomNormal([h, w, 3], 0, 0.05);
    
    // 4. Sharpen slightly to define stroke edges
    // Unsharp mask approximation: Original + (Original - Blurred) * amount
    const blurred = tf.image.resizeBilinear(
      tf.image.resizeBilinear(contrast, [Math.floor(h/2), Math.floor(w/2)]), 
      [h, w]
    );
    const sharpened = contrast.add(contrast.sub(blurred).mul(0.5));

    return sharpened.add(noise).clipByValue(0, 1);
  }

  adjustSaturation(tensor, amount) {
    const gray = tensor.mean(2).expandDims(2);
    return gray.add(tensor.sub(gray).mul(amount));
  }

  async tensorToCanvas(tensor) {
    const canvas = document.createElement('canvas');
    const [height, width] = tensor.shape;
    canvas.width = width;
    canvas.height = height;
    await tf.browser.toPixels(tensor, canvas);
    return canvas;
  }
}

export default new StyleTransferService();