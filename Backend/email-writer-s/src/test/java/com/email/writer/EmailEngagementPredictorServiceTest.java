package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailEngagementPredictorServiceTest {

    @Test
    public void testEngagementPrediction() {
        EmailEngagementPredictorService service = new EmailEngagementPredictorService();
        Map<String, Object> result = service.predictEngagement("Quick question?", "Hi Alice, would love to schedule 15 minutes to review the proposal.");
        assertEquals("55%", result.get("predictedOpenRate"));
    }
}
