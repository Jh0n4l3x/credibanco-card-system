package com.credibanco.cardsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollCardRequest {

    @NotBlank(message = "Identifier is required")
    private String identifier;

    @NotBlank(message = "Validation number is required")
    @Pattern(regexp = "^\\d{3}$", message = "Validation number must be exactly 3 digits")
    private String validationNumber;
}