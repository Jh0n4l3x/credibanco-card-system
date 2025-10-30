package com.credibanco.cardsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCardResponse {
    private String identifier;
    private String maskedPan;
    private String validationNumber;
}