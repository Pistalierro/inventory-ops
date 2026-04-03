import {UserRole} from '../models/user-role.model';

export const ROLES: Record<Uppercase<UserRole>, UserRole> = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
};

export const DEFAULT_USER_ROLE: UserRole = ROLES.VIEWER;
