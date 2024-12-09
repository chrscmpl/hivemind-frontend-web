import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthenticatedUser } from '../entities/auth-user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authenticatedUser: WritableSignal<AuthenticatedUser | null> =
    signal<AuthenticatedUser | null>(null);

  public get authenticatedUser(): Signal<AuthenticatedUser | null> {
    return this._authenticatedUser;
  }

  public readonly isAuthenticated = computed(
    () => this._authenticatedUser() !== null
  );
}
