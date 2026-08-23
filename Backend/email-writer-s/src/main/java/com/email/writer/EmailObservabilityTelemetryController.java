package com.email.writer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email/observability")
@CrossOrigin(origins = "*")
public class EmailObservabilityTelemetryController {

    @Autowired
    private EmailObservabilityTelemetryService telemetryService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(telemetryService.getTelemetryDashboard());
    }

    @PostMapping("/record")
    public ResponseEntity<String> recordMetric(@RequestBody Map<String, Object> payload) {
        String endpoint = (String) payload.getOrDefault("endpoint", "/api/generate");
        long latencyMs = ((Number) payload.getOrDefault("latencyMs", 150)).longValue();
        int statusCode = ((Number) payload.getOrDefault("statusCode", 200)).intValue();
        String userAgent = (String) payload.getOrDefault("userAgent", "Chrome/MailGenie");

        telemetryService.recordMetric(endpoint, latencyMs, statusCode, userAgent);
        return ResponseEntity.ok("Metric recorded successfully.");
    }
}
