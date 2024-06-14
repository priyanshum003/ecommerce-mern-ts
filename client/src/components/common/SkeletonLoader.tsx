import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Define the props for the SkeletonLoader component
interface SkeletonLoaderProps {
  rows?: number;
  columns?: number;
  height?: number;
  className?: string;
}

// Define the SkeletonLoader component
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 5,
  columns = 1,
  height = 40,
  className = ''
}) => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      {/* Container for the skeleton loaders with dynamic grid layout */}
      <div
        className={`grid gap-4 ${className}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {/* Generate skeleton loaders based on rows and columns */}
        {Array(rows * columns)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} height={height} />
          ))}
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonLoader;
