package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailFormattingSanitizerTest {

    @Test
    public void testSanitizeSpaces() {
        EmailFormattingSanitizer sanitizer = new EmailFormattingSanitizer();
        String result = sanitizer.sanitizeAndFormat("Hello   world  from   MailGenie.");
        assertEquals("Hello world from MailGenie.", result);
    }
}
