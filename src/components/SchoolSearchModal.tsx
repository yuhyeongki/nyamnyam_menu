import React, { useState, useEffect, useRef } from 'react';
import { Search, X, School, Star, MapPin, Loader2, Sparkles } from 'lucide-react';
import { SchoolInfo, DEFAULT_PRESET_SCHOOLS } from '../types/neis';
import { searchSchools } from '../services/neisApi';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
  isFavorite: (schoolCode: string) => boolean;
  onToggleFavorite: (school: SchoolInfo) => void;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSchool,
  isFavorite,
  onToggleFavorite,
}) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setResults([]);
      setSearched(false);
      setErrorMsg(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = keyword.trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg(null);
    setSearched(true);

    try {
      const data = await searchSchools(query);
      setResults(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('학교 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">학교 검색</h2>
              <p className="text-xs text-zinc-500">
                전국 초·중·고등학교의 급식 정보를 찾아보세요
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="p-6 border-b border-zinc-100">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="학교 이름을 입력하세요 (예: 서울고, 경기여고, 대전)"
              className="w-full pl-11 pr-24 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="absolute right-2 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '검색'
              )}
            </button>
          </div>
        </form>

        {/* Results / Presets Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Searched Results */}
          {searched ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500">
                  검색 결과 ({results.length}개)
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                  <span className="text-xs">나이스 API에서 검색 중...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((school) => {
                    const favorited = isFavorite(school.SD_SCHUL_CODE);

                    return (
                      <div
                        key={school.SD_SCHUL_CODE}
                        className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            onSelectSchool(school);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm text-zinc-900 group-hover:text-amber-700">
                              {school.SCHUL_NM}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {school.SCHUL_KND_SC_NM}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <span>{school.ATPT_OFCDC_SC_NM}</span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate flex items-center gap-1 max-w-xs">
                              <MapPin className="w-3 h-3 text-zinc-300 shrink-0" />
                              <span className="truncate">{school.ORG_RDNMA}</span>
                            </span>
                          </div>
                        </div>

                        {/* Favorite Star Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(school);
                          }}
                          className={`p-2 rounded-lg border transition-colors ${
                            favorited
                              ? 'bg-amber-50 border-amber-200 text-amber-500'
                              : 'bg-white border-zinc-200 text-zinc-300 hover:text-amber-500 hover:border-zinc-300'
                          }`}
                          title={favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              favorited ? 'fill-amber-400' : ''
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  검색 결과가 없습니다.
                  <p className="mt-1 text-zinc-500">
                    학교 명칭의 일부만 검색해보세요. (예: 서울, 대전, 경기)
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Presets & Recommendations */
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>추천 학교 둘러보기</span>
              </div>

              <div className="space-y-2">
                {DEFAULT_PRESET_SCHOOLS.map((school) => {
                  const favorited = isFavorite(school.SD_SCHUL_CODE);

                  return (
                    <div
                      key={school.SD_SCHUL_CODE}
                      className="p-3.5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/70 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          onSelectSchool(school);
                          onClose();
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-zinc-900 group-hover:text-amber-700">
                            {school.SCHUL_NM}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {school.SCHUL_KND_SC_NM}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {school.ATPT_OFCDC_SC_NM} · {school.ORG_RDNMA}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(school);
                        }}
                        className={`p-2 rounded-lg border transition-colors ${
                          favorited
                            ? 'bg-amber-50 border-amber-200 text-amber-500'
                            : 'bg-white border-zinc-200 text-zinc-300 hover:text-amber-500 hover:border-zinc-300'
                        }`}
                        title={favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorited ? 'fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
