package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSecurityEncryptionVaultServiceTest {

    private EmailSecurityEncryptionVaultService vaultService;

    @BeforeEach
    public void setUp() {
        vaultService = new EmailSecurityEncryptionVaultService();
    }

    @Test
    public void testEncryptionAndDecryptionRoundtrip() {
        String original = "Confidential Enterprise Strategy Document 2026";
        EncryptedEmailPayload payload = vaultService.encryptEmail(original);

        assertNotNull(payload);
        assertNotNull(payload.getCipherText());
        assertNotNull(payload.getInitializationVector());

        String decrypted = vaultService.decryptEmail(payload);
        assertEquals(original, decrypted);
    }
}
