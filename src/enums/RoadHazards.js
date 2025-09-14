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