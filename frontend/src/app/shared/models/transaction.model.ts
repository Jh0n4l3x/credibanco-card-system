export interface Transaction {
  referenceNumber: string;
  cardIdentifier: string;
  totalAmount: number;
  purchaseAddress: string;
  status: TransactionStatus;
  createdAt?: string;
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

export enum TransactionStatus {
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface TransactionRequest {
  cardIdentifier: string;
  totalAmount: number;
  purchaseAddress: string;
}

export interface CreateTransactionResponse {
  referenceNumber: string;
  cardIdentifier: string;
  totalAmount: number;
  purchaseAddress: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionCancelRequest {
  referenceNumber: string;
}