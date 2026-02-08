"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  UNIT_IDS,
  getUnitUtilities,
  setUnitUtilities,
  resetAllUtilities,
  resetUnitUtilities,
} from "./residence-data";

const STORAGE_KEY = "tambo.credentials";
const PROFILE_STORAGE_KEY = "tambo.profiles";
const PROVISION_FLAG_KEY = "tambo.provisioned";
const DATA_VERSION_KEY = "tambo.dataVersion";
const DATA_VERSION = "2";

const DEFAULT_CREDENTIALS = [
  { username: "admin", password: "Admin@123", role: "admin" },
  { username: "unit101", password: "Unit@101", role: "user", unit: "101" },
  { username: "unit102", password: "Unit@102", role: "user", unit: "102" },
  { username: "unit201", password: "Unit@201", role: "user", unit: "201" },
  { username: "unit202", password: "Unit@202", role: "user", unit: "202" },
  { username: "unit301", password: "Unit@301", role: "user", unit: "301" },
  { username: "unit302", password: "Unit@302", role: "user", unit: "302" },
  { username: "unit401", password: "Unit@401", role: "user", unit: "401" },
  { username: "unit402", password: "Unit@402", role: "user", unit: "402" },
  { username: "unit501", password: "Unit@501", role: "user", unit: "501" },
  { username: "unit502", password: "Unit@502", role: "user", unit: "502" },
];

const DEFAULT_PROFILES = UNIT_IDS.reduce((acc, unitId) => {
  acc[unitId] = { name: "", mobile: "", email: "" };
  return acc;
}, {});

const isProfileAssigned = (profile) =>
  Boolean(profile?.name || profile?.mobile || profile?.email);

const isUtilitiesEmpty = (utilities) => {
  if (!utilities) return true;
  return Object.values(utilities).every((value) => Number(value) === 0);
};

const isUnitVacant = (profile, utilities) =>
  !isProfileAssigned(profile) && isUtilitiesEmpty(utilities);

const ensureDataVersion = () => {
  if (typeof window === "undefined") return;
  const current = window.localStorage.getItem(DATA_VERSION_KEY);
  if (current === DATA_VERSION) return;
  window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
  window.localStorage.setItem(PROVISION_FLAG_KEY, "false");
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  window.localStorage.removeItem("tambo.utilities");
};

const randomBetween = (min, max, decimals = 1) => {
  const value = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_CREDENTIALS;
    ensureDataVersion();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_CREDENTIALS;
      const parsed = JSON.parse(raw);
      const hasUnitUsers = Array.isArray(parsed)
        && parsed.some((entry) => typeof entry?.username === "string" && entry.username.startsWith("unit"));
      if (!hasUnitUsers) {
        return DEFAULT_CREDENTIALS;
      }
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CREDENTIALS;
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  });
  const [profiles, setProfiles] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_PROFILES;
    ensureDataVersion();
    try {
      const provisioned = window.localStorage.getItem(PROVISION_FLAG_KEY) === "true";
      if (!provisioned) {
        return DEFAULT_PROFILES;
      }
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return DEFAULT_PROFILES;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILES, ...(parsed || {}) };
    } catch {
      return DEFAULT_PROFILES;
    }
  });
  const [isProvisioned, setIsProvisioned] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(PROVISION_FLAG_KEY) === "true";
  });
  const [user, setUser] = useState(null);
  const [isReady] = useState(true);
  const activeProfiles = useMemo(
    () => (isProvisioned ? profiles : DEFAULT_PROFILES),
    [profiles, isProvisioned],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isProvisioned) return;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles, isProvisioned]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isProvisioned) {
      window.localStorage.setItem(PROVISION_FLAG_KEY, "false");
      resetAllUtilities();
    }
  }, [isProvisioned]);

  const login = useCallback((username, password) => {
    const rawUsername = (username || "").trim();
    const rawPassword = (password || "").trim();
    const aliasUsername = rawUsername.replace(/^user/i, "unit");
    const aliasPassword = rawPassword.replace(/^User@/i, "Unit@");

    const match = credentials.find(
      (entry) =>
        (entry.username === rawUsername && entry.password === rawPassword) ||
        (entry.username === aliasUsername && entry.password === aliasPassword),
    );

    if (!match) {
      return { ok: false, message: "Invalid credentials" };
    }

    const nextUser = {
      username: match.username,
      role: match.role,
      unit: match.unit || null,
    };

    setUser(nextUser);
    return { ok: true, user: nextUser };
  }, [credentials]);

  const addUser = useCallback(
    ({ username, password, profile, unitId }) => {
      const normalizedUsername = (username || "").trim();
      const normalizedPassword = (password || "").trim();
      const nextProfile = {
        name: (profile?.name || "").trim(),
        mobile: (profile?.mobile || "").trim(),
        email: (profile?.email || "").trim(),
      };

      if (!normalizedUsername || !normalizedPassword) {
        return { ok: false, message: "Username and password are required" };
      }

      if (!nextProfile.name || !nextProfile.mobile || !nextProfile.email) {
        return { ok: false, message: "Profile name, mobile, and email are required" };
      }

      const availableUnits = UNIT_IDS.filter((id) =>
        isUnitVacant(activeProfiles[id], getUnitUtilities(id)),
      );

      if (availableUnits.length === 0) {
        return { ok: false, message: "No units available" };
      }

      if (unitId && !availableUnits.includes(unitId)) {
        return { ok: false, message: `Unit ${unitId} is already assigned` };
      }

      const targetUnit = unitId && availableUnits.includes(unitId)
        ? unitId
        : availableUnits[Math.floor(Math.random() * availableUnits.length)];

      const autoUsername = `unit${targetUnit}`;
      const isAutoUsername = normalizedUsername === autoUsername;
      const usernameExists = credentials.some(
        (entry) => entry.username === normalizedUsername,
      );

      if (usernameExists && !isAutoUsername) {
        return { ok: false, message: "Username already exists" };
      }

      const nextEntry = {
        username: isAutoUsername ? autoUsername : normalizedUsername,
        password: normalizedPassword,
        role: "user",
        unit: targetUnit,
      };

      setCredentials((prev) => [
        ...prev.filter(
          (entry) => !(entry.role === "user" && entry.unit === targetUnit),
        ),
        nextEntry,
      ]);
      setProfiles((prev) => ({
        ...prev,
        [targetUnit]: nextProfile,
      }));
      setIsProvisioned(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PROVISION_FLAG_KEY, "true");
      }
      setUnitUtilities(targetUnit, {
        electricityKwh: randomBetween(8.5, 20.5, 1),
        waterLitres: randomBetween(380, 520, 0),
        gasM3: randomBetween(0.4, 0.9, 2),
        solarKwh: randomBetween(1.6, 2.8, 2),
      });
      return { ok: true, user: nextEntry };
    },
    [credentials, activeProfiles],
  );

  const removeUserFromUnit = useCallback(
    (unitId) => {
      if (!unitId) {
        return { ok: false, message: "Unit is required" };
      }
      const target = String(unitId);
      const hasUser = credentials.some(
        (entry) => entry.role === "user" && entry.unit === target,
      );
      if (!hasUser) {
        return { ok: false, message: "No user assigned to this unit" };
      }

      setCredentials((prev) => {
        const filtered = prev.filter(
          (entry) => !(entry.role === "user" && entry.unit === target),
        );
        const placeholderExists = filtered.some(
          (entry) => entry.username === `unit${target}`,
        );
        if (placeholderExists) {
          return filtered;
        }
        return [
          ...filtered,
          {
            username: `unit${target}`,
            password: `Unit@${target}`,
            role: "user",
            unit: target,
          },
        ];
      });
      setProfiles((prev) => {
        const nextProfiles = {
          ...prev,
          [target]: { name: "", mobile: "", email: "" },
        };
        const hasAssigned = Object.values(nextProfiles).some(isProfileAssigned);
        if (!hasAssigned) {
          setIsProvisioned(false);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(PROVISION_FLAG_KEY, "false");
          }
          resetAllUtilities();
        }
        return nextProfiles;
      });
      resetUnitUtilities(target);

      return { ok: true, unit: target };
    },
    [credentials],
  );

  const getProfileForUnit = useCallback(
    (unitId) => {
      if (!unitId) return { name: "", mobile: "", email: "" };
      return activeProfiles[unitId] || { name: "", mobile: "", email: "" };
    },
    [activeProfiles],
  );

  const getAssignedUnits = useCallback(
    () =>
      isProvisioned
        ? UNIT_IDS.filter((id) => !isUnitVacant(activeProfiles[id], getUnitUtilities(id)))
        : [],
    [activeProfiles, isProvisioned],
  );

  const getAvailableUnits = useCallback(
    () =>
      isProvisioned
        ? UNIT_IDS.filter((id) => isUnitVacant(activeProfiles[id], getUnitUtilities(id)))
        : UNIT_IDS,
    [activeProfiles, isProvisioned],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      login,
      logout,
      addUser,
      removeUserFromUnit,
      getProfileForUnit,
      getAssignedUnits,
      getAvailableUnits,
      credentials,
    }),
    [
      user,
      isReady,
      login,
      logout,
      addUser,
      removeUserFromUnit,
      getProfileForUnit,
      getAssignedUnits,
      getAvailableUnits,
      credentials,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
