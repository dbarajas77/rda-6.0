export interface OptimizedImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

const imageCache = new Map<string, string>();

export function clearImageCache() {
  imageCache.clear();
}

export const getOptimizedUnsplashUrl = (query: string, width: number = 800, height?: number): string => {
  const baseUrl = 'https://source.unsplash.com';
  const size = height ? `${width}x${height}` : `${width}x${width}`;
  // Add Unsplash parameters for optimization
  return `${baseUrl}/featured/${size}/?${encodeURIComponent(query)}&auto=format&q=80&fit=crop`;
};

// Helper function to preload images
export const preloadImage = (url: string): Promise<void> => {
  if (imageCache.has(url)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(url, url);
      resolve();
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Batch preload multiple images
export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => preloadImage(url)));
};