import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Dashboard } from './dashboard';
import { AuthService } from '../../services/auth/auth.service';
import { OrganisationService } from '../../services/organisation/organisation.service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;

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
});
