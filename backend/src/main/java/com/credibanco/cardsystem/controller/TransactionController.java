package com.credibanco.cardsystem.controller;

import com.credibanco.cardsystem.dto.CancelTransactionRequest;
import com.credibanco.cardsystem.dto.CreateTransactionRequest;
import com.credibanco.cardsystem.dto.CreateTransactionResponse;
import com.credibanco.cardsystem.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Validated
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateTransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        log.info("Iniciando creación de transacción para tarjeta: {} por monto: {}", 
                request.getCardIdentifier(), request.getTotalAmount());
        
        try {
            CreateTransactionResponse response = transactionService.createTransaction(request);
            log.info("Transacción creada exitosamente con referencia: {}", response.getReferenceNumber());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error al crear transacción para tarjeta {}: {}", 
                    request.getCardIdentifier(), e.getMessage());
            throw e;
        }
    }

    @PutMapping(value = "/cancel", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> cancelTransaction(@Valid @RequestBody CancelTransactionRequest request) {
        log.info("Iniciando cancelación de transacción con referencia: {}", request.getReferenceNumber());
        
        try {
            transactionService.cancelTransaction(request);
            log.info("Transacción {} cancelada exitosamente", request.getReferenceNumber());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error al cancelar transacción {}: {}", request.getReferenceNumber(), e.getMessage());
            throw e;
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<CreateTransactionResponse>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("Consultando todas las transacciones - Página: {}, Tamaño: {}, Ordenar por: {}, Dirección: {}", 
                page, size, sortBy, sortDir);
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<CreateTransactionResponse> transactions = transactionService.getAllTransactions(pageable);
            log.info("Obtenidas {} transacciones de un total de {}", 
                    transactions.getNumberOfElements(), transactions.getTotalElements());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("Error al consultar todas las transacciones: {}", e.getMessage());
            throw e;
        }
    }
}