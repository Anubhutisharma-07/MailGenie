package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Controller exposing REST endpoints to access performance metrics.
 */
@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiRequestMetricController {

    private final ApiRequestMetricService service;

    /**
     * Get all raw performance logs.
     */
    @GetMapping
    public ResponseEntity<List<ApiRequestMetric>> getAllMetrics() {
        return ResponseEntity.ok(service.getAllMetrics());
    }

    /**
     * Get aggregated calculations of requests, timings, and success rates.
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(service.getMetricsSummary());
    }
}
