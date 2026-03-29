export const Status = {
    PENDING: 'pending',
    INVESTIGATING: 'investigating',
    NATIONAL: 'national',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

export const Style = {
    [Status.PENDING]: 'info',
    [Status.INVESTIGATING]: 'warning',
    [Status.RESOLVED]: 'success',
    [Status.REJECTED]: 'danger',
}

export const Types = [
    "Potholes",
    "Alligator Cracks",
    "Major Scalling",
    "Shoving and Corrugation",
    "Pumping and Depression",
    "No/Faded Road Markings",
    "Defects on Shoulders",
    "Lush Vegetation",
    "Clogged Drains",
    "Open Manhole",
    "No/Inadequate Sealant in Joints",
    "Cracks",
    "Raveling",
    "Unmaintained Signages and Road Markers",
    "Unmaintained Bridges",
    "Unmaintained Guardrails"
];

export const TypesSnake = [
  "potholes",
  "alligator_cracks",
  "major_scalling",
  "shoving_and_corrugation",
  "pumping_and_depression",
  "no_faded_road_markings",
  "defects_on_shoulders",
  "lush_vegetation",
  "clogged_drains",
  "open_manhole",
  "no_inadequate_sealant_in_joints",
  "cracks",
  "raveling",
  "unmaintained_signages_and_road_markers",
  "unmaintained_bridges",
  "unmaintained_guardrails"
];

export const hazardColors = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#84cc16", // Lime
  "#f97316", // Orange
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#dc2626", // Dark Red
  "#22c55e", // Green
  "#eab308", // Yellow
  "#00ff88ff", // Blue
];
