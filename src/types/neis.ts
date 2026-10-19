/**
 * Types and Allergen mappings for NEIS School Meal System
 */

export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드 (예: B10)
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명 (예: 서울특별시교육청)
  SD_SCHUL_CODE: string;      // 표준학교코드 (예: 7010083)
  SCHUL_NM: string;           // 학교명 (예: 서울고등학교)
  SCHUL_KND_SC_NM: string;    // 학교종류명 (초등학교, 중학교, 고등학교, 특수학교)
  LCTN_SC_NM: string;         // 소재지명 (서울특별시, 경기도 등)
  ORG_RDNMA: string;          // 도로명주소
  HMPG_ADRES?: string | null; // 홈페이지
}

export interface MealDietRaw {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string;      // 1: 조식, 2: 중식, 3: 석식
  MMEAL_SC_NM: string;        // "조식", "중식", "석식"
  MLSV_YMD: string;          // YYYYMMDD
  MLSV_FGR?: number;          // 급식인원수
  DDISH_NM: string;           // 요리명 (예: "혼합잡곡밥 (5)<br/>된장찌개 (5.6)...")
  ORPLC_INFO?: string;        // 원산지정보
  CAL_INFO?: string;          // 칼로리정보 (예: "1118.3 Kcal")
  NTR_INFO?: string;          // 영양정보
}

export interface ParsedDish {
  raw: string;
  name: string;
  allergenIds: number[];
  allergenNames: string[];
}

export interface ParsedMeal {
  date: string;              // YYYYMMDD
  formattedDate: string;     // YYYY년 M월 D일
  dayOfWeek: string;         // '월' | '화' | '수' | '목' | '금' | '토' | '일'
  mealCode: string;          // 1, 2, 3
  mealName: string;          // 조식, 중식, 석식
  dishes: ParsedDish[];
  calories: string;
  nutrients: { name: string; amount: string }[];
  originInfo: string[];
  headCount?: number;
}

export const ALLERGEN_MAP: Record<number, { name: string; description: string }> = {
  1: { name: '난류', description: '달걀, 오리알, 메추리알 등 가금류의 알' },
  2: { name: '우유', description: '우유, 분유, 치즈, 버터, 유청 등' },
  3: { name: '메밀', description: '메밀국수, 메밀묵, 메밀가루 등' },
  4: { name: '땅콩', description: '땅콩버터, 땅콩가루, 견과류 혼합물 등' },
  5: { name: '대두', description: '콩, 두부, 된장, 간장, 두유 등' },
  6: { name: '밀', description: '밀가루, 빵, 면류, 과자, 튀김옷 등' },
  7: { name: '고등어', description: '고등어 및 가공식품' },
  8: { name: '게', description: '게, 게맛살, 꽂게탕 등' },
  9: { name: '새우', description: '새우젓, 건새우, 칵테일새우 등' },
  10: { name: '돼지고기', description: '삼겹살, 햄, 소시지, 돈가스 등' },
  11: { name: '복숭아', description: '생과, 복숭아 통조림, 주스 등' },
  12: { name: '토마토', description: '생토마토, 케첩, 토마토소스 등' },
  13: { name: '아황산류', description: '건조과일, 와인, 절임류 등 (이산화황 10mg/kg 이상)' },
  14: { name: '호두', description: '호두과자, 호두분말 등' },
  15: { name: '닭고기', description: '닭볶음탕, 치킨, 닭가슴살 등' },
  16: { name: '쇠고기', description: '한우, 육우, 소고기육수, 불고기 등' },
  17: { name: '오징어', description: '오징어, 진미채, 문어류 가공품' },
  18: { name: '조개류', description: '굴, 전복, 홍합, 바지락, 꼬막 등' },
  19: { name: '잣', description: '잣, 잣가루 등' },
};

// Preset popular schools so students can test immediately if they haven't searched yet
export const DEFAULT_PRESET_SCHOOLS: SchoolInfo[] = [
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010083',
    SCHUL_NM: '서울고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 서초구 효령로 197',
    HMPG_ADRES: 'http://seoul.sen.hs.kr',
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010057',
    SCHUL_NM: '경기고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 강남구 영동대로 643',
    HMPG_ADRES: 'http://kyunggi.sen.hs.kr',
  },
  {
    ATPT_OFCDC_SC_CODE: 'J10',
    ATPT_OFCDC_SC_NM: '경기도교육청',
    SD_SCHUL_CODE: '7530172',
    SCHUL_NM: '성남고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '경기도',
    ORG_RDNMA: '경기도 성남시 수정구 수정로 325',
    HMPG_ADRES: '',
  },
  {
    ATPT_OFCDC_SC_CODE: 'C10',
    ATPT_OFCDC_SC_NM: '부산광역시교육청',
    SD_SCHUL_CODE: '7150114',
    SCHUL_NM: '부산국제고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '부산광역시',
    ORG_RDNMA: '부산광역시 부산진구 백양관문로 105-70',
    HMPG_ADRES: 'http://gukje.hs.kr',
  },
];
