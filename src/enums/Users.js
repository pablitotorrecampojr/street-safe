export const UserStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    BLOCKED: 'blocked',
};

export const UserRole = {
    ADMIN: 'admin',
    AUTHORITIES: 'authorities',
    MUNICIPALITIES: 'municipalities',
    USER: 'user',
};

export const statusOptions = {
    [UserStatus.PENDING]: 'info',
    [UserStatus.ACTIVE]: 'success',
    [UserStatus.BLOCKED]: 'danger',
};