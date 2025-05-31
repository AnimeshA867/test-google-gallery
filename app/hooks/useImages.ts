import { useState, useEffect, useCallback } from "react";
import { DriveImage, PaginationInfo } from "../api/images/route";

interface UseImagesReturn {
  images: DriveImage[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  currentPageSize: number;
  fetchImages: (page?: number, pageSize?: number) => Promise<void>;
  setPageSize: (size: number) => Promise<void>;
}

export function useImages(): UseImagesReturn {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(12);

  const fetchImages = useCallback(
    async (page: number = currentPage, pageSize: number = currentPageSize) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/images?page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data.images);
        setPagination(data.pagination);
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, currentPageSize]
  );

  const setPageSize = useCallback(
    async (size: number) => {
      // When changing page size, go back to page 1
      await fetchImages(1, size);
    },
    [fetchImages]
  );

  useEffect(() => {
    fetchImages(1, 12);
  }, []);

  return {
    images,
    pagination,
    loading,
    error,
    currentPage,
    currentPageSize,
    fetchImages,
    setPageSize,
  };
}
