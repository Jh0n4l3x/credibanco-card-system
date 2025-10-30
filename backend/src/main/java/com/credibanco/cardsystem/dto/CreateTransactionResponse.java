package com.credibanco.cardsystem.dto;

import com.credibanco.cardsystem.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionResponse {
    private String referenceNumber;
    private String cardIdentifier;
    private BigDecimal totalAmount;
    private String purchaseAddress;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}