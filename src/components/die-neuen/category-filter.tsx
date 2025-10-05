'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { getUITheme } from '@/config/themes';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Alle Artikel', icon: '📚', count: '25' },
  { id: 'politik', name: 'Politik', icon: '🏛️', count: '8' },
  { id: 'wirtschaft', name: 'Wirtschaft', icon: '💼', count: '6' },
  { id: 'technologie', name: 'Technologie', icon: '💻', count: '4' },
  { id: 'sport', name: 'Sport', icon: '⚽', count: '3' },
  { id: 'kultur', name: 'Kultur', icon: '🎭', count: '2' },
  { id: 'wissenschaft', name: 'Wissenschaft', icon: '🔬', count: '2' },
];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const { theme } = useTheme();
  const currentTheme = getUITheme(theme);

  // Use semantic theme colors like blog
  const getThemeStyles = () => {
    return {
      container: "border-b-2 border-border pb-8 pt-4",
      button: "text-muted-foreground hover:text-foreground font-semibold",
      activeButton: "text-foreground border-b-2 border-primary",
      badge: "bg-secondary text-secondary-foreground",
      text: "text-muted-foreground",
      buttonCount: "bg-muted text-muted-foreground",
      textStrong: "text-foreground"
    };
  };  const styles = getThemeStyles();

  return (
    <div className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-full transform hover:scale-105
                ${selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl border-0'
                  : styles.button
                }
              `}
            >
              <span className="text-base">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`ml-1 text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : styles.buttonCount
              }`}>
                {category.count}
              </span>
            </Button>
          ))}
        </div>
        
        {selectedCategory !== 'all' && (
          <div className="mt-6 text-center">
            <p className={`${styles.text} text-sm`}>
              Kategorie aktiv: <strong className={`${styles.textStrong} font-semibold`}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
