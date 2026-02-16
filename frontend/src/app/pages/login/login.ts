import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  errorMessage = signal<string | null>(null);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.authService.signIn(formData.email!, formData.password!).subscribe({
        next: (response) => {
          if (response.error) {
            console.log(response.error);
            if (response.error.message) {
              this.errorMessage.set(response.error.message);
            } else {
              this.errorMessage.set('An unknown error occurred during login.');
            }
            return;
          }
          console.log('Login successful:', response.data?.user.email);
          this.router.navigate(['/app/dashboard']);
        },
        error: (error) => {
          console.error('Unexpected error:', error);
        },
      });
    }
  }
}
