export function getProxyImageUrl(
  originalUrl: string | null | undefined,
  quality: number = 100
): string | null {
  if (!originalUrl) return null;

  // Encode the original URL to safely pass it as a query parameter
  const encodedUrl = encodeURIComponent(originalUrl);
  return `/api/proxy-image?url=${encodedUrl}&quality=${quality}`;
}

export function getOptimalImageUrl(
  image: {
    thumbnailLink?: string | null;
    directLink?: string;
    webContentLink?: string | null;
  },
  quality: number = 50
): string | null {
  // Priority: directLink -> thumbnailLink -> webContentLink
  const originalUrl =
    image.directLink || image.thumbnailLink || image.webContentLink;
  return getProxyImageUrl(originalUrl, quality);
}

export function getThumbnailImageUrl(image: {
  thumbnailLink?: string | null;
  directLink?: string;
  webContentLink?: string | null;
}): string | null {
  return getOptimalImageUrl(image, 40); // 40% quality for thumbnails
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
