package com.credibanco.cardsystem.config;

import com.credibanco.cardsystem.model.*;
import com.credibanco.cardsystem.repository.CardRepository;
import com.credibanco.cardsystem.repository.TransactionRepository;
import com.credibanco.cardsystem.util.CardUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Profile("test")
@RequiredArgsConstructor
@Slf4j
public class TestDataLoader implements CommandLineRunner {

    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (cardRepository.count() == 0) {
            log.info("Cargando datos de prueba en la base de datos...");
            
            List<Card> cards = createTestCards();
            cardRepository.saveAll(cards);
            log.info("Creadas {} tarjetas de prueba", cards.size());
            
            List<Transaction> transactions = createTestTransactions(cards);
            transactionRepository.saveAll(transactions);
            log.info("Creadas {} transacciones de prueba", transactions.size());
            
            log.info("Datos de prueba cargados exitosamente");
        } else {
            log.info("La base de datos ya contiene datos, omitiendo carga de datos de prueba");
        }
    }

    private List<Card> createTestCards() {
        List<Card> cards = new ArrayList<>();
        String[] nombres = {
            "Juan Pérez", "María González", "Carlos Rodríguez", "Ana Martínez", "Luis García",
            "Carmen López", "José Hernández", "Lucía Sánchez", "Miguel Torres", "Elena Ruiz",
            "David Morales", "Patricia Jiménez", "Antonio Álvarez", "Isabel Romero", "Francisco Navarro",
            "Rosa Serrano", "Manuel Blanco", "Pilar Castro", "Rafael Ortega", "Cristina Delgado"
        };

        String[] documentos = {
            "12345678", "87654321", "11223344", "44332211", "55667788",
            "88776655", "99887766", "66778899", "33445566", "22334455",
            "77889900", "00998877", "55443322", "11009988", "66554433",
            "99776655", "22113344", "77665544", "88990011", "44557799"
        };

        String[] telefonos = {
            "+573001234567", "+573109876543", "+573201122334", "+573304455667", "+573405566778",
            "+573506677889", "+573607788990", "+573708899001", "+573809900112", "+573900112233",
            "+573011223344", "+573122334455", "+573233445566", "+573344556677", "+573455667788",
            "+573566778899", "+573677889900", "+573788990011", "+573899001122", "+573900112234"
        };

        CardType[] tiposTarjeta = {CardType.CREDIT, CardType.DEBIT};
        CardStatus[] estados = {CardStatus.CREATED, CardStatus.ENROLLED, CardStatus.INACTIVE};

        for (int i = 0; i < 20; i++) {
            String pan = generateUniquePan(i);
            String identifier = CardUtils.generateIdentifier(pan, documentos[i]);
            String validationNumber = CardUtils.generateValidationNumber();
            
            Card card = Card.builder()
                    .identifier(identifier)
                    .pan(pan)
                    .holderName(nombres[i])
                    .documentNumber(documentos[i])
                    .cardType(tiposTarjeta[random.nextInt(tiposTarjeta.length)])
                    .phoneNumber(telefonos[i])
                    .status(estados[random.nextInt(estados.length)])
                    .validationNumber(validationNumber)
                    .build();
            
            // Note: createdAt será manejado automáticamente por @CreationTimestamp
            cards.add(card);
        }

        return cards;
    }

    private List<Transaction> createTestTransactions(List<Card> cards) {
        List<Transaction> transactions = new ArrayList<>();
        
        String[] direcciones = {
            "Centro Comercial Andino, Bogotá", "Plaza de Bolívar, Medellín", "Zona Rosa, Cali",
            "Centro Histórico, Cartagena", "Parque 93, Bogotá", "El Poblado, Medellín",
            "San Antonio, Cali", "Getsemaní, Cartagena", "Chapinero, Bogotá", "Laureles, Medellín",
            "Granada, Cali", "Bocagrande, Cartagena", "La Candelaria, Bogotá", "Envigado, Medellín",
            "Ciudad Jardín, Cali", "Manga, Cartagena", "Usaquén, Bogotá", "Sabaneta, Medellín",
            "Versalles, Cali", "Pie de la Popa, Cartagena"
        };

        TransactionStatus[] estados = {TransactionStatus.APPROVED, TransactionStatus.CANCELLED};
        
        // Solo crear transacciones para tarjetas que ya tengan ID
        List<Card> availableCards = cards.stream()
                .filter(card -> card.getId() != null)
                .toList();

        for (int i = 0; i < 25; i++) {
            Card card = availableCards.get(random.nextInt(availableCards.size()));
            
            // Generar referenceNumber único con índice adicional para mayor unicidad
            String referenceNumber = "TXN" + System.currentTimeMillis() + String.format("%03d", i);
            BigDecimal amount = BigDecimal.valueOf(10.0 + (random.nextDouble() * 5587990.0))
                    .setScale(2, RoundingMode.HALF_UP);
            
            Transaction transaction = Transaction.builder()
                    .cardId(card.getId())
                    .referenceNumber(referenceNumber)
                    .totalAmount(amount)
                    .purchaseAddress(direcciones[random.nextInt(direcciones.length)])
                    .status(estados[random.nextInt(estados.length)])
                    .build();
            
            transactions.add(transaction);
            
            // Pequeño delay para asegurar timestamps únicos
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        return transactions;
    }

    private String generateUniquePan(int index) {
        // Generar PANs únicos para prueba
        String base = "123456789012";
        String suffix = String.format("%04d", index);
        return base + suffix;
    }
}