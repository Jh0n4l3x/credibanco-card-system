import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardService } from '@core/services/card.service';
import { CardRequest, CardType, CreateCardResponse } from '@shared/models/card.model';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss']
})
export class CardCreateComponent {
  cardForm: FormGroup;
  isLoading = false;
  cardTypes = Object.values(CardType);

  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.cardForm = this.createForm();
    this.setupFormListeners();
  }

  private setupFormListeners(): void {
    // Regenerar PAN cuando cambie el tipo de tarjeta
    this.cardForm.get('cardType')?.valueChanges.subscribe(() => {
      this.generateNewPAN();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      pan: [{ value: this.generatePAN(), disabled: true }], // PAN generado automáticamente
      holderName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/)
      ]],
      documentNumber: [null, [
        Validators.required,
        Validators.pattern(/^\d{10,15}$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]],
      phoneNumber: [null, [
        Validators.pattern(/^\d{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      cardType: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.isLoading = true;
      
      // Crear el request incluyendo el PAN generado
      const formValue = this.cardForm.getRawValue(); // getRawValue incluye campos disabled
      const cardRequest: CardRequest = {
        pan: formValue.pan,
        holderName: formValue.holderName,
        documentNumber: formValue.documentNumber,
        phoneNumber: formValue.phoneNumber,
        cardType: formValue.cardType
      };

      this.cardService.createCard(cardRequest).subscribe({
        next: (response: CreateCardResponse) => {
          this.showSuccess(`Tarjeta creada exitosamente. Número de validación: ${response.validationNumber}`);
          this.router.navigate(['/cards']);
        },
        error: (error: string) => {
          console.error('Error creating card:', error);
          this.showError(error || 'Error al crear la tarjeta');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }

  generateNewPAN(): void {
    const newPAN = this.generatePAN();
    this.cardForm.patchValue({ pan: newPAN });
  }

  private generatePAN(): string {
    // Prefijos bancarios comunes para Colombia
    const cardPrefixes: Record<CardType, string[]> = {
      [CardType.CREDIT]: ['4539', '5168', '5234', '5555'],  // Visa y MasterCard crédito
      [CardType.DEBIT]: ['4571', '5123', '5245', '5411']    // Visa y MasterCard débito
    };

    const selectedType = this.cardForm?.get('cardType')?.value as CardType || CardType.CREDIT;
    const prefixes = cardPrefixes[selectedType] || cardPrefixes[CardType.CREDIT];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // Generar los 12 dígitos restantes (16 total - 4 del prefijo)
    let partialPAN = randomPrefix;
    for (let i = 0; i < 11; i++) {
      partialPAN += Math.floor(Math.random() * 10).toString();
    }

    // Calcular el dígito de verificación usando el algoritmo de Luhn
    const checkDigit = this.calculateLuhnCheckDigit(partialPAN);
    return partialPAN + checkDigit;
  }

  private calculateLuhnCheckDigit(cardNumber: string): string {
    let sum = 0;
    let shouldDouble = true;

    // Iterar desde el final hacia el principio
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }

  private validateLuhn(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  getPANInfo(): { issuer: string; type: string } {
    const pan = this.cardForm.get('pan')?.value || '';
    const firstDigit = pan.charAt(0);
    const firstTwo = pan.substring(0, 2);
    const cardType = this.cardForm.get('cardType')?.value;

    let issuer = 'Desconocido';
    
    if (firstDigit === '4') {
      issuer = 'Visa';
    } else if (['51', '52', '53', '54', '55'].includes(firstTwo)) {
      issuer = 'MasterCard';
    } else if (firstTwo === '34' || firstTwo === '37') {
      issuer = 'American Express';
    }

    return {
      issuer,
      type: cardType === CardType.CREDIT ? 'Crédito' : 'Débito'
    };
  }

  getMaskedPAN(): string {
    const pan = this.cardForm.get('pan')?.value || '';
    if (pan.length >= 16) {
      return `${pan.substring(0, 4)} **** **** ${pan.substring(12)}`;
    }
    return pan;
  }

  getErrorMessage(fieldName: string): string {
    // El PAN se genera automáticamente, no necesita validación de errores
    if (fieldName === 'pan') {
      return '';
    }

    const field = this.cardForm.get(fieldName);
    if (field?.hasError('required')) {
      return `El campo ${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (field?.hasError('pattern')) {
      switch (fieldName) {
        case 'holderName':
          return 'El nombre solo puede contener letras y espacios';
        case 'documentNumber':
          return 'El documento debe contener solo números';
        case 'phoneNumber':
          return 'Formato de teléfono inválido';
        default:
          return 'Formato inválido';
      }
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const names: Record<string, string> = {
      pan: 'PAN',
      holderName: 'Nombre del titular',
      documentNumber: 'Número de documento',
      phoneNumber: 'Teléfono',
      cardType: 'Tipo de tarjeta'
    };
    return names[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cardForm.controls).forEach(key => {
      const control = this.cardForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}