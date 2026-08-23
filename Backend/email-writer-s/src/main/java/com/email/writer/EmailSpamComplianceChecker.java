package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailSpamComplianceChecker {

    private static final Set<String> TRIGGER_WORDS = new HashSet<>(Arrays.asList(
        "100% free", "act now", "apply now", "buy now", "cash bonus", "cheap", "click here",
        "double your income", "earn extra cash", "exclusive deal", "guaranteed", "no hidden fees",
        "risk free", "special promotion", "urgent response", "winner"
    ));

    public Map<String, Object> checkSpamScore(String content) {
        Map<String, Object> report = new HashMap<>();
        if (content == null || content.trim().isEmpty()) {
            report.put("spamScore", 0.0);
            report.put("isHighRiskSpam", false);
            report.put("flaggedTriggerWords", Collections.emptyList());
            return report;
        }

        String lowerContent = content.toLowerCase();
        List<String> flagged = new ArrayList<>();
        for (String trigger : TRIGGER_WORDS) {
            if (lowerContent.contains(trigger)) {
                flagged.add(trigger);
            }
        }

        double score = Math.min(100.0, (flagged.size() * 20.0) + (lowerContent.contains("!!!") ? 15 : 0));
        boolean highRisk = score >= 40.0;

        report.put("spamScore", score);
        report.put("isHighRiskSpam", highRisk);
        report.put("flaggedTriggerWords", flagged);
        report.put("recommendation", highRisk ? "Remove aggressive promotional trigger words to prevent landing in spam folders." : "Low spam risk detected.");
        return report;
    }
}
