import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardService } from '@core/services/card.service';
import { CardDetailsResponse, CardStatus, CardType, PageResponse } from '@shared/models/card.model';
import { CardEnrollDialogComponent } from '../card-enroll-dialog/card-enroll-dialog.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  displayedColumns: string[] = ['maskedPan', 'holderName', 'cardType', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<CardDetailsResponse>([]);
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
  cardStatusFilter = CardStatus;
  cardTypeFilter = CardType;
  selectedStatus: CardStatus | 'ALL' = 'ALL';
  selectedType: CardType | 'ALL' = 'ALL';

  private cardService = inject(CardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    console.log('Cargando tarjetas...');
    this.isLoading = true;
    this.cardService.getAllCards(this.currentPage, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe({
        next: (response: PageResponse<CardDetailsResponse>) => {
          console.log('Respuesta del servidor:', response);
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
          console.log('Tarjetas cargadas:', response.content.length);
        },
        error: (error) => {
          console.error('Error loading cards:', error);
          this.showError('Error al cargar las tarjetas: ' + (error.message || 'Error de conexión'));
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCards();
  }

  onSortChange(event: Sort): void {
    this.sortBy = event.active || 'createdAt';
    this.sortDirection = event.direction || 'desc';
    this.currentPage = 0; // Reset a la primera página
    this.loadCards();
  }

  onStatusFilterChange(): void {
    this.currentPage = 0; // Reset a la primera página
    this.loadCards();
  }

  onTypeFilterChange(): void {
    this.currentPage = 0; // Reset a la primera página
    this.loadCards();
  }

  refreshCards(): void {
    console.log('Refrescando tarjetas...');
    this.loadCards();
  }

  testBackendConnection(): void {
    console.log('Probando conexión con backend...');
    this.cardService.getAllCards(0, 1).subscribe({
      next: (response) => {
        console.log('Backend conectado correctamente:', response);
        this.showSuccess('Conexión con backend exitosa');
      },
      error: (error) => {
        console.error('Error de conexión con backend:', error);
        this.showError('Error de conexión con backend: ' + (error.message || 'Servidor no disponible'));
      }
    });
  }

  testNavigation(): void {
    console.log('Probando navegación directa...');
    // Navegar usando una tarjeta ficticia para probar la ruta
    this.router.navigate(['/cards', 'test-id']).then(
      success => {
        console.log('Navegación de prueba exitosa:', success);
        this.showInfo('Navegación de prueba exitosa');
      },
      error => {
        console.error('Error en navegación de prueba:', error);
        this.showError('Error en navegación de prueba: ' + error.message);
      }
    );
  }

  enrollCard(card: CardDetailsResponse): void {
    const dialogRef = this.dialog.open(CardEnrollDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { card }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.enrolled) {
        // Actualizar el estado de la tarjeta en la tabla
        const index = this.dataSource.data.findIndex(c => c.identifier === card.identifier);
        if (index !== -1) {
          this.dataSource.data[index] = { ...card, status: CardStatus.ENROLLED };
          this.dataSource._updateChangeSubscription(); // Actualizar la vista
        }
        
        // Recargar datos desde el servidor para mantener consistencia
        this.loadCards();
        
        this.showSuccess('Tarjeta activada exitosamente');
      }
    });
  }

  viewCardDetails(card: CardDetailsResponse): void {
    console.log('Navegando a detalle de tarjeta:', card.identifier);
    console.log('Objeto card completo:', card);
    
    // Verificar que el identificador existe
    if (!card.identifier) {
      console.error('El card no tiene identificador válido');
      this.showError('No se puede ver el detalle: identificador de tarjeta no válido');
      return;
    }
    
    this.router.navigate(['/cards', card.identifier]).then(
      success => {
        console.log('Navegación exitosa:', success);
        if (!success) {
          console.error('La navegación falló pero no lanzó error');
          this.showError('Error al navegar a los detalles de la tarjeta');
        }
      },
      error => {
        console.error('Error en navegación:', error);
        this.showError('Error al navegar a los detalles de la tarjeta: ' + error.message);
      }
    );
  }

  deactivateCard(card: CardDetailsResponse): void {
    console.log('Intentando desactivar tarjeta:', card.identifier);
    if (confirm(`¿Está seguro de que desea desactivar la tarjeta de ${card.holderName}?`)) {
      console.log('Usuario confirmó desactivación');
      this.cardService.deactivateCard(card.identifier).subscribe({
        next: () => {
          console.log('Tarjeta desactivada exitosamente');
          this.showSuccess('Tarjeta desactivada exitosamente');
          this.loadCards();
        },
        error: (error) => {
          console.error('Error deactivating card:', error);
          this.showError('Error al desactivar la tarjeta: ' + (error.message || error));
        }
      });
    } else {
      console.log('Usuario canceló desactivación');
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

  getCardTypeIcon(type: CardType): string {
    switch (type) {
      case CardType.CREDIT:
        return 'credit_card';
      case CardType.DEBIT:
        return 'payment';
      default:
        return 'credit_card';
    }
  }

  getCardTypeText(type: CardType): string {
    switch (type) {
      case CardType.CREDIT:
        return 'Crédito';
      case CardType.DEBIT:
        return 'Débito';
      default:
        return type;
    }
  }

  canEnroll(card: CardDetailsResponse): boolean {
    // Solo se pueden activar tarjetas en estado CREATED
    return card.status === CardStatus.CREATED;
  }

  canDeactivate(card: CardDetailsResponse): boolean {
    // Solo se pueden desactivar tarjetas en estado ENROLLED (activas)
    return card.status === CardStatus.ENROLLED;
  }

  getEnrollTooltip(card: CardDetailsResponse): string {
    if (card.status === CardStatus.CREATED) {
      return 'Activar tarjeta';
    } else if (card.status === CardStatus.ENROLLED) {
      return 'La tarjeta ya está activa';
    } else {
      return 'No se puede activar esta tarjeta';
    }
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