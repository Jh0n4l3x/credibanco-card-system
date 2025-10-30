package com.credibanco.cardsystem.controller;

import com.credibanco.cardsystem.dto.CreateCardRequest;
import com.credibanco.cardsystem.dto.CreateCardResponse;
import com.credibanco.cardsystem.model.CardType;
import com.credibanco.cardsystem.service.CardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CardController.class)
class CardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CardService cardService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createCard_Success() throws Exception {
        CreateCardRequest request = CreateCardRequest.builder()
                .pan("1234567890123456")
                .holderName("John Doe")
                .documentNumber("12345678")
                .cardType(CardType.CREDIT)
                .phoneNumber("+1234567890")
                .build();

        CreateCardResponse response = CreateCardResponse.builder()
                .identifier("test-identifier")
                .maskedPan("1234********3456")
                .validationNumber("123456")
                .build();

        when(cardService.createCard(any(CreateCardRequest.class))).thenReturn(response);

        mockMvc.perform(post("/cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.identifier").value("test-identifier"))
                .andExpect(jsonPath("$.maskedPan").value("1234********3456"))
                .andExpect(jsonPath("$.validationNumber").value("123456"));
    }

    @Test
    void createCard_InvalidPan_ReturnsBadRequest() throws Exception {
        CreateCardRequest request = CreateCardRequest.builder()
                .pan("invalid-pan")
                .holderName("John Doe")
                .documentNumber("12345678")
                .cardType(CardType.CREDIT)
                .phoneNumber("+1234567890")
                .build();

        mockMvc.perform(post("/cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}