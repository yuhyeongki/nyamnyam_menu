import React from 'react';
import { X, HelpCircle, BookOpen } from 'lucide-react';
import { ALLERGEN_MAP } from '../types/neis';

interface AllergenGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllergenGuideModal: React.FC<AllergenGuideModalProps> = ({
  isOpen,
  onClose,
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
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                학교급식 알레르기 유발 식품 표시제 안내
              </h2>
              <p className="text-xs text-zinc-500">
                교육부 및 식품의약품안전처 고시 19종 알레르기 번호 기준
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2">
          {Object.entries(ALLERGEN_MAP).map(([idStr, info]) => {
            const id = parseInt(idStr, 10);
            return (
              <div
                key={id}
                className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-md bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 mb-0.5">
                    {info.name}
                  </div>
                  <div className="text-xs text-zinc-500 leading-relaxed">
                    {info.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
