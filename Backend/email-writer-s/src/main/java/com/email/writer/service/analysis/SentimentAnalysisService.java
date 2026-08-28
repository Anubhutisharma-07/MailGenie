package com.email.writer.service.analysis;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service evaluating email emotional tone, formality score, and politeness index.
 */
@Service
public class SentimentAnalysisService {

    private static final List<String> POSITIVE_KEYWORDS = List.of("pleasure", "delighted", "appreciate", "thank", "great", "excellent", "glad", "helpful");
    private static final List<String> NEGATIVE_KEYWORDS = List.of("disappointed", "unacceptable", "terrible", "frustrated", "urgent", "error", "fail", "complaint");
    private static final List<String> FORMAL_KEYWORDS = List.of("sincerely", "regards", "furthermore", "consequently", "accordance", "pursuant", "respectfully");

    public record SentimentReport(String primarySentiment, int formalityScore, int politenessIndex, List<String> detectedToneTags) {}

    public SentimentReport analyze(String text) {
        if (text == null || text.isBlank()) {
            return new SentimentReport("NEUTRAL", 50, 50, List.of("Neutral"));
        }

        String lower = text.toLowerCase();
        long positiveCount = POSITIVE_KEYWORDS.stream().filter(lower::contains).count();
        long negativeCount = NEGATIVE_KEYWORDS.stream().filter(lower::contains).count();
        long formalCount = FORMAL_KEYWORDS.stream().filter(lower::contains).count();

        String sentiment = "NEUTRAL";
        if (positiveCount > negativeCount) sentiment = "POSITIVE";
        else if (negativeCount > positiveCount) sentiment = "CRITICAL";

        int formalityScore = Math.min(100, (int) (40 + (formalCount * 15)));
        int politenessIndex = Math.min(100, Math.max(10, (int) (50 + (positiveCount * 12) - (negativeCount * 15))));

        List<String> tags = new java.util.ArrayList<>();
        tags.add(sentiment);
        if (formalityScore > 75) tags.add("High Formality");
        if (politenessIndex > 80) tags.add("Diplomatic");

        return new SentimentReport(sentiment, formalityScore, politenessIndex, tags);
    }
}
