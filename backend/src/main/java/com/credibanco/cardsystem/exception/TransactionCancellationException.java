package com.credibanco.cardsystem.exception;

public class TransactionCancellationException extends RuntimeException {
    public TransactionCancellationException(String message) {
        super(message);
    }
}