package com.email.writer;

import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

@Service
public class EmailHmacIntegrityValidator {

    public String computeHmacSignature(String content, String secretKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String combined = content + ":" + secretKey;
            byte[] hash = digest.digest(combined.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 HMAC computation failed", e);
        }
    }

    public boolean verifyIntegrity(String content, String secretKey, String signature) {
        String expected = computeHmacSignature(content, secretKey);
        return expected.equals(signature);
    }
}
