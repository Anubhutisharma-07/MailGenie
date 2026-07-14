package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service managing logic and analysis for API execution metrics.
 */
@Service
@RequiredArgsConstructor
public class ApiRequestMetricService {

    private final ApiRequestMetricRepository repository;

    @Transactional
    public ApiRequestMetric saveMetric(ApiRequestMetric metric) {
        return repository.save(metric);
    }

    public List<ApiRequestMetric> getAllMetrics() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    /**
     * Aggregates database values into a summary map for presentation in the frontend dashboard.
     */
    public Map<String, Object> getMetricsSummary() {
        List<ApiRequestMetric> metrics = repository.findAll();
        Map<String, Object> summary = new HashMap<>();

        long total = metrics.size();
        summary.put("totalRequests", total);

        if (total == 0) {
            summary.put("averageDurationMs", 0.0);
            summary.put("successRatePercent", 0.0);
            summary.put("providerBreakdown", new HashMap<String, Long>());
            return summary;
        }

        // Calculate average duration
        double avgDuration = metrics.stream()
                .mapToLong(ApiRequestMetric::getDurationMs)
                .average()
                .orElse(0.0);
        summary.put("averageDurationMs", Math.round(avgDuration * 100.0) / 100.0);

        // Calculate success rate
        long successCount = metrics.stream()
                .filter(m -> "SUCCESS".equalsIgnoreCase(m.getStatus()))
                .count();
        double successRate = ((double) successCount / total) * 100.0;
        summary.put("successRatePercent", Math.round(successRate * 100.0) / 100.0);

        // Calculate provider breakdown counts
        Map<String, Long> providerCounts = metrics.stream()
                .collect(Collectors.groupingBy(
                        ApiRequestMetric::getProvider,
                        Collectors.counting()
                ));
        summary.put("providerBreakdown", providerCounts);

        return summary;
    }
}
