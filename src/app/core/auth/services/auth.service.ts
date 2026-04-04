import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {UserProfileService} from '../../user/services/user-profile.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(EnvironmentInjector);
  private readonly userProfileService = inject(UserProfileService);

  async signUp(email: string, password: string): Promise<void> {
    const userCredential = await runInInjectionContext(this.injector, () =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );

    await this.userProfileService.createProfileIfMissing(userCredential.user.uid);
  }

  async signIn(email: string, password: string, rememberMe: boolean): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        setPersistence(this.auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
      );
    } catch {
      await runInInjectionContext(this.injector, () =>
        setPersistence(this.auth, inMemoryPersistence)
      );
    }

    const userCredential = await runInInjectionContext(this.injector, () =>
      signInWithEmailAndPassword(this.auth, email, password)
    );

    await this.userProfileService.createProfileIfMissing(userCredential.user.uid);
  }

  async signOut(): Promise<void> {
    await runInInjectionContext(this.injector, () => signOut(this.auth));
  }

  getCurrentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
