import React from 'react';
import { Star, Plus, School, X } from 'lucide-react';
import { SchoolInfo } from '../types/neis';

interface FavoritesBarProps {
  favorites: SchoolInfo[];
  activeSchool: SchoolInfo | null;
  onSelectSchool: (school: SchoolInfo) => void;
  onRemoveFavorite: (schoolCode: string) => void;
  onOpenSearch: () => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  activeSchool,
  onSelectSchool,
  onRemoveFavorite,
  onOpenSearch,
}) => {
  return (
    <div className="w-full bg-zinc-50/70 border-b border-zinc-200/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 whitespace-nowrap shrink-0 pr-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>즐겨찾기 학교</span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {favorites.map((school) => {
            const isActive = activeSchool?.SD_SCHUL_CODE === school.SD_SCHUL_CODE;
            return (
              <div
                key={school.SD_SCHUL_CODE}
                className={`group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-white text-zinc-900 border-zinc-300 shadow-xs ring-1 ring-zinc-300 font-semibold'
                    : 'bg-white/80 text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectSchool(school)}
                  className="flex items-center gap-1.5 text-left focus:outline-none"
                >
                  <School className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600" />
                  <span>{school.SCHUL_NM}</span>
                </button>

                {favorites.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(school.SD_SCHUL_CODE);
                    }}
                    title="즐겨찾기에서 제거"
                    className="p-0.5 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white border border-dashed border-zinc-300 hover:border-zinc-400 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>학교 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
};
