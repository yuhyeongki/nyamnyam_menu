import React from 'react';
import { ChevronLeft, ChevronRight, Flame, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { ALLERGEN_MAP, ParsedMeal } from '../types/neis';
import { formatToYmd, getSchoolWeekDays } from '../services/neisApi';

interface WeeklyMealViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  weeklyMeals: ParsedMeal[];
  userAllergies: number[];
  onSelectDateAndSwitchToDaily: (date: Date) => void;
  isLoading: boolean;
}

export const WeeklyMealView: React.FC<WeeklyMealViewProps> = ({
  currentDate,
  onDateChange,
  weeklyMeals,
  userAllergies,
  onSelectDateAndSwitchToDaily,
  isLoading,
}) => {
  const weekDays = getSchoolWeekDays(currentDate);
  const monday = weekDays[0];
  const friday = weekDays[4];

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    onDateChange(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    onDateChange(next);
  };

  const handleThisWeek = () => {
    onDateChange(new Date());
  };

  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="지난주"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-zinc-50 border border-zinc-200/70 rounded-xl">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span className="text-sm sm:text-base font-semibold text-zinc-900 tabular-nums">
              {monday.getFullYear()}년 {monday.getMonth() + 1}월 {monday.getDate()}일 ~{' '}
              {friday.getMonth() + 1}월 {friday.getDate()}일
            </span>
            <span className="text-xs font-medium text-zinc-500">주간 식단</span>
          </div>

          <button
            type="button"
            onClick={handleNextWeek}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="다음주"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleThisWeek}
            className="px-3 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors shrink-0"
          >
            이번 주
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          * 각 날짜 카드를 누르면 상세 영양 및 원산지 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* 5-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((dayDate) => {
          const ymd = formatToYmd(dayDate);
          // Prefer 중식 (lunch, code '2'), otherwise first meal found
          const dayMeal =
            weeklyMeals.find((m) => m.date === ymd && m.mealCode === '2') ||
            weeklyMeals.find((m) => m.date === ymd);

          const isDayToday =
            dayDate.getFullYear() === new Date().getFullYear() &&
            dayDate.getMonth() === new Date().getMonth() &&
            dayDate.getDate() === new Date().getDate();

          return (
            <div
              key={ymd}
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xs ${
                isDayToday
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-bold ${
                        isDayToday ? 'text-amber-600' : 'text-zinc-900'
                      }`}
                    >
                      {DAY_NAMES[dayDate.getDay()]}요일
                    </span>
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {dayDate.getMonth() + 1}.{dayDate.getDate()}
                    </span>
                  </div>

                  {isDayToday && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      오늘
                    </span>
                  )}
                </div>

                {/* Meals */}
                {isLoading ? (
                  <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">
                    식단 불러오는 중...
                  </div>
                ) : dayMeal && dayMeal.dishes.length > 0 ? (
                  <div className="space-y-1.5 mb-4">
                    {dayMeal.calories && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 mb-2">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span className="tabular-nums">{dayMeal.calories}</span>
                      </div>
                    )}

                    <ul className="space-y-1 text-xs text-zinc-700">
                      {dayMeal.dishes.map((dish, i) => {
                        const hasUserAllergy = dish.allergenIds.some((id) =>
                          userAllergies.includes(id)
                        );
                        return (
                          <li
                            key={i}
                            className={`flex items-start justify-between gap-1 py-0.5 leading-snug ${
                              hasUserAllergy
                                ? 'text-amber-900 font-semibold bg-amber-50 px-1 rounded'
                                : ''
                            }`}
                          >
                            <span className="truncate">{dish.name}</span>
                            {hasUserAllergy && (
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-zinc-400">
                    식단 없음
                  </div>
                )}
              </div>

              {/* Jump to Daily View Button */}
              {dayMeal && (
                <button
                  type="button"
                  onClick={() => onSelectDateAndSwitchToDaily(dayDate)}
                  className="w-full mt-3 pt-2 border-t border-zinc-100 text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>상세 보기</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
