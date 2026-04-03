import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {AuthUser} from '../../../shared/models/auth-user.model';
import {UserRole} from '../../../shared/models/user-role.model';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {UserProfileService} from '../../user/services/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {

  private readonly auth = inject(Auth);
  private readonly userProfileService = inject(UserProfileService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly userSignal = signal<AuthUser | null>(null);
  readonly user = this.userSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(true);
  readonly loading = this.loadingSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly role = computed<UserRole | null>(() => this.user()?.role ?? null);
  readonly uid = computed<string | null>(() => this.user()?.uid ?? null);

  constructor() {
    const unsubscribe = onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.userSignal.set(null);
        this.loadingSignal.set(false);
        return;
      }

      const profile = await this.userProfileService.getProfile(firebaseUser.uid);

      this.userSignal.set({
        uid: firebaseUser.uid,
        role: profile?.role ?? null,
      });

      this.loadingSignal.set(false);
    });

    this.destroyRef.onDestroy(unsubscribe);
  }
}
