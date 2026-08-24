package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailSLOAlertEvaluator {

    public Map<String, Object> evaluateAlerts(double averageLatencyMs, double errorRatePercentage) {
        Map<String, Object> alerts = new HashMap<>();
        List<String> activeAlerts = new ArrayList<>();

        if (averageLatencyMs > 500.0) {
            activeAlerts.add("CRITICAL_LATENCY_SLO_VIOLATION: Average response latency (" + averageLatencyMs + "ms) exceeds threshold (500ms).");
        }

        if (errorRatePercentage > 5.0) {
            activeAlerts.add("HIGH_ERROR_RATE_ALERT: Error rate (" + errorRatePercentage + "%) exceeds 5% error budget.");
        }

        boolean healthy = activeAlerts.isEmpty();
        alerts.put("systemHealthStatus", healthy ? "HEALTHY" : "DEGRADED");
        alerts.put("activeAlertCount", activeAlerts.size());
        alerts.put("alertMessages", activeAlerts);
        return alerts;
    }
}
