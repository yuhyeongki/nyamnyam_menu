import React from 'react';
import { X, ShieldAlert, Check, RotateCcw } from 'lucide-react';
import { ALLERGEN_MAP } from '../types/neis';

interface AllergySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAllergies: number[];
  onToggleAllergy: (id: number) => void;
  onClearAllergies: () => void;
}

export const AllergySettingsModal: React.FC<AllergySettingsModalProps> = ({
  isOpen,
  onClose,
  userAllergies,
  onToggleAllergy,
  onClearAllergies,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                나의 알레르기 안심 설정
              </h2>
              <p className="text-xs text-zinc-500">
                주의해야 할 알레르기 성분을 선택하면 급식표에서 눈에 띄게 강조해드립니다
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>선택된 성분: <strong className="text-amber-600">{userAllergies.length}개</strong></span>
            {userAllergies.length > 0 && (
              <button
                type="button"
                onClick={onClearAllergies}
                className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>모두 해제</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(ALLERGEN_MAP).map(([idStr, info]) => {
              const id = parseInt(idStr, 10);
              const isSelected = userAllergies.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggleAllergy(id)}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-zinc-50/70 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-400 tabular-nums">
                        {id}.
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-amber-900' : 'text-zinc-800'
                        }`}
                      >
                        {info.name}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'border border-zinc-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
