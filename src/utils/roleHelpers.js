export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT'
};

export const hasRole = (user, role) => {
  return user?.roles?.includes(role);
};
