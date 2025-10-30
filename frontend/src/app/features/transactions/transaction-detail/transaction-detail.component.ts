import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '@core/services/transaction.service';
import { CardService } from '@core/services/card.service';
import { Transaction, TransactionStatus, TransactionCancelRequest, CreateTransactionResponse } from '@shared/models/transaction.model';
import { Card } from '@shared/models/card.model';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;
  card: Card | null = null;
  isLoading = true;
  isCancelling = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transactionService = inject(TransactionService);
  private cardService = inject(CardService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const referenceNumber = params['id'];
      if (referenceNumber) {
        this.loadTransaction(referenceNumber);
      }
    });
  }

  private loadTransaction(referenceNumber: string): void {
    this.isLoading = true;
    // Como no tenemos un endpoint específico para obtener transacción por referencia,
    // cargaremos todas y filtraremos
    this.transactionService.getAllTransactions().subscribe({
      next: (response) => {
        this.transaction = response.content.find((t: CreateTransactionResponse) => t.referenceNumber === referenceNumber) || null;
        if (this.transaction) {
          this.loadCard(this.transaction.cardIdentifier);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
        this.showError('Error al cargar la información de la transacción');
        this.isLoading = false;
      }
    });
  }

  private loadCard(cardIdentifier: string): void {
    this.cardService.getCard(cardIdentifier).subscribe({
      next: (card) => {
        this.card = card;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading card:', error);
        this.isLoading = false;
      }
    });
  }

  cancelTransaction(): void {
    if (!this.transaction?.referenceNumber) {
      this.showError('No se puede cancelar una transacción sin número de referencia');
      return;
    }

    if (confirm(`¿Está seguro de que desea cancelar la transacción ${this.transaction.referenceNumber}?`)) {
      this.isCancelling = true;
      const cancelRequest: TransactionCancelRequest = {
        referenceNumber: this.transaction.referenceNumber
      };

      this.transactionService.cancelTransaction(cancelRequest).subscribe({
        next: () => {
          this.showSuccess('Transacción cancelada exitosamente');
          this.transaction!.status = TransactionStatus.CANCELLED;
          this.isCancelling = false;
        },
        error: (error) => {
          console.error('Error cancelling transaction:', error);
          this.showError('Error al cancelar la transacción');
          this.isCancelling = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }

  getStatusColor(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.APPROVED:
        return 'success';
      case TransactionStatus.CANCELLED:
        return 'warning';
      case TransactionStatus.REJECTED:
        return 'danger';
      default:
        return 'default';
    }
  }

  getStatusIcon(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.APPROVED:
        return 'check_circle';
      case TransactionStatus.CANCELLED:
        return 'cancel';
      case TransactionStatus.REJECTED:
        return 'error';
      default:
        return 'help';
    }
  }

  canCancel(): boolean {
    return this.transaction?.status === TransactionStatus.APPROVED && !!this.transaction.referenceNumber;
  }

  formatAmount(amount: number): string {
    return this.transactionService.formatAmount(amount);
  }

  maskPan(pan: string): string {
    return this.cardService.maskPan(pan);
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