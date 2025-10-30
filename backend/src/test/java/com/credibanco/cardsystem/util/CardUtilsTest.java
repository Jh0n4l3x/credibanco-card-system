package com.credibanco.cardsystem.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CardUtilsTest {

    @Test
    void maskPan_ValidPan_ReturnsMaskedPan() {
        String pan = "1234567890123456";
        String maskedPan = CardUtils.maskPan(pan);
        
        assertEquals("1234********3456", maskedPan);
    }

    @Test
    void maskPan_InvalidPan_ReturnsOriginal() {
        String pan = "invalid";
        String maskedPan = CardUtils.maskPan(pan);
        
        assertEquals("invalid", maskedPan);
    }

    @Test
    void maskPan_NullPan_ReturnsNull() {
        String maskedPan = CardUtils.maskPan(null);
        
        assertNull(maskedPan);
    }

    @Test
    void generateIdentifier_ValidInputs_ReturnsIdentifier() {
        String pan = "1234567890123456";
        String documentNumber = "12345678";
        
        String identifier = CardUtils.generateIdentifier(pan, documentNumber);
        
        assertNotNull(identifier);
        assertEquals(32, identifier.length());
        assertTrue(identifier.matches("[a-f0-9]+"));
    }

    @Test
    void generateIdentifier_SameInputs_ReturnsSameIdentifier() {
        String pan = "1234567890123456";
        String documentNumber = "12345678";
        
        String identifier1 = CardUtils.generateIdentifier(pan, documentNumber);
        String identifier2 = CardUtils.generateIdentifier(pan, documentNumber);
        
        assertEquals(identifier1, identifier2);
    }

    @Test
    void generateValidationNumber_ReturnsValidFormat() {
        String validationNumber = CardUtils.generateValidationNumber();
        
        assertNotNull(validationNumber);
        assertEquals(6, validationNumber.length());
        assertTrue(validationNumber.matches("\\d{6}"));
    }

    @Test
    void generateReferenceNumber_ReturnsValidFormat() {
        String referenceNumber = CardUtils.generateReferenceNumber();
        
        assertNotNull(referenceNumber);
        assertTrue(referenceNumber.startsWith("TXN"));
        assertTrue(referenceNumber.length() > 3);
    }
}