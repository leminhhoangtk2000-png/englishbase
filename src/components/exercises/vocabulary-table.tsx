'use client';

import React from 'react';

interface VocabularyTableProps {
  data: Array<{
    word: string;
    plural?: string;
    type: string;
    meaning: string;
  }>;
}

export function VocabularyTable({ data }: VocabularyTableProps) {
  return (
    <div className="overflow-x-auto my-8 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              Từ vựng
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              Từ vựng số nhiều
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              Loại từ
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              Nghĩa
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {row.word}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {row.plural || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {row.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {row.meaning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Component để sử dụng trong MDX
interface MDXVocabularyTableProps {
  children: React.ReactNode;
}

export function MDXVocabularyTable({ children }: MDXVocabularyTableProps) {
  // This component wraps regular MDX table with enhanced styling
  return (
    <div className="vocabulary-table-wrapper my-8">
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="min-w-full bg-white dark:bg-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}
