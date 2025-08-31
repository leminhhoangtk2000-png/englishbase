'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import * as React from 'react';
import { cn } from "@/lib/utils";

export function ContributionGraph() {
  const [selectedYear, setSelectedYear] = React.useState('2025');
  const [days, setDays] = React.useState<number[]>([]);

  React.useEffect(() => {
    const initialDays = Array.from({ length: 371 }, () => 0);
    const randomDays = initialDays.map(() => {
      if (Math.random() > 0.4) {
        return Math.floor(Math.random() * 4) + 1;
      }
      return 0;
    });
    setDays(randomDays);
  }, [selectedYear]);

  const contributionColors = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
  ];
  
  const months = ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12"];
  const years = ['2025', '2024'];
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="flex items-start gap-4">
      <div className="p-4 border rounded-md flex-1">
        <h3 className="text-base mb-4">
          Số ngày đã học chăm chỉ trong năm {selectedYear}: 
          <span className="font-bold">{days.filter(d => d > 0).length}</span>
        </h3>
        
        <div className="flex gap-3">
          <div className="flex flex-col text-xs text-muted-foreground self-stretch pt-6">
            {weekDays.map((day, index) => (
              <span key={day} className={cn("h-3", { "invisible": index % 2 !== 0 })}>
                {day.substring(0,3)}
              </span>
            ))}
          </div>
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 px-1">
              {months.map((month) => (
                <div key={month} className="flex-1 text-center">
                  {month}
                </div>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {days.map((level, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-sm ${contributionColors[level]}`}
                  title={`Mức độ đóng góp ${level} vào ngày ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary">
            Tìm hiểu cách chúng tôi đếm đóng góp
          </Link>
          <div className="flex items-center gap-1">
            <span>Ít</span>
            {contributionColors.map((color, index) => (
              <div key={index} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            ))}
            <span>Nhiều</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-1">
        {years.map(year => (
          <Button 
            key={year}
            variant={selectedYear === year ? 'default' : 'ghost'}
            size="sm"
            className={cn('h-7 px-3 w-full justify-start text-sm', {
              'text-muted-foreground': selectedYear !== year
            })}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
