package com.email.writer.service.sanitizer;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * High-performance regex sanitizer detecting and redacting PII prior to LLM submission.
 */
@Service
public class PiiRedactionService {

    private static final Pattern SSN_PATTERN = Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b");
    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile("\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\b");
    private static final Pattern API_KEY_PATTERN = Pattern.compile("(?i)\\b(?:sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|api[_-]?key[_-]?[a-zA-Z0-9]{16,})\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");

    public record RedactionResult(String sanitizedText, int piiCount, Map<String, Integer> detectedTypes) {}

    public RedactionResult sanitize(String input) {
        if (input == null || input.isBlank()) {
            return new RedactionResult("", 0, Map.of());
        }

        Map<String, Integer> counts = new HashMap<>();
        int totalPii = 0;

        String current = input;

        // 1. Redact SSN
        Matcher ssnMatcher = SSN_PATTERN.matcher(current);
        int ssnCount = 0;
        while (ssnMatcher.find()) ssnCount++;
        if (ssnCount > 0) {
            counts.put("SSN", ssnCount);
            totalPii += ssnCount;
            current = ssnMatcher.replaceAll("[REDACTED_SSN]");
        }

        // 2. Redact Credit Card
        Matcher ccMatcher = CREDIT_CARD_PATTERN.matcher(current);
        int ccCount = 0;
        while (ccMatcher.find()) ccCount++;
        if (ccCount > 0) {
            counts.put("CREDIT_CARD", ccCount);
            totalPii += ccCount;
            current = ccMatcher.replaceAll("[REDACTED_CREDIT_CARD]");
        }

        // 3. Redact Secret API Keys
        Matcher keyMatcher = API_KEY_PATTERN.matcher(current);
        int keyCount = 0;
        while (keyMatcher.find()) keyCount++;
        if (keyCount > 0) {
            counts.put("API_KEY", keyCount);
            totalPii += keyCount;
            current = keyMatcher.replaceAll("[REDACTED_SECRET_KEY]");
        }

        return new RedactionResult(current, totalPii, counts);
    }
}
