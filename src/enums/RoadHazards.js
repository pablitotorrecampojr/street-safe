export const Status = {
    PENDING: 'pending',
    IN_PROGRESS: 'in progress',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

export const Style = {
    [Status.PENDING]: 'info',
    [Status.IN_PROGRESS]: 'warning',
    [Status.RESOLVED]: 'success',
    [Status.REJECTED]: 'danger',
}