import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { combineLatest, interval, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { CardService } from '@core/services/card.service';
import { TransactionService } from '@core/services/transaction.service';
import { CardDetailsResponse, CardStatus } from '@shared/models/card.model';
import { CreateTransactionResponse, TransactionStatus } from '@shared/models/transaction.model';

interface DashboardStats {
  totalCards: number;
  enrolledCards: number;
  createdCards: number;
  inactiveCards: number;
  totalTransactions: number;
  approvedTransactions: number;
  cancelledTransactions: number;
  rejectedTransactions: number;
  totalAmount: number;
  avgTransactionAmount: number;
}

interface RecentActivity {
  type: 'card' | 'transaction';
  action: string;
  description: string;
  timestamp: Date;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats$ = new BehaviorSubject<DashboardStats | null>(null);
  recentCards$ = new BehaviorSubject<CardDetailsResponse[]>([]);
  recentTransactions$ = new BehaviorSubject<CreateTransactionResponse[]>([]);
  recentActivity$ = new BehaviorSubject<RecentActivity[]>([]);
  
  isLoading = false;
  error: string | null = null;
  lastUpdated: Date | null = null;
  
  private refreshSubscription?: Subscription;
  private cardService = inject(CardService);
  private transactionService = inject(TransactionService);

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private setupAutoRefresh(): void {
    // Actualizar cada 30 segundos
    this.refreshSubscription = interval(30000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Combinar datos de tarjetas y transacciones
    combineLatest([
      this.cardService.getAllCards(0, 100), // Obtener todas las tarjetas
      this.transactionService.getAllTransactions(0, 100) // Obtener todas las transacciones
    ]).pipe(
      map(([cardsResponse, transactionsResponse]) => {
        const cards = cardsResponse.content;
        const transactions = transactionsResponse.content;
        
        // Calcular estadísticas
        const stats: DashboardStats = this.calculateStats(cards, transactions);
        
        // Obtener elementos recientes
        const recentCards = cards
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        const recentTransactions = transactions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        // Generar actividad reciente
        const recentActivity = this.generateRecentActivity(cards, transactions);
        
        return { stats, recentCards, recentTransactions, recentActivity };
      }),
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Error al cargar los datos del dashboard';
        this.isLoading = false;
        throw error;
      })
    ).subscribe({
      next: ({ stats, recentCards, recentTransactions, recentActivity }) => {
        this.stats$.next(stats);
        this.recentCards$.next(recentCards);
        this.recentTransactions$.next(recentTransactions);
        this.recentActivity$.next(recentActivity);
        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private calculateStats(cards: CardDetailsResponse[], transactions: CreateTransactionResponse[]): DashboardStats {
    const approvedTransactions = transactions.filter(t => t.status === TransactionStatus.APPROVED);
    const totalAmount = approvedTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
    return {
      totalCards: cards.length,
      enrolledCards: cards.filter(c => c.status === CardStatus.ENROLLED).length,
      createdCards: cards.filter(c => c.status === CardStatus.CREATED).length,
      inactiveCards: cards.filter(c => c.status === CardStatus.INACTIVE).length,
      totalTransactions: transactions.length,
      approvedTransactions: approvedTransactions.length,
      cancelledTransactions: transactions.filter(t => t.status === TransactionStatus.CANCELLED).length,
      rejectedTransactions: transactions.filter(t => t.status === TransactionStatus.REJECTED).length,
      totalAmount,
      avgTransactionAmount: approvedTransactions.length > 0 ? totalAmount / approvedTransactions.length : 0
    };
  }

  private generateRecentActivity(cards: CardDetailsResponse[], transactions: CreateTransactionResponse[]): RecentActivity[] {
    const activities: RecentActivity[] = [];
    
    // Actividades de tarjetas recientes
    cards
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach(card => {
        activities.push({
          type: 'card',
          action: this.getCardAction(card.status),
          description: `Tarjeta ${this.maskPan(card.identifier)} - ${card.holderName}`,
          timestamp: new Date(card.createdAt),
          status: card.status
        });
      });
    
    // Actividades de transacciones recientes
    transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach(transaction => {
        activities.push({
          type: 'transaction',
          action: this.getTransactionAction(transaction.status),
          description: `${this.formatAmount(transaction.totalAmount)} - ${transaction.referenceNumber}`,
          timestamp: new Date(transaction.createdAt),
          status: transaction.status
        });
      });
    
    // Ordenar por timestamp más reciente
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
  }

  private getCardAction(status: CardStatus): string {
    switch (status) {
      case CardStatus.CREATED: return 'Tarjeta creada';
      case CardStatus.ENROLLED: return 'Tarjeta activada';
      case CardStatus.INACTIVE: return 'Tarjeta desactivada';
      default: return 'Acción de tarjeta';
    }
  }

  private getTransactionAction(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.APPROVED: return 'Transacción aprobada';
      case TransactionStatus.CANCELLED: return 'Transacción cancelada';
      case TransactionStatus.REJECTED: return 'Transacción rechazada';
      default: return 'Transacción procesada';
    }
  }

  maskPan(pan: string): string {
    return this.cardService.maskPan(pan);
  }

  formatAmount(amount: number): string {
    return this.transactionService.formatAmount(amount);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getActivityStatusClass(activity: RecentActivity): string {
    if (activity.type === 'card') {
      return this.getCardStatusClass(activity.status as CardStatus);
    } else {
      return this.getTransactionStatusClass(activity.status as TransactionStatus);
    }
  }

  getCardStatusClass(status: CardStatus): string {
    switch (status) {
      case CardStatus.ENROLLED: return 'enrolled';
      case CardStatus.CREATED: return 'created';
      case CardStatus.INACTIVE: return 'inactive';
      default: return '';
    }
  }

  getTransactionStatusClass(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.APPROVED: return 'approved';
      case TransactionStatus.CANCELLED: return 'cancelled';
      case TransactionStatus.REJECTED: return 'rejected';
      default: return '';
    }
  }

  getActivityIcon(activity: RecentActivity): string {
    if (activity.type === 'card') {
      switch (activity.status) {
        case CardStatus.CREATED: return 'add_card';
        case CardStatus.ENROLLED: return 'check_circle';
        case CardStatus.INACTIVE: return 'block';
        default: return 'credit_card';
      }
    } else {
      switch (activity.status) {
        case TransactionStatus.APPROVED: return 'check_circle';
        case TransactionStatus.CANCELLED: return 'cancel';
        case TransactionStatus.REJECTED: return 'error';
        default: return 'payment';
      }
    }
  }

  getStatsIcon(statType: string): string {
    switch (statType) {
      case 'totalCards': return 'credit_card';
      case 'enrolledCards': return 'check_circle';
      case 'createdCards': return 'add_circle';
      case 'inactiveCards': return 'block';
      case 'totalTransactions': return 'receipt';
      case 'approvedTransactions': return 'done_all';
      case 'cancelledTransactions': return 'cancel';
      case 'rejectedTransactions': return 'error_outline';
      case 'totalAmount': return 'monetization_on';
      default: return 'analytics';
    }
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  }
}