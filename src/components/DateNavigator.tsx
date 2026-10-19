import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { formatToYmd, getSchoolWeekDays } from '../services/neisApi';

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  onDateChange,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const isToday =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === today.getDate();

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      onDateChange(new Date(year, month - 1, day));
    }
  };

  const weekDays = getSchoolWeekDays(currentDate);
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  // Format for HTML date input: YYYY-MM-DD
  const formattedInputVal = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main Controls: Prev, Date Display, Next, Today */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors shrink-0"
            title="이전 날짜"
            aria-label="이전 날짜"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 px-3 py-2 bg-zinc-50 border border-zinc-200/70 rounded-xl">
            <CalendarIcon className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-base font-semibold text-zinc-900 tabular-nums">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
            </span>
            <span className="text-sm font-medium text-zinc-500">
              ({DAY_NAMES[currentDate.getDay()]}요일)
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors shrink-0"
            title="다음 날짜"
            aria-label="다음 날짜"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>오늘로</span>
            </button>
          )}

          {/* Hidden Date Picker triggered by button */}
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={formattedInputVal}
              onChange={handleNativeDateChange}
              className="sr-only"
              aria-label="날짜 직접 선택"
            />
            <button
              type="button"
              onClick={() => {
                if (dateInputRef.current) {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    try {
                      dateInputRef.current.showPicker();
                    } catch {
                      dateInputRef.current.click();
                    }
                  } else {
                    dateInputRef.current.click();
                  }
                }
              }}
              className="px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors shrink-0"
            >
              날짜 직접선택
            </button>
          </div>
        </div>

        {/* School Weekday Quick Strip (Mon ~ Fri) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
          {weekDays.map((dayDate) => {
            const isSelected =
              dayDate.getFullYear() === currentDate.getFullYear() &&
              dayDate.getMonth() === currentDate.getMonth() &&
              dayDate.getDate() === currentDate.getDate();
            const isDayToday =
              dayDate.getFullYear() === today.getFullYear() &&
              dayDate.getMonth() === today.getMonth() &&
              dayDate.getDate() === today.getDate();

            return (
              <button
                key={formatToYmd(dayDate)}
                type="button"
                onClick={() => onDateChange(dayDate)}
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap min-w-[52px] ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : isDayToday
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 font-medium'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200/60'
                }`}
              >
                <span className="text-[11px] opacity-80">{DAY_NAMES[dayDate.getDay()]}</span>
                <span className="text-sm font-semibold tabular-nums">{dayDate.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
