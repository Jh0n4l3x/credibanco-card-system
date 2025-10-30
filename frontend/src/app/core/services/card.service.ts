import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { 
  CardRequest, 
  CardEnrollRequest, 
  CreateCardResponse, 
  CardDetailsResponse, 
  PageResponse 
} from '@shared/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly baseUrl = `${environment.apiBaseUrl}/cards`;
  private http = inject(HttpClient);

  createCard(cardRequest: CardRequest): Observable<CreateCardResponse> {
    return this.http.post<CreateCardResponse>(this.baseUrl, cardRequest)
      .pipe(catchError(this.handleError));
  }

  getCard(identifier: string): Observable<CardDetailsResponse> {
    console.log('CardService.getCard llamado con identificador:', identifier);
    const url = `${this.baseUrl}/${identifier}`;
    console.log('URL de request:', url);
    return this.http.get<CardDetailsResponse>(url)
      .pipe(
        catchError((error) => {
          console.error('Error en CardService.getCard:', error);
          return this.handleError(error);
        })
      );
  }

  getAllCards(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Observable<PageResponse<CardDetailsResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageResponse<CardDetailsResponse>>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  enrollCard(enrollRequest: CardEnrollRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/enroll`, enrollRequest)
      .pipe(catchError(this.handleError));
  }

  deactivateCard(identifier: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${identifier}`)
      .pipe(catchError(this.handleError));
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
          errorMessage = 'Tarjeta no encontrada';
          break;
        case 409:
          errorMessage = 'La tarjeta ya existe';
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
