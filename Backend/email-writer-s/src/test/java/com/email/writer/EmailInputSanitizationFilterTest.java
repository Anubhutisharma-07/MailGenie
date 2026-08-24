package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailInputSanitizationFilterTest {

    @Test
    public void testXssSanitization() {
        EmailInputSanitizationFilter filter = new EmailInputSanitizationFilter();
        String clean = filter.sanitizeHtmlXss("Hello <script>alert('hack')</script> World");
        assertEquals("Hello  World", clean);
    }
}
