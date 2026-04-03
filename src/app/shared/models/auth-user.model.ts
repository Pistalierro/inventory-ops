import {UserRole} from './user-role.model';

export interface AuthUser {
  uid: string;
  role: UserRole | null;
}
