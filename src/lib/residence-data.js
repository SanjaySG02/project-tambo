const DEFAULT_UTILITIES = {
  electricityKwh: 0,
  waterLitres: 0,
  gasM3: 0,
  solarKwh: 0,
};

const UTILITIES_STORAGE_KEY = "tambo.utilities";

const readUtilitiesStore = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTILITIES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeUtilitiesStore = (store) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UTILITIES_STORAGE_KEY, JSON.stringify(store));
};

const DEFAULT_SECURITY = {
  entrance: "LOCKED",
  lastScan: "10:24 AM",
  camerasOnline: 4,
  alerts: 0,
};

const DEFAULT_AMENITIES = {
  gymAccess: "AVAILABLE",
  poolStatus: "OPEN",
  loungeOccupancy: "LOW",
  parkStatus: "OPEN",
};

const DEFAULT_COMMUNITY = {
  announcements: [
    "Rooftop BBQ Night - Tomorrow, 7 PM",
    "Elevator Maintenance - Feb 10th",
    "Yoga Class - Every Sunday",
  ],
};

export const UNIT_SNAPSHOTS = {
  "101": {
    unitId: "101",
    resident: "User101",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 13,
      waterLitres: 500,
      gasM3: 0.9,
      solarKwh: 2.1,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "10:24 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
      gymAccess: "AVAILABLE",
      poolStatus: "OPEN",
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "CALM",
    },
  },
  "102": {
    unitId: "102",
    resident: "Vacant",
    status: "Vacant",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 14.4,
      waterLitres: 420,
      gasM3: 0.75,
      solarKwh: 2.2,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "08:12 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
      gymAccess: "LIMITED",
      poolStatus: "OPEN",
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "QUIET",
    },
  },
  "201": {
    unitId: "201",
    resident: "User201",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 19,
      waterLitres: 400,
      gasM3: 0.55,
      solarKwh: 2.05,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "UNLOCKED",
      lastScan: "11:02 AM",
      alerts: 1,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
      gymAccess: "AVAILABLE",
      poolStatus: "OPEN",
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "ACTIVE",
    },
  },
  "202": {
    unitId: "202",
    resident: "Maintenance",
    status: "Maintenance",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 10.4,
      waterLitres: 490,
      gasM3: 0.5,
      solarKwh: 2.55,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "09:40 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
      gymAccess: "CLOSED",
      poolStatus: "OPEN",
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "MAINTENANCE",
    },
  },
  "301": {
    unitId: "301",
    resident: "Vacant",
    status: "Vacant",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 16.2,
      waterLitres: 430,
      gasM3: 0.7,
      solarKwh: 2.0,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "10:48 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "CALM",
    },
  },
  "302": {
    unitId: "302",
    resident: "User302",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 11.8,
      waterLitres: 460,
      gasM3: 0.6,
      solarKwh: 2.3,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "09:55 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "QUIET",
    },
  },
  "401": {
    unitId: "401",
    resident: "User401",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 18.5,
      waterLitres: 410,
      gasM3: 0.65,
      solarKwh: 1.9,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "UNLOCKED",
      lastScan: "11:20 AM",
      alerts: 1,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "ACTIVE",
    },
  },
  "402": {
    unitId: "402",
    resident: "User402",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 9.9,
      waterLitres: 470,
      gasM3: 0.5,
      solarKwh: 2.6,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "08:40 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "CALM",
    },
  },
  "501": {
    unitId: "501",
    resident: "User501",
    status: "Occupied",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 20.1,
      waterLitres: 390,
      gasM3: 0.8,
      solarKwh: 1.8,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "07:50 AM",
      alerts: 2,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "ALERT",
    },
  },
  "502": {
    unitId: "502",
    resident: "Vacant",
    status: "Vacant",
    utilities: {
      ...DEFAULT_UTILITIES,
      electricityKwh: 12.9,
      waterLitres: 440,
      gasM3: 0.55,
      solarKwh: 2.4,
    },
    security: {
      ...DEFAULT_SECURITY,
      entrance: "LOCKED",
      lastScan: "10:05 AM",
      alerts: 0,
    },
    amenities: {
      ...DEFAULT_AMENITIES,
    },
    community: {
      ...DEFAULT_COMMUNITY,
      mood: "QUIET",
    },
  },
};

export const UNIT_IDS = Object.keys(UNIT_SNAPSHOTS);

export const getUnitUtilities = (unitId) => {
  const store = readUtilitiesStore();
  return store[unitId] || null;
};

export const setUnitUtilities = (unitId, utilities) => {
  if (!unitId) return;
  const store = readUtilitiesStore();
  store[unitId] = utilities;
  writeUtilitiesStore(store);
};

export const resetUnitUtilities = (unitId) => {
  if (!unitId) return;
  const store = readUtilitiesStore();
  store[unitId] = { ...DEFAULT_UTILITIES };
  writeUtilitiesStore(store);
};

export const resetAllUtilities = () => {
  const store = {};
  UNIT_IDS.forEach((id) => {
    store[id] = { ...DEFAULT_UTILITIES };
  });
  writeUtilitiesStore(store);
};

export const getUnitSnapshot = (unitId) => {
  const snapshot = UNIT_SNAPSHOTS[unitId];
  if (!snapshot) return null;
  const storedUtilities = getUnitUtilities(unitId);
  return {
    ...snapshot,
    utilities: storedUtilities ? { ...storedUtilities } : { ...DEFAULT_UTILITIES },
  };
};

export const getUnitSnapshots = (unitIds) =>
  unitIds.map((id) => UNIT_SNAPSHOTS[id]).filter(Boolean);
