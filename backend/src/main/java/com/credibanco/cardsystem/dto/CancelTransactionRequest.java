package com.credibanco.cardsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancelTransactionRequest {

    @NotBlank(message = "Reference number is required")
    private String referenceNumber;
}