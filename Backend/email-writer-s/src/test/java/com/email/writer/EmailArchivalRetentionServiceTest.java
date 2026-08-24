package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailArchivalRetentionServiceTest {

    private EmailArchivalRetentionService archivalService;

    @BeforeEach
    public void setUp() {
        archivalService = new EmailArchivalRetentionService();
    }

    @Test
    public void testArchivalCompression() {
        String content = "Subject: Urgent Review\n\nPlease find attached the quarterly audit report.";
        EmailArchivalRecord record = archivalService.archiveEmailContent("EML-101", content, 365);

        assertNotNull(record);
        assertNotNull(record.getCompressedContent());
        assertNotNull(record.getChecksum());
        assertEquals("EML-101", record.getOriginalEmailId());
    }
}
