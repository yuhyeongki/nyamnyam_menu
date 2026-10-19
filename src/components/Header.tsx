import React from 'react';
import { Search, Star, UtensilsCrossed, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentView: 'daily' | 'weekly';
  onViewChange: (view: 'daily' | 'weekly') => void;
  onOpenSearch: () => void;
  onOpenAllergySettings: () => void;
  onOpenAllergenGuide: () => void;
  favoritesCount: number;
  userAllergiesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSearch,
  onOpenAllergySettings,
  onOpenAllergenGuide,
  favoritesCount,
  userAllergiesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              냠냠급식
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => onViewChange('daily')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] flex items-center ${
              currentView === 'daily'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            오늘 급식
          </button>
          <button
            type="button"
            onClick={() => onViewChange('weekly')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] flex items-center ${
              currentView === 'weekly'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            주간 식단표
          </button>
          <button
            type="button"
            onClick={onOpenAllergySettings}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            title="나의 알레르기 설정"
          >
            <ShieldAlert className="w-4 h-4 text-zinc-500" />
            <span>알레르기 필터</span>
            {userAllergiesCount > 0 && (
              <span className="text-xs font-semibold text-amber-600 tabular-nums">
                ({userAllergiesCount})
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenAllergenGuide}
            className="hidden md:flex items-center px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            알레르기 번호표
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="px-3.5 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">학교 검색</span>
          </button>
        </div>
      </div>
    </header>
  );
};
