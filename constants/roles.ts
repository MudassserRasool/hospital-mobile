export const ROLES = {
  PATIENT: 'patient',
  STAFF: 'staff',
  OWNER: 'owner',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export default ROLES;
