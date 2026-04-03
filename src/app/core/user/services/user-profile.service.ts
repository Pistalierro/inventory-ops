import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {DEFAULT_USER_ROLE} from '../../../shared/constants/roles.constant';
import {UserProfile} from '../../../shared/models/user-profile.model';

@Injectable({providedIn: 'root'})
export class UserProfileService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  async createProfileIfMissing(uid: string): Promise<void> {
    const profileRef = runInInjectionContext(this.injector, () =>
      doc(this.firestore, 'users', uid)
    );

    const snapshot = await runInInjectionContext(this.injector, () =>
      getDoc(profileRef)
    );

    if (snapshot.exists()) return;

    const profile: UserProfile = {
      uid,
      role: DEFAULT_USER_ROLE,
      createdAt: new Date().toISOString(),
    };

    await runInInjectionContext(this.injector, () => setDoc(profileRef, profile));
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const profileRef = runInInjectionContext(this.injector, () =>
      doc(this.firestore, 'users', uid)
    );

    const snapshot = await runInInjectionContext(this.injector, () =>
      getDoc(profileRef)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as UserProfile;
  }

}
