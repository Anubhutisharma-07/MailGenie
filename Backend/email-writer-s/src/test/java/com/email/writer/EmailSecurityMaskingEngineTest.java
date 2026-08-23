package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSecurityMaskingEngineTest {

    @Test
    public void testMaskingSSN() {
        EmailSecurityMaskingEngine engine = new EmailSecurityMaskingEngine();
        String masked = engine.maskSensitiveData("My SSN is 123-45-6789.");
        assertEquals("My SSN is ***-**-****.", masked);
    }
}
