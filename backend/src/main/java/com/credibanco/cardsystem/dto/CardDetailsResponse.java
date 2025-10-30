package com.credibanco.cardsystem.dto;

import com.credibanco.cardsystem.model.CardStatus;
import com.credibanco.cardsystem.model.CardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDetailsResponse {
    private String identifier;
    private String maskedPan;
    private String holderName;
    private String documentNumber;
    private CardType cardType;
    private String phoneNumber;
    private CardStatus status;
    private LocalDateTime createdAt;
}