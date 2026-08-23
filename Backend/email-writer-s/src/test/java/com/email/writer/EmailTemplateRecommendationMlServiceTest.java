package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EmailTemplateRecommendationMlServiceTest {

    private EmailTemplateRecommendationMlService service;

    @BeforeEach
    public void setUp() {
        service = new EmailTemplateRecommendationMlService();
    }

    @Test
    public void testMeetingRequestRecommendation() {
        List<EmailTemplateRecommendationResult> res = service.recommendTemplates("Schedule a meeting with client", "SALES");
        assertFalse(res.isEmpty());
        assertEquals("MEETING_REQUEST", res.get(0).getCategory());
        assertTrue(res.get(0).getRelevanceScore() > 0.90);
    }

    @Test
    public void testFollowUpRecommendation() {
        List<EmailTemplateRecommendationResult> res = service.recommendTemplates("Follow up on project status", "ENGINEERING");
        assertFalse(res.isEmpty());
        assertEquals("FOLLOW_UP", res.get(0).getCategory());
    }
}
