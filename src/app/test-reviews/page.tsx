'use client';

import React from 'react';

export default function TestPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Loading reviews...');
        const response = await fetch('/api/reviews?limit=12');
        console.log('📡 Response:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Data:', result);
          setData(result);
        } else {
          const errorText = await response.text();
          console.error('❌ Error:', errorText);
          setError(errorText);
        }
      } catch (err) {
        console.error('💥 Exception:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Reviews API</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Raw Data:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      {data?.reviews && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Reviews ({data.reviews.length}):</h2>
          <div className="space-y-4">
            {data.reviews.map((review: any, index: number) => (
              <div key={review.id} className="border p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <strong>{review.user?.name || 'Unknown User'}</strong>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <small className="text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
