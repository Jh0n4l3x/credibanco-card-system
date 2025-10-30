import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '@core/services/transaction.service';
import { CardService } from '@core/services/card.service';
import { TransactionRequest, CreateTransactionResponse } from '@shared/models/transaction.model';
import { Card, CardStatus, PageResponse, CardDetailsResponse } from '@shared/models/card.model';

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.component.html',
  styleUrls: ['./transaction-create.component.scss']
})
export class TransactionCreateComponent implements OnInit {
  transactionForm: FormGroup;
  isLoading = false;
  isLoadingCards = true;
  availableCards: CardDetailsResponse[] = [];

  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private cardService = inject(CardService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.transactionForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAvailableCards();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      cardIdentifier: ['', Validators.required],
      totalAmount: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      purchaseAddress: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]]
    });
  }

  private loadAvailableCards(): void {
    this.isLoadingCards = true;
    this.cardService.getAllCards(0, 100).subscribe({
      next: (response: PageResponse<CardDetailsResponse>) => {
        // Solo mostrar tarjetas enroladas (activas)
        this.availableCards = response.content.filter((card: CardDetailsResponse) => card.status === CardStatus.ENROLLED);
        this.isLoadingCards = false;
      },
      error: (error: string) => {
        console.error('Error loading cards:', error);
        this.showError('Error al cargar las tarjetas disponibles');
        this.isLoadingCards = false;
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const transactionRequest: TransactionRequest = {
        cardIdentifier: this.transactionForm.get('cardIdentifier')?.value,
        totalAmount: parseFloat(this.transactionForm.get('totalAmount')?.value),
        purchaseAddress: this.transactionForm.get('purchaseAddress')?.value
      };

      this.transactionService.createTransaction(transactionRequest).subscribe({
        next: (response: CreateTransactionResponse) => {
          this.showSuccess(`Transacción creada exitosamente. Referencia: ${response.referenceNumber}`);
          this.router.navigate(['/transactions']);
        },
        error: (error: string) => {
          console.error('Error creating transaction:', error);
          this.showError(error || 'Error al crear la transacción');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }

  getSelectedCard(): Card | null {
    const cardIdentifier = this.transactionForm.get('cardIdentifier')?.value;
    return this.availableCards.find(card => card.identifier === cardIdentifier) || null;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);
    if (field?.hasError('required')) {
      return `El campo ${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (field?.hasError('min')) {
      return 'El monto debe ser mayor a 0';
    }
    if (field?.hasError('max')) {
      return 'El monto es demasiado alto';
    }
    if (field?.hasError('pattern')) {
      switch (fieldName) {
        case 'totalAmount':
          return 'Formato de monto inválido (máximo 2 decimales)';
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
      cardIdentifier: 'Tarjeta',
      totalAmount: 'Monto total',
      purchaseAddress: 'Dirección de compra'
    };
    return names[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  maskPan(pan: string): string {
    if (!pan || pan.length < 10) {
      return pan;
    }
    const firstSix = pan.substring(0, 6);
    const lastFour = pan.substring(pan.length - 4);
    const maskLength = pan.length - 10;
    const mask = '*'.repeat(maskLength);
    return `${firstSix}${mask}${lastFour}`;
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