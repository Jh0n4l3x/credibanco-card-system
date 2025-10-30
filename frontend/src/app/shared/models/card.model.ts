export interface Card {
  id?: number;
  identifier: string;
  maskedPan?: string;
  pan?: string;
  holderName: string;
  documentNumber: string;
  phoneNumber: string;
  cardType: CardType;
  status: CardStatus;
  validationNumber?: string;
  createdAt?: string;
}

export interface CardDetailsResponse {
  identifier: string;
  maskedPan: string;
  holderName: string;
  documentNumber: string;
  cardType: CardType;
  phoneNumber: string;
  status: CardStatus;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export enum CardType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum CardStatus {
  CREATED = 'CREATED',
  ENROLLED = 'ENROLLED',
  INACTIVE = 'INACTIVE'
}

export interface CardRequest {
  pan: string;
  holderName: string;
  documentNumber: string;
  phoneNumber: string;
  cardType: CardType;
}

export interface CreateCardResponse {
  identifier: string;
  maskedPan: string;
  validationNumber: string;
}

export interface CardEnrollRequest {
  identifier: string;
  validationNumber: string;
}