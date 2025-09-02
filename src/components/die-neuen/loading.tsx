'use client';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Laden der Artikel...</p>
      </div>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex h-32">
            <div className="w-24 h-full bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
              </div>
              <div className="h-5 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
