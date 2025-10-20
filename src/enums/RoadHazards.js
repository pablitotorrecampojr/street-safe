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