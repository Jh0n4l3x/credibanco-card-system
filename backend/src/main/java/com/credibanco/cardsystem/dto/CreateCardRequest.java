package com.credibanco.cardsystem.dto;

import com.credibanco.cardsystem.model.CardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCardRequest {

    @NotBlank(message = "PAN is required")
    @Pattern(regexp = "^\\d{16}$", message = "PAN must be exactly 16 digits")
    private String pan;

    @NotBlank(message = "Holder name is required")
    @Size(max = 100, message = "Holder name must not exceed 100 characters")
    private String holderName;

    @NotBlank(message = "Document number is required")
    @Size(max = 20, message = "Document number must not exceed 20 characters")
    private String documentNumber;

    @NotNull(message = "Card type is required")
    private CardType cardType;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number format is invalid")
    private String phoneNumber;
}