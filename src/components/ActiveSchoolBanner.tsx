import React from 'react';
import { Star, MapPin, Search, ExternalLink } from 'lucide-react';
import { SchoolInfo } from '../types/neis';

interface ActiveSchoolBannerProps {
  school: SchoolInfo;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenSearch: () => void;
}

export const ActiveSchoolBanner: React.FC<ActiveSchoolBannerProps> = ({
  school,
  isFavorite,
  onToggleFavorite,
  onOpenSearch,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* School Info */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 truncate">
              {school.SCHUL_NM}
            </h1>
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                  : 'bg-white border-zinc-200 text-zinc-400 hover:text-amber-500 hover:border-zinc-300'
              }`}
              title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-zinc-500">
            <span>{school.ATPT_OFCDC_SC_NM}</span>
            <span aria-hidden="true" className="text-zinc-300">·</span>
            <span>{school.SCHUL_KND_SC_NM || '학교'}</span>
            <span aria-hidden="true" className="text-zinc-300">·</span>
            <span>{school.LCTN_SC_NM}</span>
            {school.ORG_RDNMA && (
              <>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <span className="flex items-center gap-1 text-zinc-500 truncate max-w-xs">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{school.ORG_RDNMA}</span>
                </span>
              </>
            )}
            {school.HMPG_ADRES && (
              <>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <a
                  href={school.HMPG_ADRES.startsWith('http') ? school.HMPG_ADRES : `http://${school.HMPG_ADRES}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-800 hover:underline"
                >
                  홈페이지
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Change School Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-zinc-500" />
            <span>다른 학교 찾기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
