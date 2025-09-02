'use client';

import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Alle' },
  { id: 'politik', name: 'Politik' },
  { id: 'wirtschaft', name: 'Wirtschaft' },
  { id: 'technologie', name: 'Technologie' },
  { id: 'sport', name: 'Sport' },
  { id: 'kultur', name: 'Kultur' },
  { id: 'wissenschaft', name: 'Wissenschaft' },
  { id: 'bildung', name: 'Bildung' },
  { id: 'gesellschaft', name: 'Gesellschaft' },
  { id: 'umwelt', name: 'Umwelt' }
];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            size="sm"
            className={`
              text-sm font-normal transition-colors
              ${selectedCategory === category.id 
                ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
