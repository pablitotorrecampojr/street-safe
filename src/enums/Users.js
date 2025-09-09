export const UserStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    BLOCKED: 'blocked',
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