export const CardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="h-5 w-5 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="mb-2 h-5 w-2/3 rounded bg-gray-200" />
      <div className="mb-1 h-4 w-full rounded bg-gray-200" />
      <div className="h-4 w-1/3 rounded bg-gray-200" />
    </div>
  );
};

export const WindowCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2 h-5 w-1/2 rounded bg-gray-200" />
          <div className="mb-1 h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-5 w-5 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
