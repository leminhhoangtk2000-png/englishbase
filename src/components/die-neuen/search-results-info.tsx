'use client';

interface SearchResultsInfoProps {
  filteredCount: number;
  totalCount: number;
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  articlesPerPage: number;
}

export default function SearchResultsInfo({
  searchTerm,
  selectedCategory,
  currentPage,
  totalPages,
  totalCount,
  filteredCount,
  articlesPerPage
}: SearchResultsInfoProps) {
  if (!searchTerm && selectedCategory === 'all') {
    return (
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500">
          Seite {currentPage} von {totalPages} • {Math.min(currentPage * articlesPerPage, totalCount)} von {totalCount} Artikeln
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * articlesPerPage + 1;
  const endIndex = Math.min(currentPage * articlesPerPage, filteredCount);

  return (
    <div className="mb-6 text-center">
      <p className="text-sm text-gray-600">
        {filteredCount > 0 ? (
          <>
            {filteredCount} Artikel gefunden
            {searchTerm && ` für "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            {totalPages > 1 && ` • Seite ${currentPage} von ${totalPages} (${startIndex}-${endIndex})`}
          </>
        ) : (
          <>
            Keine Artikel gefunden
            {searchTerm && ` für "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          </>
        )}
      </p>
    </div>
  );
}
