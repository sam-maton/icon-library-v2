import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import {
  OrganisationService,
  Organisation,
} from '../../services/organisation/organisation.service';
import { CreateOrganisationDialog } from '../../components/create-organisation-dialog/create-organisation-dialog';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly organisationService = inject(OrganisationService);
  private readonly dialog = inject(MatDialog);
  private subscriptions: Subscription[] = [];

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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadOrganisations(userId: string): void {
    this.loading.set(true);
    // Unsubscribe from any existing subscription before creating a new one
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions = [];
    }
    const sub = this.organisationService.getUserOrganisations(userId).subscribe({
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
    this.subscriptions.push(sub);
  }

  onCreateOrganisation(): void {
    const dialogRef = this.dialog.open(CreateOrganisationDialog, {
      width: '400px',
    });

    const sub = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const user = this.authService.user();
        if (user?.id) {
          this.loading.set(true);
          const createSub = this.organisationService
            .createOrganisation(user.id, result.name)
            .subscribe({
              next: () => {
                this.loadOrganisations(user.id);
              },
              error: (err) => {
                console.error('Error creating organisation:', err);
                this.error.set('Failed to create organisation');
                this.loading.set(false);
              },
            });
          this.subscriptions.push(createSub);
        }
      }
    });
    this.subscriptions.push(sub);
  }
}
