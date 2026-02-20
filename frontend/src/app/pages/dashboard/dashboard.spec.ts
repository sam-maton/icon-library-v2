import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Dashboard } from './dashboard';
import { AuthService } from '../../services/auth/auth.service';
import { OrganisationService } from '../../services/organisation/organisation.service';
import { CreateOrganisationDialog } from '../../components/create-organisation-dialog/create-organisation-dialog';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;
  let dialog: { open: ReturnType<typeof vi.fn> };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockAuthService = {
      user: signal(mockUser),
    };

    dialog = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        OrganisationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    // Override the dialog after component creation
    (component as any).dialog = dialog;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load organisations on init', async () => {
    const mockOrganisations = [
      {
        id: 'org-1',
        name: 'Test Organisation',
        createdAt: new Date(),
        updatedAt: new Date(),
        admin: true,
      },
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/users/user-123/organisations');
    expect(req.request.method).toBe('GET');
    req.flush({ organisations: mockOrganisations });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.organisations()).toEqual(mockOrganisations);
    expect(component.loading()).toBe(false);
  });

  it('should display empty state when no organisations', async () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/users/user-123/organisations');
    req.flush({ organisations: [] });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.organisations().length).toBe(0);
    expect(component.loading()).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyMessage = compiled.querySelector('.dashboard__empty');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage?.textContent).toContain("You don't belong to any organisations yet");
  });

  it('should handle errors when loading organisations', async () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/api/users/user-123/organisations');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.error()).toBe('Failed to load organisations');
    expect(component.loading()).toBe(false);
  });

  it('should open dialog when onCreateOrganisation is called', () => {
    const mockDialogRef = {
      afterClosed: () => of(null),
    };
    dialog.open.mockReturnValue(mockDialogRef as any);

    component.onCreateOrganisation();

    expect(dialog.open).toHaveBeenCalledWith(CreateOrganisationDialog, {
      width: '400px',
    });
  });

  it('should create organisation and reload list when dialog returns data', async () => {
    const mockNewOrg = {
      id: 'org-new',
      name: 'New Organisation',
      createdAt: new Date(),
      updatedAt: new Date(),
      admin: true,
    };

    const mockDialogRef = {
      afterClosed: () => of({ name: 'New Organisation' }),
    };
    dialog.open.mockReturnValue(mockDialogRef as any);

    fixture.detectChanges();
    const initialReq = httpMock.expectOne('http://localhost:3000/api/users/user-123/organisations');
    initialReq.flush({ organisations: [] });

    await fixture.whenStable();

    component.onCreateOrganisation();

    const createReq = httpMock.expectOne('http://localhost:3000/api/organisations');
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body).toEqual({ userId: 'user-123', name: 'New Organisation' });
    createReq.flush(mockNewOrg);

    const reloadReq = httpMock.expectOne('http://localhost:3000/api/users/user-123/organisations');
    expect(reloadReq.request.method).toBe('GET');
    reloadReq.flush({ organisations: [mockNewOrg] });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.organisations().length).toBe(1);
    expect(component.organisations()[0].name).toBe('New Organisation');
  });
});
