package com.email.writer;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class EmailSecurityEncryptionVaultService {

    private SecretKey secretKey;
    private String currentKeyId;

    public EmailSecurityEncryptionVaultService() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            this.secretKey = keyGen.generateKey();
            this.currentKeyId = "KEY-" + UUID.randomUUID().toString().substring(0, 8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize AES key generator", e);
        }
    }

    public EncryptedEmailPayload encryptEmail(String rawContent) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = new byte[12];
            new java.security.SecureRandom().nextBytes(iv);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            byte[] cipherBytes = cipher.doFinal(rawContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return new EncryptedEmailPayload(
                UUID.randomUUID().toString(),
                Base64.getEncoder().encodeToString(cipherBytes),
                Base64.getEncoder().encodeToString(iv),
                currentKeyId,
                LocalDateTime.now()
            );
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public String decryptEmail(EncryptedEmailPayload payload) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = Base64.getDecoder().decode(payload.getInitializationVector());
            GCMParameterSpec parameterSpec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            byte[] decodedCipher = Base64.getDecoder().decode(payload.getCipherText());
            byte[] plainBytes = cipher.doFinal(decodedCipher);
            return new String(plainBytes, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }

    public String getCurrentKeyId() {
        return currentKeyId;
    }
}
