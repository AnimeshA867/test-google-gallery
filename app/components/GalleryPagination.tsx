"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { PaginationInfo } from "../api/images/route";

interface GalleryPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function GalleryPagination({
  pagination,
  onPageChange,
  loading,
}: GalleryPaginationProps) {
  const {
    currentPage,
    totalPages,
    totalImages,
    pageSize,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page (if not already included)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (loading || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Page info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalImages)} of {totalImages}{" "}
          images
        </span>
        <Badge variant="outline" className="text-xs">
          Page {currentPage} of {totalPages}
        </Badge>
      </div>

      {/* Pagination controls */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageClick(currentPage - 1)}
              className={`cursor-pointer ${
                !hasPreviousPage || loading
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(page)}
                  isActive={page === currentPage}
                  className={`cursor-pointer ${
                    loading
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  } ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : ""
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageClick(currentPage + 1)}
              className={`cursor-pointer ${
                !hasNextPage || loading
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
}
