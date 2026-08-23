package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service for enforcing Rate Limits and Quotas based on tiered routing schemas.
 */
@Service
@RequiredArgsConstructor
public class QuotaManagementService {

    private final QuotaRuleRepository ruleRepository;
    private final UserQuotaMetricRepository metricRepository;
    private final TelemetryService telemetryService;

    public List<QuotaRule> getRules() {
        return ruleRepository.findAll();
    }

    @Transactional
    public QuotaRule saveRule(QuotaRule rule) {
        return ruleRepository.save(rule);
    }

    public List<UserQuotaMetric> getMetrics() {
        return metricRepository.findAll();
    }

    /**
     * Seeds default logic rules for high-velocity sandbox environments
     */
    @Transactional
    public void seedDefaultTiers() {
        if (ruleRepository.count() == 0) {
            ruleRepository.save(QuotaRule.builder().tierName("FREE").dailyGenerationLimit(10L).maxTokensPerMonth(10000L)
                    .enforceHardLimits(true).bandwidthThrottleKbps(512L).build());
            ruleRepository.save(QuotaRule.builder().tierName("PRO").dailyGenerationLimit(500L)
                    .maxTokensPerMonth(2000000L).enforceHardLimits(false).bandwidthThrottleKbps(10000L).build());
            ruleRepository.save(QuotaRule.builder().tierName("ENTERPRISE").dailyGenerationLimit(10000L)
                    .maxTokensPerMonth(50000000L).enforceHardLimits(false).bandwidthThrottleKbps(0L).build());
        }
    }

    /**
     * Primary interception logic to decrement/consume tokens.
     */
    @Transactional
    public Map<String, Object> consumeAndValidateTokens(String userId, long requestedTokens) {
        // Fallback user ID for non-auth simulation
        if (userId == null || userId.trim().isEmpty()) {
            userId = "DEMO-" + UUID.randomUUID().toString().substring(0, 8);
        }

        UserQuotaMetric metric = metricRepository.findByUserId(userId).orElseGet(() -> UserQuotaMetric.builder()
                .userId(userId)
                .assignedTier("FREE")
                .generationsToday(0L)
                .tokensUsedThisMonth(0L)
                .build());

        Optional<QuotaRule> targetRule = ruleRepository.findByTierName(metric.getAssignedTier());
        if (targetRule.isEmpty()) {
            throw new RuntimeException("CRITICAL: Assigned tier " + metric.getAssignedTier() + " is orphaned.");
        }

        QuotaRule rule = targetRule.get();
        boolean isBlocked = false;
        String reason = "";

        // Validation Checks
        if (rule.getEnforceHardLimits()) {
            if (metric.getGenerationsToday() + 1 > rule.getDailyGenerationLimit()) {
                isBlocked = true;
                reason = "RATE_LIMIT_EXCEEDED (DAILY)";
            } else if (metric.getTokensUsedThisMonth() + requestedTokens > rule.getMaxTokensPerMonth()) {
                isBlocked = true;
                reason = "INSUFFICIENT_TOKENS_MONTHLY";
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("allowed", !isBlocked);
        response.put("rule", rule.getTierName());

        if (!isBlocked) {
            metric.setGenerationsToday(metric.getGenerationsToday() + 1);
            metric.setTokensUsedThisMonth(metric.getTokensUsedThisMonth() + requestedTokens);
            metricRepository.save(metric);

            response.put("tokensRemaining", rule.getMaxTokensPerMonth() - metric.getTokensUsedThisMonth());
            response.put("generationsRemaining", rule.getDailyGenerationLimit() - metric.getGenerationsToday());
        } else {
            response.put("blockReason", reason);
            response.put("tokensRemaining", 0);

            // Log telemetry for security alerts
            telemetryService.logTelemetry("quota_engine", "/tokens/consume", 0L, "RATE_LIMITED", userId,
                    (int) requestedTokens);
        }

        return response;
    }
}
