import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateOrganisationDialog } from './create-organisation-dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';

describe('CreateOrganisationDialog', () => {
  let component: CreateOrganisationDialog;
  let fixture: ComponentFixture<CreateOrganisationDialog>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateOrganisationDialog, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrganisationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty name', () => {
    expect(component.form.get('name')?.value).toBe('');
  });

  it('should validate name is required', () => {
    const nameControl = component.form.get('name');
    expect(nameControl?.hasError('required')).toBe(true);

    nameControl?.setValue('Test Org');
    expect(nameControl?.hasError('required')).toBe(false);
  });

  it('should validate name minimum length', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('ab');
    expect(nameControl?.hasError('minlength')).toBe(true);

    nameControl?.setValue('abc');
    expect(nameControl?.hasError('minlength')).toBe(false);
  });

  it('should close dialog without data when onCancel is called', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should not submit if form is invalid', () => {
    component.form.get('name')?.setValue('');
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with form data when onSubmit is called with valid data', () => {
    component.form.get('name')?.setValue('Test Organisation');
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({ name: 'Test Organisation' });
  });
});
