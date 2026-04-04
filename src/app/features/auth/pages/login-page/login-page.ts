import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {Router} from '@angular/router';
import {FirebaseError} from 'firebase/app';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  protected async onSubmit(): Promise<void> {
    if (!this.startSubmit()) return;

    try {
      const {email, password, rememberMe} = this.loginForm.getRawValue();
      await this.authService.signIn(email, password, rememberMe);
      this.clearForm();
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      const err = error as FirebaseError;
      this.submitError.set(
        err.code === 'auth/email-already-in-use'
          ? 'Email is already in use.'
          : 'Unable to create account. Please try again.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onSignUp(): Promise<void> {
    if (!this.startSubmit()) return;

    try {
      const {email, password} = this.loginForm.getRawValue();
      await this.authService.signUp(email, password);
      this.clearForm();
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      const err = error as FirebaseError;
      console.error('Sign in failed:', err.code, err.message, err);

      this.submitError.set(
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : `Sign in failed: ${err.code}`
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private startSubmit(): boolean {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return false;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    return true;
  }

  private clearForm(): void {
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: true,
    });
  }
}
