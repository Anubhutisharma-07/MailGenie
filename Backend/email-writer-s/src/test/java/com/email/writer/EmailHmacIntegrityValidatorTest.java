package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailHmacIntegrityValidatorTest {

    @Test
    public void testHmacIntegrityVerification() {
        EmailHmacIntegrityValidator validator = new EmailHmacIntegrityValidator();
        String secret = "SuperSecretKey123";
        String content = "Hello World";
        String sig = validator.computeHmacSignature(content, secret);

        assertTrue(validator.verifyIntegrity(content, secret, sig));
        assertFalse(validator.verifyIntegrity("Hello World Tampered", secret, sig));
    }
}
