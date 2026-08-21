import React from 'react';

const SkeletonLine = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${w} ${h} bg-gray-200 rounded animate-pulse`} />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
    <SkeletonLine h="h-5" w="w-2/3" />
    <SkeletonLine />
    <SkeletonLine w="w-3/4" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-2">
    <SkeletonLine h="h-8" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonLine key={i} h="h-6" />
    ))}
  </div>
);

export default SkeletonLine;
