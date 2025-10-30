import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { 
  TransactionRequest, 
  TransactionCancelRequest, 
  CreateTransactionResponse, 
  PageResponse 
} from '@shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/transactions`;
  private http = inject(HttpClient);

  createTransaction(transactionRequest: TransactionRequest): Observable<CreateTransactionResponse> {
    return this.http.post<CreateTransactionResponse>(this.baseUrl, transactionRequest)
      .pipe(catchError(this.handleError));
  }

  getAllTransactions(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Observable<PageResponse<CreateTransactionResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<CreateTransactionResponse>>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  cancelTransaction(cancelRequest: TransactionCancelRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/cancel`, cancelRequest)
      .pipe(catchError(this.handleError));
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'Transacción no encontrada';
          break;
        case 409:
          errorMessage = 'Conflicto en la transacción';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => errorMessage);
  }
}
