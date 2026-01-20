/**
 * Phase 3: Image compression utility
 * Compresses images before upload to reduce bandwidth and improve performance
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetSizeKB?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 2880, // Good for manga pages (roughly 2:3 aspect ratio)
  quality: 0.85,
  targetSizeKB: 500, // Target ~500KB per page
};

/**
 * Compress an image file to reduce size while maintaining quality
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > opts.maxWidth!) {
          width = opts.maxWidth!;
          height = width / aspectRatio;
        }

        if (height > opts.maxHeight!) {
          height = opts.maxHeight!;
          width = height * aspectRatio;
        }

        // Create canvas and draw image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // Create new File from blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg", // Convert all to JPEG for better compression
              lastModified: Date.now(),
            });

            // Check if we achieved target size, otherwise reduce quality
            if (
              opts.targetSizeKB &&
              compressedFile.size > opts.targetSizeKB * 1024 &&
              opts.quality! > 0.5
            ) {
              // Recursively compress with lower quality
              compressImage(file, {
                ...opts,
                quality: opts.quality! - 0.1,
              }).then(resolve, reject);
            } else {
              resolve(compressedFile);
            }
          },
          "image/jpeg",
          opts.quality,
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images in parallel
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void,
): Promise<File[]> {
  const compressed: File[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const compressedFile = await compressImage(files[i], options);
      compressed.push(compressedFile);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to compress ${files[i].name}:`, error);
      // Fall back to original file if compression fails
      compressed.push(files[i]);
      onProgress?.(i + 1, files.length);
    }
  }

  return compressed;
}
