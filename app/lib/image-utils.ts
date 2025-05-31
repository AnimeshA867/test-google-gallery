export function getProxyImageUrl(
  originalUrl: string | null | undefined,
  quality: number = 100,
  maxWidth?: number,
  maxHeight?: number
): string | null {
  if (!originalUrl) return null;

  // Encode the original URL to safely pass it as a query parameter
  const encodedUrl = encodeURIComponent(originalUrl);
  let proxyUrl = `/api/proxy-image?url=${encodedUrl}&quality=${quality}`;

  if (maxWidth) proxyUrl += `&maxWidth=${maxWidth}`;
  if (maxHeight) proxyUrl += `&maxHeight=${maxHeight}`;

  return proxyUrl;
}

export function getOptimalImageUrl(
  image: {
    thumbnailLink?: string | null;
    directLink?: string;
    webContentLink?: string | null;
  },
  quality: number = 50,
  maxWidth?: number,
  maxHeight?: number
): string | null {
  // Priority: directLink -> thumbnailLink -> webContentLink
  const originalUrl =
    image.directLink || image.thumbnailLink || image.webContentLink;
  return getProxyImageUrl(originalUrl, quality, maxWidth, maxHeight);
}

export function getThumbnailImageUrl(image: {
  thumbnailLink?: string | null;
  directLink?: string;
  webContentLink?: string | null;
}): string | null {
  // For thumbnails, use very aggressive compression: 15% quality + max 200px width
  const originalUrl =
    image.directLink || image.thumbnailLink || image.webContentLink;
  return getProxyImageUrl(originalUrl, 15, 200); // Very small size + very low quality = ~10-30KB
}

export function getGridThumbnailUrl(image: {
  thumbnailLink?: string | null;
  directLink?: string;
  webContentLink?: string | null;
}): string | null {
  // For grid view, use extremely aggressive compression: 12% quality + max 150px
  const originalUrl =
    image.directLink || image.thumbnailLink || image.webContentLink;
  return getProxyImageUrl(originalUrl, 12, 150); // Extremely small for grid view ~5-20KB
}

export function getFullSizeImageUrl(image: {
  directLink?: string;
  webContentLink?: string | null;
  thumbnailLink?: string | null;
}): string | null {
  // For full size, prefer directLink or webContentLink for better quality
  const originalUrl =
    image.directLink || image.webContentLink || image.thumbnailLink;
  return getProxyImageUrl(originalUrl, 100); // 100% quality for previews
}
