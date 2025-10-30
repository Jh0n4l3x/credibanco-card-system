import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CardService } from '@core/services/card.service';
import { TransactionService } from '@core/services/transaction.service';
import { 
  CardDetailsResponse, 
  CardStatus 
} from '@shared/models/card.model';
import { CreateTransactionResponse, PageResponse } from '@shared/models/transaction.model';
import { CardEnrollDialogComponent } from '../card-enroll-dialog/card-enroll-dialog.component';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  card: CardDetailsResponse | null = null;
  transactions: CreateTransactionResponse[] = [];
  isLoading = true;
  isLoadingTransactions = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(CardService);
  private transactionService = inject(TransactionService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    console.log('CardDetailComponent inicializado');
    this.route.params.subscribe(params => {
      console.log('Parámetros de ruta:', params);
      const cardIdentifier = params['id'];
      console.log('ID de tarjeta extraído:', cardIdentifier);
      if (cardIdentifier) {
        this.loadCard(cardIdentifier);
        this.loadTransactions();
      } else {
        console.error('No se encontró ID de tarjeta en los parámetros');
        this.isLoading = false;
      }
    });
  }

  private loadCard(identifier: string): void {
    console.log('Cargando tarjeta con identificador:', identifier);
    this.isLoading = true;
    this.cardService.getCard(identifier).subscribe({
      next: (card: CardDetailsResponse) => {
        console.log('Tarjeta cargada exitosamente:', card);
        this.card = card;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading card:', error);
        this.showError('Error al cargar la información de la tarjeta: ' + (error.message || error));
        this.isLoading = false;
      }
    });
  }

  private loadTransactions(): void {
    this.isLoadingTransactions = true;
    // Cargar todas las transacciones ya que el backend no tiene filtro por tarjeta
    this.transactionService.getAllTransactions(0, 100).subscribe({
      next: (response: PageResponse<CreateTransactionResponse>) => {
        // Filtrar transacciones por tarjeta en el frontend
        if (this.card) {
          this.transactions = response.content.filter(
            transaction => transaction.cardIdentifier === this.card!.identifier
          );
        }
        this.isLoadingTransactions = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.showError('Error al cargar las transacciones');
        this.isLoadingTransactions = false;
      }
    });
  }

  toggleEnrollForm(): void {
    if (!this.card) return;

    const dialogRef = this.dialog.open(CardEnrollDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { card: this.card }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.enrolled && this.card) {
        // Actualizar el estado local de la tarjeta
        this.card.status = CardStatus.ENROLLED;
        
        // Recargar los datos desde el servidor
        this.loadCard(this.card.identifier);
        
        this.snackBar.open('Tarjeta activada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }

  deactivateCard(): void {
    if (this.card && confirm(`¿Está seguro de que desea desactivar la tarjeta de ${this.card.holderName}?`)) {
      this.cardService.deactivateCard(this.card.identifier).subscribe({
        next: () => {
          this.showSuccess('Tarjeta desactivada exitosamente');
          this.card!.status = CardStatus.INACTIVE;
        },
        error: (error) => {
          console.error('Error deactivating card:', error);
          this.showError('Error al desactivar la tarjeta');
        }
      });
    }
  }

  refreshData(): void {
    if (this.card) {
      this.loadCard(this.card.identifier);
      this.loadTransactions();
    }
  }

  getStatusColor(status: CardStatus): string {
    switch (status) {
      case CardStatus.ENROLLED:
        return 'success';
      case CardStatus.CREATED:
        return 'warning';
      case CardStatus.INACTIVE:
        return 'danger';
      default:
        return 'default';
    }
  }

  getStatusText(status: CardStatus): string {
    switch (status) {
      case CardStatus.CREATED:
        return 'Creada';
      case CardStatus.ENROLLED:
        return 'Activa';
      case CardStatus.INACTIVE:
        return 'Inactiva';
      default:
        return status;
    }
  }

  getStatusIcon(status: CardStatus): string {
    switch (status) {
      case CardStatus.ENROLLED:
        return 'check_circle';
      case CardStatus.CREATED:
        return 'schedule';
      case CardStatus.INACTIVE:
        return 'cancel';
      default:
        return 'help';
    }
  }

  getCardTypeText(type: string): string {
    switch (type) {
      case 'CREDIT':
        return 'Crédito';
      case 'DEBIT':
        return 'Débito';
      default:
        return type;
    }
  }

  canEnroll(): boolean {
    return this.card?.status === CardStatus.CREATED;
  }

  canDeactivate(): boolean {
    return this.card?.status === CardStatus.ENROLLED;
  }

  formatAmount(amount: number): string {
    return this.transactionService.formatAmount(amount);
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