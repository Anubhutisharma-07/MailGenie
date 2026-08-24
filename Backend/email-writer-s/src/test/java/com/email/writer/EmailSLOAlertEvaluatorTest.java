package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSLOAlertEvaluatorTest {

    @Test
    public void testHealthySystemSLO() {
        EmailSLOAlertEvaluator evaluator = new EmailSLOAlertEvaluator();
        Map<String, Object> result = evaluator.evaluateAlerts(120.0, 1.2);
        assertEquals("HEALTHY", result.get("systemHealthStatus"));
        assertEquals(0, result.get("activeAlertCount"));
    }

    @Test
    public void testDegradedLatencySLO() {
        EmailSLOAlertEvaluator evaluator = new EmailSLOAlertEvaluator();
        Map<String, Object> result = evaluator.evaluateAlerts(650.0, 1.2);
        assertEquals("DEGRADED", result.get("systemHealthStatus"));
        assertEquals(1, result.get("activeAlertCount"));
    }
}
