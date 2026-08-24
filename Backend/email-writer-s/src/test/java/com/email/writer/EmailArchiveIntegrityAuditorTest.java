package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailArchiveIntegrityAuditorTest {

    @Test
    public void testIntegrityAudit() {
        EmailArchiveIntegrityAuditor auditor = new EmailArchiveIntegrityAuditor();
        assertTrue(auditor.verifyArchiveIntegrity("HASH123", "HASH123"));
        assertFalse(auditor.verifyArchiveIntegrity("HASH123", "CORRUPTED"));
    }
}
