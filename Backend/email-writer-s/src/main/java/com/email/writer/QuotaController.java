package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class QuotaController {

    private final QuotaManagementService quotaService;

    @GetMapping("/rules")
    public ResponseEntity<List<QuotaRule>> getRules() {
        return ResponseEntity.ok(quotaService.getRules());
    }

    @PostMapping("/rules")
    public ResponseEntity<QuotaRule> saveRule(@RequestBody QuotaRule rule) {
        return ResponseEntity.ok(quotaService.saveRule(rule));
    }

    @GetMapping("/metrics")
    public ResponseEntity<List<UserQuotaMetric>> getMetrics() {
        return ResponseEntity.ok(quotaService.getMetrics());
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> consume(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.getOrDefault("userId", "");
        long size = Long.valueOf(payload.getOrDefault("requestedTokens", 500).toString());
        return ResponseEntity.ok(quotaService.consumeAndValidateTokens(userId, size));
    }

    @PostMapping("/seed")
    public ResponseEntity<Void> seedDefault() {
        quotaService.seedDefaultTiers();
        return ResponseEntity.ok().build();
    }
}
