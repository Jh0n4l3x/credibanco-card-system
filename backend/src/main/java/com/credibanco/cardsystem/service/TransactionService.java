package com.credibanco.cardsystem.service;

import com.credibanco.cardsystem.dto.CancelTransactionRequest;
import com.credibanco.cardsystem.dto.CreateTransactionRequest;
import com.credibanco.cardsystem.dto.CreateTransactionResponse;
import com.credibanco.cardsystem.exception.InvalidCardStatusException;
import com.credibanco.cardsystem.exception.TransactionCancellationException;
import com.credibanco.cardsystem.exception.TransactionNotFoundException;
import com.credibanco.cardsystem.model.Card;
import com.credibanco.cardsystem.model.CardStatus;
import com.credibanco.cardsystem.model.Transaction;
import com.credibanco.cardsystem.model.TransactionStatus;
import com.credibanco.cardsystem.repository.TransactionRepository;
import com.credibanco.cardsystem.util.CardUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CardService cardService;
    private final AuditService auditService;

    @Transactional
    public CreateTransactionResponse createTransaction(CreateTransactionRequest request) {
        Card card = cardService.findByIdentifier(request.getCardIdentifier());

        if (card.getStatus() != CardStatus.ENROLLED) {
            throw new InvalidCardStatusException("Card must be enrolled to create transactions");
        }

        String referenceNumber = CardUtils.generateReferenceNumber();

        Transaction transaction = Transaction.builder()
                .cardId(card.getId())
                .referenceNumber(referenceNumber)
                .totalAmount(request.getTotalAmount())
                .purchaseAddress(request.getPurchaseAddress())
                .status(TransactionStatus.APPROVED)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        auditService.logAction(
                "CREATE",
                "Transaction",
                savedTransaction.getReferenceNumber(),
                "Transaction created for card: " + card.getIdentifier() + 
                " with amount: " + request.getTotalAmount()
        );

        log.info("Transaction created with reference: {}", referenceNumber);

        return CreateTransactionResponse.builder()
                .referenceNumber(referenceNumber)
                .cardIdentifier(request.getCardIdentifier())
                .totalAmount(request.getTotalAmount())
                .purchaseAddress(request.getPurchaseAddress())
                .status(TransactionStatus.APPROVED)
                .createdAt(savedTransaction.getCreatedAt())
                .build();
    }

    @Transactional
    public void cancelTransaction(CancelTransactionRequest request) {
        Transaction transaction = transactionRepository.findByReferenceNumber(request.getReferenceNumber())
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        if (transaction.getStatus() != TransactionStatus.APPROVED) {
            throw new TransactionCancellationException("Only approved transactions can be cancelled");
        }

        LocalDateTime now = LocalDateTime.now();
        Duration timeDiff = Duration.between(transaction.getCreatedAt(), now);

        if (timeDiff.toMinutes() > 5) {
            throw new TransactionCancellationException("Transaction can only be cancelled within 5 minutes of creation");
        }

        transaction.setStatus(TransactionStatus.CANCELLED);
        transactionRepository.save(transaction);

        auditService.logAction(
                "CANCEL",
                "Transaction",
                transaction.getReferenceNumber(),
                "Transaction cancelled"
        );

        log.info("Transaction cancelled with reference: {}", request.getReferenceNumber());
    }

    public Page<CreateTransactionResponse> getAllTransactions(Pageable pageable) {
        log.info("Consultando todas las transacciones con paginación: página {}, tamaño {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Transaction> transactionsPage = transactionRepository.findAll(pageable);
        
        Page<CreateTransactionResponse> responsePage = transactionsPage.map(transaction -> {
            // Necesitamos obtener el cardIdentifier desde la Card asociada
            Card card = cardService.findById(transaction.getCardId());
            
            return CreateTransactionResponse.builder()
                    .referenceNumber(transaction.getReferenceNumber())
                    .cardIdentifier(card.getIdentifier())
                    .totalAmount(transaction.getTotalAmount())
                    .purchaseAddress(transaction.getPurchaseAddress())
                    .status(transaction.getStatus())
                    .createdAt(transaction.getCreatedAt())
                    .build();
        });
        
        log.info("Obtenidas {} transacciones de un total de {} en página {}", 
                responsePage.getNumberOfElements(), responsePage.getTotalElements(), 
                responsePage.getNumber());
        
        return responsePage;
    }
}