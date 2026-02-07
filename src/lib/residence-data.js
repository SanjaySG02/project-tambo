const DEFAULT_UTILITIES = {
  electricityKwh: 12.4,
  waterLitres: 450,
  gasM3: 0.8,
  solarKwh: 2.1,
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
};

export const UNIT_IDS = Object.keys(UNIT_SNAPSHOTS);

export const getUnitSnapshot = (unitId) => UNIT_SNAPSHOTS[unitId] || null;

export const getUnitSnapshots = (unitIds) =>
  unitIds.map((id) => UNIT_SNAPSHOTS[id]).filter(Boolean);
