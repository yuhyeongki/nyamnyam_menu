import React, { useState, useEffect, useCallback } from 'react';
import { useFavorites } from './hooks/useFavorites';
import { fetchMeals, formatToYmd, getSchoolWeekDays } from './services/neisApi';
import { ParsedMeal, SchoolInfo } from './types/neis';
import { Header } from './components/Header';
import { FavoritesBar } from './components/FavoritesBar';
import { ActiveSchoolBanner } from './components/ActiveSchoolBanner';
import { DateNavigator } from './components/DateNavigator';
import { MealTypeTabs } from './components/MealTypeTabs';
import { MealCard } from './components/MealCard';
import { WeeklyMealView } from './components/WeeklyMealView';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { AllergySettingsModal } from './components/AllergySettingsModal';
import { AllergenGuideModal } from './components/AllergenGuideModal';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    favorites,
    activeSchool,
    setActiveSchool,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    userAllergies,
    toggleAllergy,
    clearAllergies,
  } = useFavorites();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'daily' | 'weekly'>('daily');
  const [selectedMealCode, setSelectedMealCode] = useState<string>('2'); // Default to 중식 (Lunch)

  // Data states
  const [dailyMeals, setDailyMeals] = useState<ParsedMeal[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<ParsedMeal[]>([]);
  const [loadingDaily, setLoadingDaily] = useState<boolean>(false);
  const [loadingWeekly, setLoadingWeekly] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAllergySettingsOpen, setIsAllergySettingsOpen] = useState(false);
  const [isAllergenGuideOpen, setIsAllergenGuideOpen] = useState(false);

  // Fetch daily meals when activeSchool or currentDate changes
  const loadDailyMeals = useCallback(async () => {
    if (!activeSchool) return;

    setLoadingDaily(true);
    setErrorMessage(null);
    const ymd = formatToYmd(currentDate);

    try {
      const meals = await fetchMeals(
        activeSchool.ATPT_OFCDC_SC_CODE,
        activeSchool.SD_SCHUL_CODE,
        ymd,
        ymd
      );
      setDailyMeals(meals);

      // If current selected meal code has no data, but another does, auto switch
      if (meals.length > 0 && !meals.some((m) => m.mealCode === selectedMealCode)) {
        // Prefer lunch (2), else first
        const lunch = meals.find((m) => m.mealCode === '2');
        setSelectedMealCode(lunch ? '2' : meals[0].mealCode);
      }
    } catch (err) {
      console.error('Failed to load daily meals:', err);
      setDailyMeals([]);
      setErrorMessage('나이스 급식 정보를 불러오지 못했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setLoadingDaily(false);
    }
  }, [activeSchool, currentDate, selectedMealCode]);

  // Fetch weekly meals when activeSchool or currentDate changes and view is weekly
  const loadWeeklyMeals = useCallback(async () => {
    if (!activeSchool) return;

    setLoadingWeekly(true);
    const weekDays = getSchoolWeekDays(currentDate);
    const fromYmd = formatToYmd(weekDays[0]);
    const toYmd = formatToYmd(weekDays[4]);

    try {
      const meals = await fetchMeals(
        activeSchool.ATPT_OFCDC_SC_CODE,
        activeSchool.SD_SCHUL_CODE,
        fromYmd,
        toYmd
      );
      setWeeklyMeals(meals);
    } catch (err) {
      console.error('Failed to load weekly meals:', err);
      setWeeklyMeals([]);
    } finally {
      setLoadingWeekly(false);
    }
  }, [activeSchool, currentDate]);

  useEffect(() => {
    loadDailyMeals();
  }, [activeSchool, currentDate]);

  useEffect(() => {
    if (currentView === 'weekly') {
      loadWeeklyMeals();
    }
  }, [currentView, activeSchool, currentDate, loadWeeklyMeals]);

  // Jump to upcoming Monday (e.g. from weekend)
  const handleJumpToNextWeekday = () => {
    const next = new Date(currentDate);
    const day = next.getDay();
    if (day === 6) {
      // Saturday -> Monday
      next.setDate(next.getDate() + 2);
    } else if (day === 0) {
      // Sunday -> Monday
      next.setDate(next.getDate() + 1);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleSelectDateAndSwitchToDaily = (date: Date) => {
    setCurrentDate(date);
    setCurrentView('daily');
  };

  const activeDailyMeal = dailyMeals.find((m) => m.mealCode === selectedMealCode) || null;
  const mealNameMap: Record<string, string> = {
    '1': '조식(아침)',
    '2': '중식(점심)',
    '3': '석식(저녁)',
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAllergySettings={() => setIsAllergySettingsOpen(true)}
        onOpenAllergenGuide={() => setIsAllergenGuideOpen(true)}
        favoritesCount={favorites.length}
        userAllergiesCount={userAllergies.length}
      />

      {/* Favorites Quick Bar */}
      <FavoritesBar
        favorites={favorites}
        activeSchool={activeSchool}
        onSelectSchool={(school) => setActiveSchool(school)}
        onRemoveFavorite={removeFavorite}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeSchool ? (
          <>
            {/* Active School Banner */}
            <ActiveSchoolBanner
              school={activeSchool}
              isFavorite={isFavorite(activeSchool.SD_SCHUL_CODE)}
              onToggleFavorite={() => toggleFavorite(activeSchool)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => loadDailyMeals()}
                  className="flex items-center gap-1 font-semibold text-red-800 hover:underline shrink-0 ml-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>다시 시도</span>
                </button>
              </div>
            )}

            {/* Daily View */}
            {currentView === 'daily' && (
              <div>
                {/* Date Navigator */}
                <DateNavigator
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />

                {/* Meal Type Tabs (Breakfast / Lunch / Dinner) */}
                <MealTypeTabs
                  selectedMealCode={selectedMealCode}
                  onSelectMealCode={setSelectedMealCode}
                  availableMeals={dailyMeals}
                />

                {/* Loading state or Meal Card */}
                {loadingDaily ? (
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                    <p className="text-sm font-medium text-zinc-600">
                      나이스에서 {activeSchool.SCHUL_NM} 급식 정보를 가져오는 중...
                    </p>
                  </div>
                ) : (
                  <MealCard
                    meal={activeDailyMeal}
                    schoolName={activeSchool.SCHUL_NM}
                    selectedDate={currentDate}
                    selectedMealName={mealNameMap[selectedMealCode] || '급식'}
                    userAllergies={userAllergies}
                    onOpenAllergySettings={() => setIsAllergySettingsOpen(true)}
                    onJumpToNextWeekday={handleJumpToNextWeekday}
                  />
                )}
              </div>
            )}

            {/* Weekly View */}
            {currentView === 'weekly' && (
              <WeeklyMealView
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                weeklyMeals={weeklyMeals}
                userAllergies={userAllergies}
                onSelectDateAndSwitchToDaily={handleSelectDateAndSwitchToDaily}
                isLoading={loadingWeekly}
              />
            )}
          </>
        ) : (
          /* Empty Active School State */
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              확인할 학교를 선택해주세요
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              검색을 통해 학교를 찾아 즐겨찾기하고 매일 간편하게 식단표를 확인하세요.
            </p>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="px-5 py-3 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all shadow-xs"
            >
              학교 검색하기
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 py-6 px-4 bg-white text-center text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-zinc-500">
            냠냠급식 · 간편한 학교 급식 식단표
          </p>
          <div className="flex items-center gap-3">
            <span>데이터 제공: 교육부 나이스(NEIS) 대국민서비스 OPEN API</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsAllergenGuideOpen(true)}
              className="hover:text-zinc-700 underline"
            >
              알레르기 안내
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SchoolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSchool={(school) => {
          setActiveSchool(school);
          // Also automatically add to favorites if none exist
          if (favorites.length === 0) {
            toggleFavorite(school);
          }
        }}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <AllergySettingsModal
        isOpen={isAllergySettingsOpen}
        onClose={() => setIsAllergySettingsOpen(false)}
        userAllergies={userAllergies}
        onToggleAllergy={toggleAllergy}
        onClearAllergies={clearAllergies}
      />

      <AllergenGuideModal
        isOpen={isAllergenGuideOpen}
        onClose={() => setIsAllergenGuideOpen(false)}
      />
    </div>
  );
}
