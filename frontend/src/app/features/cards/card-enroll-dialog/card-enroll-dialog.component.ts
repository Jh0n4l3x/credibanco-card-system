import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardService } from '@core/services/card.service';
import { CardDetailsResponse, CardEnrollRequest } from '@shared/models/card.model';

export interface EnrollDialogData {
  card: CardDetailsResponse;
}

@Component({
  selector: 'app-card-enroll-dialog',
  templateUrl: './card-enroll-dialog.component.html',
  styleUrls: ['./card-enroll-dialog.component.scss']
})
export class CardEnrollDialogComponent {
  private dialogRef = inject(MatDialogRef<CardEnrollDialogComponent>);
  private cardService = inject(CardService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  public data = inject(MAT_DIALOG_DATA) as EnrollDialogData;

  enrollForm: FormGroup;
  isEnrolling = false;

  constructor() {
    this.enrollForm = this.createEnrollForm();
  }

  private createEnrollForm(): FormGroup {
    return this.fb.group({
      validationNumber: [null, [
        Validators.required,
        Validators.pattern(/^\d{3}$/),
        Validators.minLength(3),
        Validators.maxLength(3)
      ]]
    });
  }

  onEnroll(): void {
    if (this.enrollForm.valid) {
      this.isEnrolling = true;
      
      const enrollRequest: CardEnrollRequest = {
        identifier: this.data.card.identifier,
        validationNumber: this.enrollForm.get('validationNumber')?.value
      };

      this.cardService.enrollCard(enrollRequest).subscribe({
        next: () => {
          this.snackBar.open('Tarjeta activada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close({ enrolled: true });
        },
        error: (error: string) => {
          this.snackBar.open(error || 'Error al activar la tarjeta', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isEnrolling = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close({ enrolled: false });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.enrollForm.controls).forEach(key => {
      const control = this.enrollForm.get(key);
      control?.markAsTouched();
    });
  }

  getValidationNumberError(): string {
    const control = this.enrollForm.get('validationNumber');
    if (control?.hasError('required')) {
      return 'El número de validación es obligatorio';
    }
    if (control?.hasError('pattern')) {
      return 'Debe contener exactamente 3 dígitos';
    }
    if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      return 'Debe tener exactamente 3 dígitos';
    }
    return '';
  }

  getMaskedPan(): string {
    return this.cardService.maskPan(this.data.card.identifier);
  }
}