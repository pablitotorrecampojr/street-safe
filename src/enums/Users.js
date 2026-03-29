export const UserStatus = {
    PENDING: '0',
    ACTIVE: '1',
    BLOCKED: '2',
};

export const UserRole = {
    ADMIN: '0',
    AUTHORITIES: '1',
    MUNICIPALITIES: '2',
    USER: '3',
};

export const statusOptions = {
    [UserStatus.PENDING]: 'info',
    [UserStatus.ACTIVE]: 'success',
    [UserStatus.BLOCKED]: 'danger',
};