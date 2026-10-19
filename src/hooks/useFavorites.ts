import { useState, useEffect, useCallback } from 'react';
import { SchoolInfo, DEFAULT_PRESET_SCHOOLS } from '../types/neis';

const FAVORITES_KEY = 'yam_yam_lunch_favorites_v1';
const ACTIVE_SCHOOL_KEY = 'yam_yam_active_school_v1';
const ALLERGIES_KEY = 'yam_yam_user_allergies_v1';

export function useFavorites() {
  // Load favorites from localStorage
  const [favorites, setFavorites] = useState<SchoolInfo[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse favorites from storage', e);
    }
    // Default preset with 서울고등학교 as initial favorite
    return [DEFAULT_PRESET_SCHOOLS[0]];
  });

  // Current selected active school
  const [activeSchool, setActiveSchoolState] = useState<SchoolInfo>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_SCHOOL_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse active school', e);
    }
    return favorites[0] || DEFAULT_PRESET_SCHOOLS[0];
  });

  // User-selected allergens to watch for (allergen ids e.g. [1, 2, 9])
  const [userAllergies, setUserAllergies] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(ALLERGIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse allergies', e);
    }
    return [];
  });

  // Save favorites whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Save active school
  const setActiveSchool = useCallback((school: SchoolInfo) => {
    setActiveSchoolState(school);
    try {
      localStorage.setItem(ACTIVE_SCHOOL_KEY, JSON.stringify(school));
    } catch (e) {
      console.error('Failed to save active school', e);
    }
  }, []);

  // Save user allergies
  useEffect(() => {
    try {
      localStorage.setItem(ALLERGIES_KEY, JSON.stringify(userAllergies));
    } catch (e) {
      console.error('Failed to save allergies', e);
    }
  }, [userAllergies]);

  const isFavorite = useCallback(
    (schoolCode: string) => {
      return favorites.some((f) => f.SD_SCHUL_CODE === schoolCode);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (school: SchoolInfo) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.SD_SCHUL_CODE === school.SD_SCHUL_CODE);
        if (exists) {
          return prev.filter((f) => f.SD_SCHUL_CODE !== school.SD_SCHUL_CODE);
        } else {
          return [...prev, school];
        }
      });
    },
    []
  );

  const addFavorite = useCallback((school: SchoolInfo) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.SD_SCHUL_CODE === school.SD_SCHUL_CODE)) {
        return prev;
      }
      return [...prev, school];
    });
  }, []);

  const removeFavorite = useCallback((schoolCode: string) => {
    setFavorites((prev) => prev.filter((f) => f.SD_SCHUL_CODE !== schoolCode));
  }, []);

  const toggleAllergy = useCallback((allergenId: number) => {
    setUserAllergies((prev) => {
      if (prev.includes(allergenId)) {
        return prev.filter((id) => id !== allergenId);
      } else {
        return [...prev, allergenId];
      }
    });
  }, []);

  const clearAllergies = useCallback(() => {
    setUserAllergies([]);
  }, []);

  return {
    favorites,
    activeSchool,
    setActiveSchool,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    userAllergies,
    toggleAllergy,
    clearAllergies,
  };
}
