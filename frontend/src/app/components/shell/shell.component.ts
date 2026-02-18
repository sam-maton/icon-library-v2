import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-shell.component',
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    console.log(this.authService.user());
  }

  onLogout(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (error) => console.error('Logout failed:', error),
    });
  }
}
