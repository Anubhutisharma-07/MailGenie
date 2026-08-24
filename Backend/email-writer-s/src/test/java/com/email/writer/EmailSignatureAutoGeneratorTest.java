package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSignatureAutoGeneratorTest {

    @Test
    public void testAppendSignature() {
        EmailSignatureAutoGenerator gen = new EmailSignatureAutoGenerator();
        String result = gen.appendSignature("Best regards,", "Alice Smith", "VP Engineering", "MailGenie Inc");
        assertTrue(result.contains("Alice Smith"));
        assertTrue(result.contains("VP Engineering | MailGenie Inc"));
    }
}
