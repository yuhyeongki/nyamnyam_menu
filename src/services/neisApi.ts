import { ALLERGEN_MAP, MealDietRaw, ParsedDish, ParsedMeal, SchoolInfo } from '../types/neis';

const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

/**
 * Searches for schools across South Korea by school name keyword
 */
export async function searchSchools(keyword: string): Promise<SchoolInfo[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const url = `${NEIS_BASE_URL}/schoolInfo?Type=json&pIndex=1&pSize=50&SCHUL_NM=${encodeURIComponent(trimmed)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`학교 정보 조회 실패 (상태 코드: ${res.status})`);
    }

    const data = await res.json();

    // Check if result is empty or not found
    if (data.RESULT && data.RESULT.CODE === 'INFO-200') {
      return [];
    }

    if (data.schoolInfo && data.schoolInfo[1]?.row) {
      return data.schoolInfo[1].row as SchoolInfo[];
    }

    return [];
  } catch (err) {
    console.error('Error fetching schools from NEIS API:', err);
    throw err;
  }
}

/**
 * Parses raw dishes string containing <br/> and allergen numbers like (1.2.5.6)
 */
export function parseDishes(rawDishText: string): ParsedDish[] {
  if (!rawDishText) return [];

  const rawLines = rawDishText.split(/<br\s*\/?>/i);

  return rawLines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Find allergen pattern e.g. "(1.2.5.6)" or "(1,2,5)" or "(5.)"
      const match = line.match(/\(([\d.,\s]+)\)$/);
      let name = line;
      let allergenIds: number[] = [];

      if (match) {
        name = line.substring(0, match.index).trim();
        const numStrings = match[1].split(/[.,]/);
        allergenIds = numStrings
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n) && ALLERGEN_MAP[n] !== undefined);
      }

      // Clean special suffixes like * or @
      name = name.replace(/[*#@]/g, '').trim();

      const allergenNames = allergenIds.map((id) => ALLERGEN_MAP[id].name);

      return {
        raw: line,
        name,
        allergenIds,
        allergenNames,
      };
    });
}

/**
 * Parses nutrient info text into structured key-value pairs
 */
export function parseNutrients(rawNutrientText?: string): { name: string; amount: string }[] {
  if (!rawNutrientText) return [];

  const lines = rawNutrientText.split(/<br\s*\/?>/i);
  const result: { name: string; amount: string }[] = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const parts = clean.split(':');
    if (parts.length >= 2) {
      result.push({
        name: parts[0].trim(),
        amount: parts.slice(1).join(':').trim(),
      });
    }
  }

  return result;
}

/**
 * Parses origin of food items
 */
export function parseOriginInfo(rawOriginText?: string): string[] {
  if (!rawOriginText) return [];

  return rawOriginText
    .split(/<br\s*\/?>/i)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !item.startsWith('비고 :'));
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Converts YYYYMMDD to human Korean format and day name
 */
export function parseDateString(ymd: string): { formatted: string; dayOfWeek: string } {
  if (ymd.length !== 8) {
    return { formatted: ymd, dayOfWeek: '' };
  }

  const year = ymd.substring(0, 4);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(parseInt(year, 10), month - 1, day);
  const dayOfWeek = DAY_NAMES[dateObj.getDay()] || '';

  return {
    formatted: `${year}년 ${month}월 ${day}일`,
    dayOfWeek,
  };
}

/**
 * Fetches meals for a given school and date range
 */
export async function fetchMeals(
  officeCode: string,
  schoolCode: string,
  fromYmd: string,
  toYmd: string
): Promise<ParsedMeal[]> {
  const url = `${NEIS_BASE_URL}/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_FROM_YMD=${fromYmd}&MLSV_TO_YMD=${toYmd}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`급식 정보 조회 실패 (상태 코드: ${res.status})`);
    }

    const data = await res.json();

    // Check for "No data" result
    if (data.RESULT && data.RESULT.CODE === 'INFO-200') {
      return [];
    }

    if (!data.mealServiceDietInfo || !data.mealServiceDietInfo[1]?.row) {
      return [];
    }

    const rows: MealDietRaw[] = data.mealServiceDietInfo[1].row;

    return rows.map((raw) => {
      const { formatted, dayOfWeek } = parseDateString(raw.MLSV_YMD);
      return {
        date: raw.MLSV_YMD,
        formattedDate: formatted,
        dayOfWeek,
        mealCode: raw.MMEAL_SC_CODE,
        mealName: raw.MMEAL_SC_NM || (raw.MMEAL_SC_CODE === '1' ? '조식' : raw.MMEAL_SC_CODE === '2' ? '중식' : '석식'),
        dishes: parseDishes(raw.DDISH_NM),
        calories: raw.CAL_INFO || '',
        nutrients: parseNutrients(raw.NTR_INFO),
        originInfo: parseOriginInfo(raw.ORPLC_INFO),
        headCount: raw.MLSV_FGR,
      };
    });
  } catch (err) {
    console.error('Error fetching meals from NEIS API:', err);
    throw err;
  }
}

/**
 * Helper to format Date to YYYYMMDD
 */
export function formatToYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Returns the Monday to Friday dates for the given date's week
 */
export function getSchoolWeekDays(date: Date): Date[] {
  const current = new Date(date);
  const day = current.getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
  // Distance to Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const weekDays: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDays.push(d);
  }
  return weekDays;
}
