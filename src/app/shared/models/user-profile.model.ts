import {UserRole} from './user-role.model';

export interface UserProfile {
  uid: string;
  role: UserRole;
  createdAt: string;
}
