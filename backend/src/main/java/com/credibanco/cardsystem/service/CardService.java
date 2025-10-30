package com.credibanco.cardsystem.service;

import com.credibanco.cardsystem.dto.*;
import com.credibanco.cardsystem.exception.CardNotFoundException;
import com.credibanco.cardsystem.exception.InvalidCardStatusException;
import com.credibanco.cardsystem.model.Card;
import com.credibanco.cardsystem.model.CardStatus;
import com.credibanco.cardsystem.repository.CardRepository;
import com.credibanco.cardsystem.util.CardUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {

    private final CardRepository cardRepository;
    private final AuditService auditService;

    @Transactional
    public CreateCardResponse createCard(CreateCardRequest request) {
        if (cardRepository.existsByPan(request.getPan())) {
            throw new InvalidCardStatusException("Card with this PAN already exists");
        }

        String identifier = CardUtils.generateIdentifier(request.getPan(), request.getDocumentNumber());
        String validationNumber = CardUtils.generateValidationNumber();

        Card card = Card.builder()
                .identifier(identifier)
                .pan(request.getPan())
                .holderName(request.getHolderName())
                .documentNumber(request.getDocumentNumber())
                .cardType(request.getCardType())
                .phoneNumber(request.getPhoneNumber())
                .status(CardStatus.CREATED)
                .validationNumber(validationNumber)
                .build();

        Card savedCard = cardRepository.save(card);
        
        auditService.logAction(
                "CREATE",
                "Card",
                savedCard.getIdentifier(),
                "Card created with PAN: " + CardUtils.maskPan(savedCard.getPan())
        );

        log.info("Card created with identifier: {}", identifier);

        return CreateCardResponse.builder()
                .identifier(identifier)
                .maskedPan(CardUtils.maskPan(request.getPan()))
                .validationNumber(validationNumber)
                .build();
    }

    @Transactional
    public void enrollCard(EnrollCardRequest request) {
        Card card = cardRepository.findByIdentifier(request.getIdentifier())
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (card.getStatus() != CardStatus.CREATED) {
            throw new InvalidCardStatusException("Card must be in CREATED status to be enrolled");
        }

        if (!request.getValidationNumber().equals(card.getValidationNumber())) {
            throw new InvalidCardStatusException("Invalid validation number");
        }

        card.setStatus(CardStatus.ENROLLED);
        cardRepository.save(card);

        auditService.logAction(
                "ENROLL",
                "Card",
                card.getIdentifier(),
                "Card enrolled successfully"
        );

        log.info("Card enrolled with identifier: {}", request.getIdentifier());
    }

    public CardDetailsResponse getCardDetails(String identifier) {
        Card card = cardRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        return CardDetailsResponse.builder()
                .identifier(card.getIdentifier())
                .maskedPan(CardUtils.maskPan(card.getPan()))
                .holderName(card.getHolderName())
                .documentNumber(card.getDocumentNumber())
                .cardType(card.getCardType())
                .phoneNumber(card.getPhoneNumber())
                .status(card.getStatus())
                .createdAt(card.getCreatedAt())
                .build();
    }

    @Transactional
    public void deactivateCard(String identifier) {
        Card card = cardRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (card.getStatus() == CardStatus.INACTIVE) {
            throw new InvalidCardStatusException("Card is already inactive");
        }

        card.setStatus(CardStatus.INACTIVE);
        cardRepository.save(card);

        auditService.logAction(
                "DEACTIVATE",
                "Card",
                card.getIdentifier(),
                "Card deactivated"
        );

        log.info("Card deactivated with identifier: {}", identifier);
    }

    public Card findByIdentifier(String identifier) {
        return cardRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));
    }

    public Card findById(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));
    }

    public Page<CardDetailsResponse> getAllCards(Pageable pageable) {
        log.info("Consultando todas las tarjetas con paginación: página {}, tamaño {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Card> cardsPage = cardRepository.findAll(pageable);
        
        Page<CardDetailsResponse> responsePage = cardsPage.map(card -> CardDetailsResponse.builder()
                .identifier(card.getIdentifier())
                .maskedPan(CardUtils.maskPan(card.getPan()))
                .holderName(card.getHolderName())
                .documentNumber(card.getDocumentNumber())
                .cardType(card.getCardType())
                .phoneNumber(card.getPhoneNumber())
                .status(card.getStatus())
                .createdAt(card.getCreatedAt())
                .build());
        
        log.info("Obtenidas {} tarjetas de un total de {} en página {}", 
                responsePage.getNumberOfElements(), responsePage.getTotalElements(), 
                responsePage.getNumber());
        
        return responsePage;
    }
}