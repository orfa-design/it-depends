import { kv } from '@vercel/kv';
import { STEPS, CALIBRATION_CARDS, type Step, type CalibrationCard } from './data-v2';
import { DEFAULT_COPY, type AppCopy } from './copy';

// Robust safety wrapper to prevent app crashes if KV environment variables are missing
const isKvAvailable = () => {
  return typeof process !== 'undefined' && 
         process.env.KV_REST_API_URL !== undefined && 
         process.env.KV_REST_API_TOKEN !== undefined;
};

// In-memory cache fallback for development / local setups without KV credentials
const localCache: Record<string, any> = {};

export async function getSteps(): Promise<Step[]> {
  try {
    if (isKvAvailable()) {
      const data = await kv.get<Step[]>('steps');
      if (data && Array.isArray(data)) {
        return data;
      }
    } else if (localCache['steps']) {
      return localCache['steps'];
    }
  } catch (err) {
    console.error('Failed to get steps from KV:', err);
  }
  return STEPS;
}

export async function saveSteps(steps: Step[]): Promise<boolean> {
  try {
    localCache['steps'] = steps;
    if (isKvAvailable()) {
      await kv.set('steps', steps);
      return true;
    }
  } catch (err) {
    console.error('Failed to save steps to KV:', err);
  }
  return false;
}

export async function getCalibration(): Promise<CalibrationCard[]> {
  try {
    if (isKvAvailable()) {
      const data = await kv.get<CalibrationCard[]>('calibration');
      if (data && Array.isArray(data)) {
        return data;
      }
    } else if (localCache['calibration']) {
      return localCache['calibration'];
    }
  } catch (err) {
    console.error('Failed to get calibration cards from KV:', err);
  }
  return CALIBRATION_CARDS;
}

export async function saveCalibration(cards: CalibrationCard[]): Promise<boolean> {
  try {
    localCache['calibration'] = cards;
    if (isKvAvailable()) {
      await kv.set('calibration', cards);
      return true;
    }
  } catch (err) {
    console.error('Failed to save calibration cards to KV:', err);
  }
  return false;
}

export async function getCopy(): Promise<AppCopy> {
  try {
    if (isKvAvailable()) {
      const data = await kv.get<AppCopy>('copy');
      if (data && typeof data === 'object') {
        // Deep merge fallback keys to ensure new copy items don't break if KV is stale
        return {
          global: { ...DEFAULT_COPY.global, ...data.global },
          calibrate: { ...DEFAULT_COPY.calibrate, ...data.calibrate },
          gallery: { ...DEFAULT_COPY.gallery, ...data.gallery },
          map: { ...DEFAULT_COPY.map, ...data.map },
          step: { ...DEFAULT_COPY.step, ...data.step },
          done: { ...DEFAULT_COPY.done, ...data.done },
          progress: { ...DEFAULT_COPY.progress, ...data.progress },
        };
      }
    } else if (localCache['copy']) {
      return localCache['copy'];
    }
  } catch (err) {
    console.error('Failed to get copy from KV:', err);
  }
  return DEFAULT_COPY;
}

export async function saveCopy(copy: AppCopy): Promise<boolean> {
  try {
    localCache['copy'] = copy;
    if (isKvAvailable()) {
      await kv.set('copy', copy);
      return true;
    }
  } catch (err) {
    console.error('Failed to save copy to KV:', err);
  }
  return false;
}

export interface UserProgress {
  overrides: Record<string, 'inprogress' | 'done'>;
  results: Record<string, string>;
  calibrationReactions?: number[];
  notInterested?: Record<string, boolean>;
}

export async function getUserProgress(username: string): Promise<UserProgress> {
  const defaultProgress: UserProgress = { overrides: {}, results: {}, calibrationReactions: [], notInterested: {} };
  if (!username) return defaultProgress;
  
  const key = `user:${username.toLowerCase().trim()}`;
  try {
    if (isKvAvailable()) {
      const data = await kv.get<UserProgress>(key);
      if (data) {
        return {
          overrides: data.overrides || {},
          results: data.results || {},
          calibrationReactions: data.calibrationReactions || [],
          notInterested: data.notInterested || {},
        };
      }
    } else if (localCache[key]) {
      return localCache[key];
    }
  } catch (err) {
    console.error(`Failed to get user progress for ${username} from KV:`, err);
  }
  return defaultProgress;
}

export async function saveUserProgress(username: string, progress: UserProgress): Promise<boolean> {
  if (!username) return false;
  
  const key = `user:${username.toLowerCase().trim()}`;
  try {
    localCache[key] = progress;
    if (isKvAvailable()) {
      await kv.set(key, progress);
      return true;
    }
  } catch (err) {
    console.error(`Failed to save user progress for ${username} to KV:`, err);
  }
  return false;
}
