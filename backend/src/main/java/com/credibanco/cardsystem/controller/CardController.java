package com.credibanco.cardsystem.controller;

import com.credibanco.cardsystem.dto.CardDetailsResponse;
import com.credibanco.cardsystem.dto.CreateCardRequest;
import com.credibanco.cardsystem.dto.CreateCardResponse;
import com.credibanco.cardsystem.dto.EnrollCardRequest;
import com.credibanco.cardsystem.service.CardService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
@RequestMapping("/cards")
@RequiredArgsConstructor
@Validated
public class CardController {

    private final CardService cardService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateCardResponse> createCard(@Valid @RequestBody CreateCardRequest request) {
        log.info("Iniciando creación de tarjeta para cliente: {}", request.getDocumentNumber());
        
        try {
            CreateCardResponse response = cardService.createCard(request);
            log.info("Tarjeta creada exitosamente con ID: {}", response.getIdentifier());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error al crear tarjeta para cliente {}: {}", request.getDocumentNumber(), e.getMessage());
            throw e;
        }
    }

    @PutMapping(value = "/enroll", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> enrollCard(@Valid @RequestBody EnrollCardRequest request) {
        log.info("Iniciando activación de tarjeta: {}", request.getIdentifier());
        
        try {
            cardService.enrollCard(request);
            log.info("Tarjeta {} activada exitosamente", request.getIdentifier());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error al activar tarjeta {}: {}", request.getIdentifier(), e.getMessage());
            throw e;
        }
    }

    @GetMapping(value = "/{identifier}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CardDetailsResponse> getCardDetails(
            @PathVariable @NotBlank(message = "El identificador de la tarjeta no puede estar vacío")
            String identifier) {
        
        log.info("Consultando detalles de tarjeta: {}", identifier);
        
        try {
            CardDetailsResponse response = cardService.getCardDetails(identifier);
            log.info("Detalles de tarjeta {} obtenidos exitosamente", identifier);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al consultar tarjeta {}: {}", identifier, e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{identifier}")
    public ResponseEntity<Void> deactivateCard(
            @PathVariable @NotBlank(message = "El identificador de la tarjeta no puede estar vacío")
            String identifier) {
        
        log.info("Iniciando desactivación de tarjeta: {}", identifier);
        
        try {
            cardService.deactivateCard(identifier);
            log.info("Tarjeta {} desactivada exitosamente", identifier);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error al desactivar tarjeta {}: {}", identifier, e.getMessage());
            throw e;
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<CardDetailsResponse>> getAllCards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("Consultando todas las tarjetas - Página: {}, Tamaño: {}, Ordenar por: {}, Dirección: {}", 
                page, size, sortBy, sortDir);
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<CardDetailsResponse> cards = cardService.getAllCards(pageable);
            log.info("Obtenidas {} tarjetas de un total de {}", cards.getNumberOfElements(), cards.getTotalElements());
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            log.error("Error al consultar todas las tarjetas: {}", e.getMessage());
            throw e;
        }
    }
}