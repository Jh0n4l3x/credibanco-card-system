package com.credibanco.cardsystem.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class CardUtils {

    private static final SecureRandom random = new SecureRandom();

    public static String maskPan(String pan) {
        if (pan == null || pan.length() != 16) {
            return pan;
        }
        return pan.substring(0, 4) + "********" + pan.substring(12);
    }

    public static String generateIdentifier(String pan, String documentNumber) {
        try {
            String data = pan + documentNumber;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString().substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating identifier", e);
        }
    }

    public static String generateValidationNumber() {
        return String.format("%03d", random.nextInt(100));
    }

    public static String generateReferenceNumber() {
        // Combinar timestamp con número aleatorio para garantizar unicidad
        long timestamp = System.currentTimeMillis();
        int randomPart = random.nextInt(100000);
        return String.format("TXN%d%05d", timestamp, randomPart);
    }
}