package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Core security engine handling Data Loss Prevention (DLP) logic,
 * PII redaction (Social Security, Credit Cards), and policy enforcement.
 */
@Service
@RequiredArgsConstructor
public class SecurityHubService {

    private final SecurityPolicyRepository repository;
    private final TelemetryService telemetryService;

    public List<SecurityPolicy> getAllPolicies() {
        return repository.findAll();
    }

    @Transactional
    public SecurityPolicy createOrUpdatePolicy(SecurityPolicy policy) {
        return repository.save(policy);
    }

    @Transactional
    public boolean deletePolicy(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Executes DLP scanning against the prompt before sending it to Groq API.
     * Computes threat ratings and blocks execution if High Policy violations occur.
     */
    public Map<String, Object> executeDlpScan(String emailPayload) {
        List<SecurityPolicy> activePolicies = repository.findAll();
        Map<String, Object> results = new HashMap<>();

        long startTime = System.currentTimeMillis();
        boolean isBlocked = false;
        int threatScore = 0;
        List<String> violations = new ArrayList<>();
        String sanitizedPayload = emailPayload;

        for (SecurityPolicy policy : activePolicies) {
            // Check Prohibited Keywords
            if (policy.getProhibitedKeywords() != null && !policy.getProhibitedKeywords().isEmpty()) {
                String[] keywords = policy.getProhibitedKeywords().toLowerCase().split(",");
                for (String kw : keywords) {
                    kw = kw.trim();
                    if (!kw.isEmpty() && sanitizedPayload.toLowerCase().contains(kw)) {
                        violations.add(
                                "Blocked Keyword match: [" + kw + "] against policy [" + policy.getPolicyName() + "]");
                        threatScore += "HIGH".equalsIgnoreCase(policy.getStrictnessLevel()) ? 50 : 20;
                        if ("HIGH".equalsIgnoreCase(policy.getStrictnessLevel())) {
                            isBlocked = true;
                        }
                        // Simple redaction strategy
                        String redaction = new String(new char[kw.length()]).replace('\0', '*');
                        sanitizedPayload = sanitizedPayload.replaceAll("(?i)" + kw, redaction);
                    }
                }
            }

            // Check Hard PII Regexes if DLP is enforced
            if (Boolean.TRUE.equals(policy.getEnforceDataLossPrevention())) {
                boolean hasCreditCard = sanitizedPayload.matches(".*(?:\\d[ -]*?){13,16}.*");
                boolean hasSSN = sanitizedPayload.matches(".*\\d{3}-\\d{2}-\\d{4}.*");

                if (hasCreditCard) {
                    threatScore += 80;
                    violations.add("DLP Triggered: Credit Card / PAN signature detected");
                    isBlocked = true;
                    sanitizedPayload = sanitizedPayload.replaceAll("(?:\\d[ -]*?){13,16}", "[REDACTED-PAN]");
                }

                if (hasSSN) {
                    threatScore += 80;
                    violations.add("DLP Triggered: Social Security Number pattern detected");
                    isBlocked = true;
                    sanitizedPayload = sanitizedPayload.replaceAll("\\d{3}-\\d{2}-\\d{4}", "[REDACTED-SSN]");
                }
            }
        }

        long duration = System.currentTimeMillis() - startTime;

        if (violations.size() > 0) {
            telemetryService.logTelemetry("security_hub", "/dlp/scan", duration,
                    isBlocked ? "BLOCKED" : "WARNING", "ThreatScore:" + threatScore, emailPayload.length());
        }

        results.put("originalLength", emailPayload.length());
        results.put("sanitizedPayload", sanitizedPayload);
        results.put("threatScore", Math.min(threatScore, 100));
        results.put("isBlocked", isBlocked);
        results.put("violations", violations);
        results.put("scanTimeMs", duration);

        return results;
    }

    /**
     * Seed database with default Enterprise Policy if empty
     */
    @Transactional
    public void ensureDefaultPoliciesExist() {
        if (repository.count() == 0) {
            repository.save(SecurityPolicy.builder()
                    .policyName("Baseline Enterprise DLP")
                    .prohibitedKeywords("confidential, internal-use-only, salary")
                    .enforceDataLossPrevention(true)
                    .requireAuditLog(true)
                    .strictnessLevel("HIGH")
                    .build());

            repository.save(SecurityPolicy.builder()
                    .policyName("Vendor Communications Guard")
                    .prohibitedKeywords("source code, proprietary")
                    .enforceDataLossPrevention(false)
                    .requireAuditLog(true)
                    .strictnessLevel("MODERATE")
                    .build());
        }
    }
}
