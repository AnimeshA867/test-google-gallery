"use client";

import { Grid, LayoutGrid, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type LayoutType = "grid" | "masonry";

interface GalleryControlsProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalImages?: number;
  loading?: boolean;
}

export function GalleryControls({
  layout,
  onLayoutChange,
  pageSize,
  onPageSizeChange,
  totalImages,
  loading = false,
}: GalleryControlsProps) {
  const pageSizeOptions = [6, 12, 18, 24, 36, 48];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
      {/* Layout Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Layout:
        </span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Button
            variant={layout === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onLayoutChange("grid")}
            disabled={loading}
            className="rounded-none border-0 h-8 px-3"
          >
            <Grid className="w-4 h-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={layout === "masonry" ? "default" : "ghost"}
            size="sm"
            onClick={() => onLayoutChange("masonry")}
            disabled={loading}
            className="rounded-none border-0 h-8 px-3 border-l border-gray-200 dark:border-gray-700"
          >
            <LayoutGrid className="w-4 h-4 mr-1" />
            Masonry
          </Button>
        </div>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Per page:
          </span>
        </div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {totalImages && (
          <Badge variant="secondary" className="text-xs">
            {totalImages} total
          </Badge>
        )}
      </div>
    </div>
  );
}
