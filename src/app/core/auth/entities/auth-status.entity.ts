import { AuthenticatedUser } from './auth-user.entity';

export interface AuthStatus {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  authChecked: boolean;
}
