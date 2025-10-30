import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '@core/services/transaction.service';
import { CardService } from '@core/services/card.service';
import { 
  CreateTransactionResponse, 
  TransactionStatus, 
  TransactionCancelRequest, 
  PageResponse 
} from '@shared/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  displayedColumns: string[] = ['referenceNumber', 'cardIdentifier', 'totalAmount', 'purchaseAddress', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<CreateTransactionResponse>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Paginación del servidor
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  sortBy = 'createdAt';
  sortDirection = 'desc';

  // Filtros
  transactionStatusFilter = TransactionStatus;
  selectedStatus: TransactionStatus | 'ALL' = 'ALL';

  private transactionService = inject(TransactionService);
  private cardService = inject(CardService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions(this.currentPage, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe({
        next: (response: PageResponse<CreateTransactionResponse>) => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.showError('Error al cargar las transacciones');
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  onSortChange(event: Sort): void {
    this.sortBy = event.active || 'createdAt';
    this.sortDirection = event.direction || 'desc';
    this.currentPage = 0; // Reset a la primera página
    this.loadTransactions();
  }

  onStatusFilterChange(): void {
    this.currentPage = 0; // Reset a la primera página
    this.loadTransactions();
  }

  refreshTransactions(): void {
    this.loadTransactions();
  }

  cancelTransaction(transaction: CreateTransactionResponse): void {
    console.log('Intentando cancelar transacción:', transaction.referenceNumber);
    if (!transaction.referenceNumber) {
      console.error('No hay número de referencia para la transacción');
      this.showError('No se puede cancelar una transacción sin número de referencia');
      return;
    }

    if (confirm(`¿Está seguro de que desea cancelar la transacción ${transaction.referenceNumber}?`)) {
      console.log('Usuario confirmó cancelación');
      const cancelRequest: TransactionCancelRequest = {
        referenceNumber: transaction.referenceNumber
      };

      console.log('Enviando request de cancelación:', cancelRequest);
      this.transactionService.cancelTransaction(cancelRequest).subscribe({
        next: () => {
          console.log('Transacción cancelada exitosamente');
          this.showSuccess('Transacción cancelada exitosamente');
          this.loadTransactions();
        },
        error: (error) => {
          console.error('Error cancelling transaction:', error);
          this.showError('Error al cancelar la transacción: ' + (error.message || error));
        }
      });
    } else {
      console.log('Usuario canceló la cancelación');
    }
  }

  viewTransactionDetails(transaction: CreateTransactionResponse): void {
    console.log('Navegando a detalle de transacción:', transaction.referenceNumber);
    this.router.navigate(['/transactions', transaction.referenceNumber]).then(
      success => console.log('Navegación exitosa:', success),
      error => console.error('Error en navegación:', error)
    );
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

  getStatusText(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.APPROVED:
        return 'Aprobada';
      case TransactionStatus.CANCELLED:
        return 'Cancelada';
      case TransactionStatus.REJECTED:
        return 'Rechazada';
      default:
        return status;
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

  formatAmount(amount: number): string {
    return this.transactionService.formatAmount(amount);
  }

  canCancel(transaction: CreateTransactionResponse): boolean {
    return transaction.status === TransactionStatus.APPROVED && !!transaction.referenceNumber;
  }

  maskCardIdentifier(identifier: string): string {
    if (!identifier || identifier.length < 8) return identifier;
    const firstFour = identifier.substring(0, 4);
    const lastFour = identifier.substring(identifier.length - 4);
    const maskLength = identifier.length - 8;
    const mask = '*'.repeat(maskLength);
    return `${firstFour}${mask}${lastFour}`;
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

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}