const API_BASE_URL = 'https://scrolln-t-production.up.railway.app/api';
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Universal fetch wrapper with AbortController timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Safe JSON request executor with HTTP status verification
 */
async function safeFetchJson(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<any> {
  const res = await fetchWithTimeout(url, options, timeoutMs);
  if (!res.ok) {
    let errBody: any = null;
    try {
      errBody = await res.json();
    } catch (e) {}
    return { error: errBody?.error || `HTTP error ${res.status}`, status: res.status };
  }
  if (res.status === 204) {
    return { success: true };
  }
  const text = await res.text();
  if (!text || text.trim() === '') {
    return { success: true };
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return { success: true, text };
  }
}

// User
export async function registerUser(userId: string, displayName?: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, userId, displayName }),
    });
  } catch (e) {
    console.warn('registerUser fallback:', e);
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`);
  } catch (e) {
    console.warn('fetchUserProfile fallback:', e);
    return null;
  }
}

export async function syncUserState(userData: any): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userData.userId || userData.id, ...userData }),
    });
  } catch (e) {
    console.warn('API syncUserState fallback (offline mode):', e);
    return null;
  }
}

// Real-time Heartbeat & Focus Status
export async function sendHeartbeat(data: {
  userId: string;
  totalXP?: number;
  currentStreak?: number;
  isFocusing?: boolean;
  isSubscribed?: boolean;
}): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, 6000);
  } catch (e) {
    return null;
  }
}

export async function setFocusStatus(
  userId: string,
  isFocusing: boolean,
  squadCode?: string,
  durationMinutes?: number
): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/focus/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isFocusing, squadCode, durationMinutes }),
    }, 6000);
  } catch (e) {
    return null;
  }
}

// Sessions
export async function createSession(sessionData: any): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
  } catch (e) {
    console.warn('API createSession fallback (offline mode):', e);
    return null;
  }
}

export async function fetchUserSessions(userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/sessions/${encodeURIComponent(userId)}`);
  } catch (e) {
    console.warn('fetchUserSessions fallback:', e);
    return null;
  }
}

// Squads
export async function createSquad(userId: string, name?: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/squads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name }),
    });
  } catch (e) {
    console.warn('createSquad fallback:', e);
    return null;
  }
}

export async function joinSquad(squadCode: string, userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/squads/${encodeURIComponent(squadCode.toUpperCase())}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  } catch (e) {
    console.warn('joinSquad fallback:', e);
    return null;
  }
}

export async function fetchSquadData(squadCode: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/squads/${encodeURIComponent(squadCode.toUpperCase())}`);
  } catch (e) {
    console.warn('fetchSquadData fallback:', e);
    return null;
  }
}

export async function fetchLeaderboard(squadCode: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/leaderboard/${encodeURIComponent(squadCode.toUpperCase())}`);
  } catch (e) {
    console.warn('fetchLeaderboard fallback:', e);
    return null;
  }
}

// Challenges
export async function fetchChallenges(): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/challenges`);
  } catch (e) {
    console.warn('fetchChallenges fallback:', e);
    return null;
  }
}

export async function updateChallengeProgress(challengeId: string, userId: string, progress: number, completed?: boolean): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/challenges/${encodeURIComponent(challengeId)}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, progress, completed }),
    });
  } catch (e) {
    console.warn('updateChallengeProgress fallback:', e);
    return null;
  }
}

// Settings
export async function updateSettings(userId: string, settings: any): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, settings }),
    });
  } catch (e) {
    console.warn('updateSettings fallback:', e);
    return null;
  }
}

export async function fetchSettings(userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/settings/${encodeURIComponent(userId)}`);
  } catch (e) {
    console.warn('fetchSettings fallback:', e);
    return null;
  }
}

// Streak Freeze
export async function useStreakFreeze(userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/streak-freeze/use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  } catch (e) {
    console.warn('useStreakFreeze fallback:', e);
    return null;
  }
}

export async function fetchStreakFreezes(userId: string): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/streak-freeze/${encodeURIComponent(userId)}`);
  } catch (e) {
    console.warn('fetchStreakFreezes fallback:', e);
    return null;
  }
}

// Shop
export async function fetchProducts(): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/shop`);
  } catch (e) {
    console.warn('fetchProducts fallback:', e);
    return null;
  }
}

// Events/Analytics
export async function logEvent(eventData: any): Promise<any> {
  try {
    return await safeFetchJson(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
  } catch (e) {
    console.warn('logEvent fallback:', e);
    return null;
  }
}
