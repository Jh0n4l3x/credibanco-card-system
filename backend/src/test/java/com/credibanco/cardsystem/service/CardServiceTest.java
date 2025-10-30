package com.credibanco.cardsystem.service;

import com.credibanco.cardsystem.dto.CreateCardRequest;
import com.credibanco.cardsystem.dto.CreateCardResponse;
import com.credibanco.cardsystem.dto.EnrollCardRequest;
import com.credibanco.cardsystem.exception.CardNotFoundException;
import com.credibanco.cardsystem.exception.InvalidCardStatusException;
import com.credibanco.cardsystem.model.Card;
import com.credibanco.cardsystem.model.CardStatus;
import com.credibanco.cardsystem.model.CardType;
import com.credibanco.cardsystem.repository.CardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CardService cardService;

    private CreateCardRequest createCardRequest;
    private Card card;

    @BeforeEach
    void setUp() {
        createCardRequest = CreateCardRequest.builder()
                .pan("1234567890123456")
                .holderName("John Doe")
                .documentNumber("12345678")
                .cardType(CardType.CREDIT)
                .phoneNumber("+1234567890")
                .build();

        card = Card.builder()
                .id(1L)
                .identifier("test-identifier")
                .pan("1234567890123456")
                .holderName("John Doe")
                .documentNumber("12345678")
                .cardType(CardType.CREDIT)
                .phoneNumber("+1234567890")
                .status(CardStatus.CREATED)
                .validationNumber("123456")
                .build();
    }

    @Test
    void createCard_Success() {
        when(cardRepository.existsByPan(anyString())).thenReturn(false);
        when(cardRepository.save(any(Card.class))).thenReturn(card);

        CreateCardResponse response = cardService.createCard(createCardRequest);

        assertNotNull(response);
        assertNotNull(response.getIdentifier());
        assertEquals("1234********3456", response.getMaskedPan());
        assertNotNull(response.getValidationNumber());

        verify(cardRepository).existsByPan(createCardRequest.getPan());
        verify(cardRepository).save(any(Card.class));
        verify(auditService).logAction(eq("CREATE"), eq("Card"), anyString(), anyString());
    }

    @Test
    void createCard_PanAlreadyExists_ThrowsException() {
        when(cardRepository.existsByPan(anyString())).thenReturn(true);

        assertThrows(InvalidCardStatusException.class, () -> cardService.createCard(createCardRequest));

        verify(cardRepository).existsByPan(createCardRequest.getPan());
        verify(cardRepository, never()).save(any(Card.class));
    }

    @Test
    void enrollCard_Success() {
        EnrollCardRequest enrollRequest = EnrollCardRequest.builder()
                .identifier("test-identifier")
                .validationNumber("123456")
                .build();

        when(cardRepository.findByIdentifier(anyString())).thenReturn(Optional.of(card));
        when(cardRepository.save(any(Card.class))).thenReturn(card);

        assertDoesNotThrow(() -> cardService.enrollCard(enrollRequest));

        verify(cardRepository).findByIdentifier(enrollRequest.getIdentifier());
        verify(cardRepository).save(any(Card.class));
        verify(auditService).logAction(eq("ENROLL"), eq("Card"), anyString(), anyString());
    }

    @Test
    void enrollCard_CardNotFound_ThrowsException() {
        EnrollCardRequest enrollRequest = EnrollCardRequest.builder()
                .identifier("non-existent")
                .validationNumber("123456")
                .build();

        when(cardRepository.findByIdentifier(anyString())).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> cardService.enrollCard(enrollRequest));

        verify(cardRepository).findByIdentifier(enrollRequest.getIdentifier());
        verify(cardRepository, never()).save(any(Card.class));
    }

    @Test
    void enrollCard_InvalidValidationNumber_ThrowsException() {
        EnrollCardRequest enrollRequest = EnrollCardRequest.builder()
                .identifier("test-identifier")
                .validationNumber("wrong")
                .build();

        when(cardRepository.findByIdentifier(anyString())).thenReturn(Optional.of(card));

        assertThrows(InvalidCardStatusException.class, () -> cardService.enrollCard(enrollRequest));

        verify(cardRepository).findByIdentifier(enrollRequest.getIdentifier());
        verify(cardRepository, never()).save(any(Card.class));
    }

    @Test
    void deactivateCard_Success() {
        card.setStatus(CardStatus.ENROLLED);
        when(cardRepository.findByIdentifier(anyString())).thenReturn(Optional.of(card));
        when(cardRepository.save(any(Card.class))).thenReturn(card);

        assertDoesNotThrow(() -> cardService.deactivateCard("test-identifier"));

        verify(cardRepository).findByIdentifier("test-identifier");
        verify(cardRepository).save(any(Card.class));
        verify(auditService).logAction(eq("DEACTIVATE"), eq("Card"), anyString(), anyString());
    }

    @Test
    void deactivateCard_CardNotFound_ThrowsException() {
        when(cardRepository.findByIdentifier(anyString())).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> cardService.deactivateCard("non-existent"));

        verify(cardRepository).findByIdentifier("non-existent");
        verify(cardRepository, never()).save(any(Card.class));
    }
}