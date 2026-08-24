package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailCategoryClassifierEngine {

    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new HashMap<>();

    static {
        CATEGORY_KEYWORDS.put("SALES_OUTREACH", Arrays.asList("demo", "pricing", "discount", "offer", "solution", "value"));
        CATEGORY_KEYWORDS.put("CUSTOMER_SUPPORT", Arrays.asList("refund", "ticket", "help", "broken", "issue", "assistance"));
        CATEGORY_KEYWORDS.put("HR_RECRUITING", Arrays.asList("interview", "candidate", "resume", "salary", "offer letter"));
        CATEGORY_KEYWORDS.put("FINANCE_INVOICING", Arrays.asList("invoice", "payment", "billing", "receipt", "due date"));
    }

    public Map<String, Object> classifyCategory(String content) {
        Map<String, Object> response = new HashMap<>();
        if (content == null || content.trim().isEmpty()) {
            response.put("detectedCategory", "GENERAL");
            response.put("confidenceScore", 0.50);
            return response;
        }

        String lower = content.toLowerCase();
        String bestCategory = "GENERAL";
        int maxMatches = 0;

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            int matches = 0;
            for (String kw : entry.getValue()) {
                if (lower.contains(kw)) matches++;
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestCategory = entry.getKey();
            }
        }

        double confidence = Math.min(0.99, 0.50 + (maxMatches * 0.15));
        response.put("detectedCategory", bestCategory);
        response.put("confidenceScore", Math.round(confidence * 100.0) / 100.0);
        return response;
    }
}
