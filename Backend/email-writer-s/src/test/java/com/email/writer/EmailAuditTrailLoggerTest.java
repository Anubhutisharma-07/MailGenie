package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailAuditTrailLoggerTest {

    @Test
    public void testAuditLogging() {
        EmailAuditTrailLogger logger = new EmailAuditTrailLogger();
        logger.logAudit("usr-100", "GENERATE_EMAIL", "Generated response for prompt");
        assertEquals(1, logger.getAuditLogs().size());
    }
}
