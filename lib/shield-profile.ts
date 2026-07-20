/**
 * Личный щит-профиль — только localStorage, без сервера.
 */

export type ShieldLevelId = "novice" | "careful" | "defender" | "shield";

export type ShieldProfile = {
  checks: number;
  schemesCaught: number; // red + yellow
  updatedAt: string;
};

const KEY = "qalqan_shield_profile_v1";

export const LEVELS: {
  id: ShieldLevelId;
  minChecks: number;
  labelKey: string;
}[] = [
  { id: "novice", minChecks: 0, labelKey: "shield.levels.novice" },
  { id: "careful", minChecks: 3, labelKey: "shield.levels.careful" },
  { id: "defender", minChecks: 10, labelKey: "shield.levels.defender" },
  { id: "shield", minChecks: 25, labelKey: "shield.levels.shield" },
];

export function emptyProfile(): ShieldProfile {
  return { checks: 0, schemesCaught: 0, updatedAt: new Date().toISOString() };
}

export function loadProfile(): ShieldProfile {
  if (typeof window === "undefined") return emptyProfile();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProfile();
    const p = JSON.parse(raw) as ShieldProfile;
    return {
      checks: Number(p.checks) || 0,
      schemesCaught: Number(p.schemesCaught) || 0,
      updatedAt: p.updatedAt || new Date().toISOString(),
    };
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(p: ShieldProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function recordCheck(verdict: "red" | "yellow" | "green") {
  const p = loadProfile();
  p.checks += 1;
  if (verdict === "red" || verdict === "yellow") p.schemesCaught += 1;
  p.updatedAt = new Date().toISOString();
  saveProfile(p);
  return p;
}

export function resetProfile() {
  const p = emptyProfile();
  saveProfile(p);
  return p;
}

export function levelFor(checks: number) {
  let current = LEVELS[0];
  for (const lv of LEVELS) {
    if (checks >= lv.minChecks) current = lv;
  }
  const idx = LEVELS.findIndex((l) => l.id === current.id);
  const next = LEVELS[idx + 1] ?? null;
  const progressToNext = next
    ? Math.min(
        1,
        (checks - current.minChecks) /
          Math.max(1, next.minChecks - current.minChecks)
      )
    : 1;
  const remaining = next ? Math.max(0, next.minChecks - checks) : 0;
  return { current, next, progressToNext, remaining };
}
