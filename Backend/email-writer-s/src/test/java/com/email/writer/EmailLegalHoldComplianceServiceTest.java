package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailLegalHoldComplianceServiceTest {

    @Test
    public void testLegalHoldToggle() {
        EmailLegalHoldComplianceService service = new EmailLegalHoldComplianceService();
        service.applyLegalHold("EML-999");
        assertTrue(service.isUnderLegalHold("EML-999"));

        service.releaseLegalHold("EML-999");
        assertFalse(service.isUnderLegalHold("EML-999"));
    }
}
