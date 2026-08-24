package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailReadabilityAnalyzer {

    public Map<String, Object> analyzeReadability(String content) {
        Map<String, Object> metrics = new HashMap<>();
        if (content == null || content.trim().isEmpty()) {
            metrics.put("fleschKincaidScore", 100.0);
            metrics.put("readingGradeLevel", "1st Grade");
            metrics.put("sentenceCount", 0);
            metrics.put("averageSentenceLength", 0.0);
            return metrics;
        }

        String[] sentences = content.split("[.!?]+");
        String[] words = content.replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+");

        int totalSentences = Math.max(1, sentences.length);
        int totalWords = Math.max(1, words.length);
        int totalSyllables = countSyllablesInWords(words);

        // Flesch Reading Ease Formula: 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
        double score = 206.835 - (1.015 * ((double) totalWords / totalSentences)) - (84.6 * ((double) totalSyllables / totalWords));
        score = Math.max(0.0, Math.min(100.0, score));

        String grade = "College Level";
        if (score >= 90) grade = "5th Grade (Very Easy)";
        else if (score >= 80) grade = "6th Grade (Easy)";
        else if (score >= 70) grade = "7th Grade (Fairly Easy)";
        else if (score >= 60) grade = "8th-9th Grade (Standard)";
        else if (score >= 50) grade = "10th-12th Grade (Fairly Difficult)";

        metrics.put("fleschKincaidScore", Math.round(score * 10.0) / 10.0);
        metrics.put("readingGradeLevel", grade);
        metrics.put("sentenceCount", totalSentences);
        metrics.put("averageSentenceLength", Math.round(((double) totalWords / totalSentences) * 10.0) / 10.0);
        return metrics;
    }

    private int countSyllablesInWords(String[] words) {
        int count = 0;
        for (String word : words) {
            count += countSyllables(word.toLowerCase());
        }
        return Math.max(1, count);
    }

    private int countSyllables(String word) {
        if (word.length() <= 3) return 1;
        word = word.replaceAll("(?:[^laeiouy]|ed|es|e)$", "");
        word = word.replaceAll("^y", "");
        String[] vowels = word.split("[^aeiouy]+");
        return Math.max(1, vowels.length);
    }
}
