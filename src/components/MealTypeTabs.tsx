import React from 'react';
import { Sun, Utensils, Moon } from 'lucide-react';
import { ParsedMeal } from '../types/neis';

interface MealTypeTabsProps {
  selectedMealCode: string; // '1' | '2' | '3'
  onSelectMealCode: (code: string) => void;
  availableMeals: ParsedMeal[];
}

export const MealTypeTabs: React.FC<MealTypeTabsProps> = ({
  selectedMealCode,
  onSelectMealCode,
  availableMeals,
}) => {
  const mealTypes = [
    { code: '1', label: '조식', sub: '아침', icon: Sun },
    { code: '2', label: '중식', sub: '점심', icon: Utensils },
    { code: '3', label: '석식', sub: '저녁', icon: Moon },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl mb-6 max-w-md">
      {mealTypes.map(({ code, label, sub, icon: Icon }) => {
        const isSelected = selectedMealCode === code;
        const hasData = availableMeals.some((m) => m.mealCode === code);

        return (
          <button
            key={code}
            type="button"
            onClick={() => onSelectMealCode(code)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
              isSelected
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isSelected ? 'text-amber-500' : 'text-zinc-400'
              }`}
            />
            <span className="whitespace-nowrap">{label}</span>
            <span
              className={`text-xs ${
                isSelected ? 'text-zinc-400' : 'text-zinc-400'
              }`}
            >
              {sub}
            </span>
            {hasData && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                title={`${label} 메뉴 있음`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
