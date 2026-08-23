package com.email.writer;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class EmailObservabilityTelemetryService {

    private final List<EmailObservabilityMetric> metricsLog = new CopyOnWriteArrayList<>();

    public void recordMetric(String endpoint, long latencyMs, int statusCode, String userAgent) {
        EmailObservabilityMetric metric = new EmailObservabilityMetric(
            UUID.randomUUID().toString(),
            endpoint,
            latencyMs,
            statusCode,
            statusCode >= 200 && statusCode < 300,
            userAgent,
            LocalDateTime.now()
        );
        metricsLog.add(metric);
    }

    public Map<String, Object> getTelemetryDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        if (metricsLog.isEmpty()) {
            dashboard.put("totalRequests", 0);
            dashboard.put("averageLatencyMs", 0.0);
            dashboard.put("errorRatePercentage", 0.0);
            dashboard.put("endpointBreakdown", Collections.emptyMap());
            return dashboard;
        }

        int total = metricsLog.size();
        long totalLatency = 0;
        int errorCount = 0;
        Map<String, Integer> endpointCounts = new HashMap<>();

        for (EmailObservabilityMetric m : metricsLog) {
            totalLatency += m.getLatencyMs();
            if (!m.isSuccess()) errorCount++;
            endpointCounts.put(m.getEndpoint(), endpointCounts.getOrDefault(m.getEndpoint(), 0) + 1);
        }

        double avgLatency = (double) totalLatency / total;
        double errorRate = ((double) errorCount / total) * 100.0;

        dashboard.put("totalRequests", total);
        dashboard.put("averageLatencyMs", Math.round(avgLatency * 10.0) / 10.0);
        dashboard.put("errorRatePercentage", Math.round(errorRate * 100.0) / 100.0);
        dashboard.put("endpointBreakdown", endpointCounts);
        return dashboard;
    }

    public List<EmailObservabilityMetric> getRawMetrics() {
        return new ArrayList<>(metricsLog);
    }
}
