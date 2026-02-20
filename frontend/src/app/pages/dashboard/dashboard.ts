import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import {
  OrganisationService,
  Organisation,
} from '../../services/organisation/organisation.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly organisationService = inject(OrganisationService);
  private subscription?: Subscription;

  readonly organisations = signal<Organisation[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.authService.user();
    if (user?.id) {
      this.loadOrganisations(user.id);
    } else {
      this.loading.set(false);
      this.error.set('User not found');
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadOrganisations(userId: string): void {
    this.loading.set(true);
    this.subscription = this.organisationService.getUserOrganisations(userId).subscribe({
      next: (orgs) => {
        this.organisations.set(orgs);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading organisations:', err);
        this.error.set('Failed to load organisations');
        this.loading.set(false);
      },
    });
  }

  onCreateOrganisation(): void {
    // TODO: Navigate to create organisation page or open dialog
    console.log('Create organisation clicked');
  }
}
