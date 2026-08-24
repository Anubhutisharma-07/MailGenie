package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailSubjectLineOptimizer {

    public Map<String, Object> optimizeSubjectLine(String subjectLine) {
        Map<String, Object> result = new HashMap<>();
        if (subjectLine == null || subjectLine.trim().isEmpty()) {
            result.put("subjectScore", 0);
            result.put("characterCount", 0);
            result.put("suggestions", Collections.singletonList("Subject line is empty."));
            return result;
        }

        int length = subjectLine.length();
        int words = subjectLine.split("\\s+").length;
        List<String> suggestions = new ArrayList<>();

        int score = 70;

        if (length < 20) {
            suggestions.add("Subject line is too short. Aim for 30-50 characters for optimal open rates.");
            score -= 10;
        } else if (length > 60) {
            suggestions.add("Subject line may be truncated on mobile screens (>60 chars). Keep it under 50 chars.");
            score -= 15;
        } else {
            score += 15;
        }

        if (subjectLine.contains("?")) {
            score += 10; // Questions increase open rate
        }

        if (subjectLine.equals(subjectLine.toUpperCase())) {
            suggestions.add("Avoid all-caps subject lines as they trigger spam filters.");
            score -= 25;
        }

        result.put("subjectScore", Math.max(0, Math.min(100, score)));
        result.put("characterCount", length);
        result.put("wordCount", words);
        result.put("suggestions", suggestions);
        return result;
    }
}
