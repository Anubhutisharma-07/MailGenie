package com.email.writer;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EmailToneSentimentService {

    private static final Set<String> POSITIVE_WORDS = new HashSet<>(Arrays.asList(
        "great", "excellent", "pleased", "happy", "thank", "thanks", "congratulations", "appreciate",
        "delighted", "awesome", "wonderful", "effective", "positive", "successful", "brilliant"
    ));

    private static final Set<String> NEGATIVE_WORDS = new HashSet<>(Arrays.asList(
        "unfortunately", "sorry", "apologize", "regret", "issue", "problem", "error", "delay",
        "failed", "disappointed", "concern", "urgent", "critical", "mistake", "severe"
    ));

    private static final Set<String> FORMAL_MARKERS = new HashSet<>(Arrays.asList(
        "sincerely", "regards", "dear", "pursuant", "accordingly", "furthermore", "nevertheless",
        "herewith", "enclosed", "kindly", "respectfully", "stipulated", "herein"
    ));

    private static final Set<String> URGENT_MARKERS = new HashSet<>(Arrays.asList(
        "asap", "immediately", "urgent", "deadline", "priority", "escalate", "action required",
        "by EOD", "time-sensitive", "instant", "promptly"
    ));

    public EmailToneAnalysis analyzeEmail(String content) {
        if (content == null || content.trim().isEmpty()) {
            return new EmailToneAnalysis(UUID.randomUUID().toString(), "", "CASUAL", 0.0, 0.0, 0.0, 0, 0, LocalDateTime.now());
        }

        String[] words = content.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+");
        int totalWords = words.length;

        int posCount = 0;
        int negCount = 0;
        int formalCount = 0;
        int urgentCount = 0;

        for (String word : words) {
            if (POSITIVE_WORDS.contains(word)) posCount++;
            if (NEGATIVE_WORDS.contains(word)) negCount++;
            if (FORMAL_MARKERS.contains(word)) formalCount++;
            if (URGENT_MARKERS.contains(word)) urgentCount++;
        }

        double sentiment = totalWords > 0 ? (double) (posCount - negCount) / totalWords : 0.0;
        sentiment = Math.max(-1.0, Math.min(1.0, sentiment * 10)); // Scale -1.0 to 1.0

        double formality = totalWords > 0 ? Math.min(1.0, (double) formalCount / Math.max(1, totalWords / 15)) : 0.0;
        double urgency = totalWords > 0 ? Math.min(1.0, (double) urgentCount / Math.max(1, totalWords / 20)) : 0.0;

        String tone = "PROFESSIONAL";
        if (urgency > 0.4) {
            tone = "URGENT";
        } else if (content.toLowerCase().contains("apologize") || content.toLowerCase().contains("sorry")) {
            tone = "APOLOGETIC";
        } else if (formality < 0.2) {
            tone = "CASUAL";
        } else if (sentiment > 0.3) {
            tone = "PERSUASIVE";
        }

        int readTime = (int) Math.ceil((double) totalWords / 3.5); // avg 210 wpm = 3.5 words/sec

        return new EmailToneAnalysis(
            UUID.randomUUID().toString(),
            content,
            tone,
            Math.round(sentiment * 100.0) / 100.0,
            Math.round(formality * 100.0) / 100.0,
            Math.round(urgency * 100.0) / 100.0,
            totalWords,
            readTime,
            LocalDateTime.now()
        );
    }
}
