package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EmailToneSentimentServiceTest {

    private EmailToneSentimentService service;

    @BeforeEach
    public void setUp() {
        service = new EmailToneSentimentService();
    }

    @Test
    public void testAnalyzeProfessionalEmail() {
        String email = "Dear Team, Pursuant to our earlier discussion, kindly find enclosed the stipulated report. Sincerely, John.";
        EmailToneAnalysis result = service.analyzeEmail(email);

        assertNotNull(result);
        assertEquals("PROFESSIONAL", result.getDetectedTone());
        assertTrue(result.getFormalityScore() > 0.0);
        assertTrue(result.getWordCount() > 0);
    }

    @Test
    public void testAnalyzeUrgentEmail() {
        String email = "URGENT: Action required immediately ASAP by EOD. Please escalate this priority task!";
        EmailToneAnalysis result = service.analyzeEmail(email);

        assertNotNull(result);
        assertEquals("URGENT", result.getDetectedTone());
        assertTrue(result.getUrgencyScore() > 0.3);
    }

    @Test
    public void testAnalyzeApologeticEmail() {
        String email = "We sincerely apologize for the delay and problem caused by this server error.";
        EmailToneAnalysis result = service.analyzeEmail(email);

        assertNotNull(result);
        assertEquals("APOLOGETIC", result.getDetectedTone());
        assertTrue(result.getSentimentScore() < 0.0);
    }
}
