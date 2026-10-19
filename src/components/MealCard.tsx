import React, { useState } from 'react';
import {
  Copy,
  Check,
  Flame,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Apple,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ALLERGEN_MAP, ParsedMeal } from '../types/neis';

interface MealCardProps {
  meal: ParsedMeal | null;
  schoolName: string;
  selectedDate: Date;
  selectedMealName: string;
  userAllergies: number[];
  onOpenAllergySettings: () => void;
  onJumpToNextWeekday?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  schoolName,
  selectedDate,
  selectedMealName,
  userAllergies,
  onOpenAllergySettings,
  onJumpToNextWeekday,
}) => {
  const [copied, setCopied] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);
  const [showOrigins, setShowOrigins] = useState(false);
  const [activeAllergenTooltip, setActiveAllergenTooltip] = useState<number | null>(null);

  // Copy meal text to clipboard
  const handleCopy = async () => {
    if (!meal) return;

    const dishLines = meal.dishes.map((d) => `• ${d.name}`).join('\n');
    const text = `[냠냠급식] ${schoolName}\n📅 ${meal.formattedDate} (${meal.dayOfWeek}) ${meal.mealName}\n\n${dishLines}\n\n🔥 ${meal.calories || '열량 정보 없음'}\n맛있는 급식 시간 되세요! 😋`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // If no meal data for this date/type
  if (!meal || meal.dishes.length === 0) {
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

    return (
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <Apple className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">
          {selectedMealName} 식단 정보가 없습니다
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
          {isWeekend
            ? '주말에는 급식이 제공되지 않습니다. 평일 식단을 확인해보세요!'
            : '방학, 재량휴업일이거나 학교에서 식단을 아직 등록하지 않았을 수 있습니다.'}
        </p>

        {isWeekend && onJumpToNextWeekday && (
          <button
            type="button"
            onClick={onJumpToNextWeekday}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>다가오는 월요일 급식 보기</span>
          </button>
        )}
      </div>
    );
  }

  // Check if any dish contains user's allergens
  const totalAllergyWarnings = meal.dishes.reduce((count, dish) => {
    const hasTrigger = dish.allergenIds.some((id) => userAllergies.includes(id));
    return hasTrigger ? count + 1 : count;
  }, 0);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Top Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              {meal.mealName}
            </span>
            <span className="text-sm font-medium text-zinc-500">
              {meal.formattedDate} ({meal.dayOfWeek}요일)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            오늘의 급식 메뉴
          </h2>
        </div>

        {/* Right side: Calories & Copy CTA */}
        <div className="flex items-center gap-3">
          {meal.calories && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200/70 rounded-xl text-zinc-700">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold tabular-nums">{meal.calories}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all flex items-center gap-1.5 min-h-[40px] ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
            }`}
            title="식단표 복사하여 카카오톡이나 SNS에 공유하기"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-zinc-500" />
                <span>식단 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Allergy Notification Banner if triggers found */}
      {totalAllergyWarnings > 0 && (
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">알레르기 주의 알림: </span>
            <span>
              설정하신 알레르기 유발 식품이 포함된 메뉴가{' '}
              <strong className="underline underline-offset-2">{totalAllergyWarnings}개</strong>{' '}
              있습니다. 식사 전 확인해주세요!
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenAllergySettings}
            className="text-xs text-amber-800 hover:text-amber-950 font-medium underline shrink-0"
          >
            설정 변경
          </button>
        </div>
      )}

      {/* Dishes List */}
      <div className="py-6 space-y-3">
        {meal.dishes.map((dish, idx) => {
          const userTriggerAllergens = dish.allergenIds.filter((id) =>
            userAllergies.includes(id)
          );
          const hasUserAllergy = userTriggerAllergens.length > 0;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                hasUserAllergy
                  ? 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-200'
                  : 'bg-zinc-50/50 hover:bg-zinc-50 border-zinc-200/70'
              }`}
            >
              {/* Dish Name */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-white border border-zinc-200 text-zinc-500 text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <span className="text-base sm:text-lg font-semibold text-zinc-900">
                  {dish.name}
                </span>

                {hasUserAllergy && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>
                      {userTriggerAllergens
                        .map((id) => ALLERGEN_MAP[id]?.name)
                        .join(', ')}{' '}
                      주의
                    </span>
                  </span>
                )}
              </div>

              {/* Allergen Numbers */}
              {dish.allergenIds.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pl-9 sm:pl-0">
                  <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">알레르기:</span>
                  {dish.allergenIds.map((id) => {
                    const isUserTrigger = userAllergies.includes(id);
                    const allergenInfo = ALLERGEN_MAP[id];

                    return (
                      <div key={id} className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAllergenTooltip(
                              activeAllergenTooltip === id ? null : id
                            )
                          }
                          className={`text-xs px-1.5 py-0.5 rounded font-medium tabular-nums transition-colors ${
                            isUserTrigger
                              ? 'bg-amber-200 text-amber-900 font-bold'
                              : 'bg-zinc-200/70 text-zinc-600 hover:bg-zinc-300'
                          }`}
                          title={`${id}번: ${allergenInfo?.name || '기타'}`}
                        >
                          {id}
                        </button>

                        {/* Mobile tooltip on tap */}
                        {activeAllergenTooltip === id && allergenInfo && (
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-20 w-44 p-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg pointer-events-none">
                            <p className="font-bold">
                              {id}번 {allergenInfo.name}
                            </p>
                            <p className="text-[11px] text-zinc-300">
                              {allergenInfo.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Accordions: Nutrients & Origins */}
      <div className="pt-4 border-t border-zinc-100 space-y-3">
        {/* Nutrients Accordion */}
        {meal.nutrients.length > 0 && (
          <div className="border border-zinc-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowNutrients(!showNutrients)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/70 hover:bg-zinc-50 text-left text-xs sm:text-sm font-semibold text-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-400" />
                <span>상세 영양성분 정보 ({meal.nutrients.length}개 항목)</span>
              </div>
              {showNutrients ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showNutrients && (
              <div className="p-4 bg-white grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-zinc-600">
                {meal.nutrients.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100"
                  >
                    <span className="text-zinc-500">{n.name}</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {n.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Origins Accordion */}
        {meal.originInfo.length > 0 && (
          <div className="border border-zinc-200/70 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOrigins(!showOrigins)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/70 hover:bg-zinc-50 text-left text-xs sm:text-sm font-semibold text-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>식재료 원산지 정보</span>
              </div>
              {showOrigins ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showOrigins && (
              <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                {meal.originInfo.map((origin, i) => (
                  <div key={i} className="p-2 rounded bg-zinc-50 border border-zinc-100">
                    {origin}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
