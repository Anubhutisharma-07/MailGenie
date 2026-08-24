package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailJwtTokenAuthenticationValidatorTest {

    @Test
    public void testJwtHeaderValidation() {
        EmailJwtTokenAuthenticationValidator validator = new EmailJwtTokenAuthenticationValidator();
        assertTrue(validator.validateJwtStructure("Bearer header.payload.signature"));
        assertFalse(validator.validateJwtStructure("InvalidToken"));
    }
}
