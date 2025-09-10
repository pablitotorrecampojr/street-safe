export const Status = {
    PENDING: 'pending',
    IN_PROGRESS: 'in progress',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

export const Style = {
    [Status.PENDING]: 'warning',
    [Status.IN_PROGRESS]: 'info',
    [Status.RESOLVED]: 'success',
    [Status.REJECTED]: 'danger',
}