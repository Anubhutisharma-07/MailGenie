package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class EmailObservabilityTelemetryServiceTest {

    private EmailObservabilityTelemetryService service;

    @BeforeEach
    public void setUp() {
        service = new EmailObservabilityTelemetryService();
    }

    @Test
    public void testRecordAndDashboardAggregation() {
        service.recordMetric("/api/generate", 120, 200, "Mozilla/5.0");
        service.recordMetric("/api/generate", 180, 500, "Mozilla/5.0");

        Map<String, Object> dashboard = service.getTelemetryDashboard();
        assertNotNull(dashboard);
        assertEquals(2, dashboard.get("totalRequests"));
        assertEquals(150.0, dashboard.get("averageLatencyMs"));
        assertEquals(50.0, dashboard.get("errorRatePercentage"));
    }
}
