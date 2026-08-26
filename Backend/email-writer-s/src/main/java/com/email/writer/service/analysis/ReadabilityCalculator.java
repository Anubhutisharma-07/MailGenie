package com.email.writer.service.analysis;

import org.springframework.stereotype.Service;

/**
 * Utility calculating Flesch-Kincaid reading ease and estimated reading time.
 */
@Service
public class ReadabilityCalculator {

    public record ReadabilityScore(double fleschKincaidEase, String readingGradeLevel, int estimatedReadingTimeSec) {}

    public ReadabilityScore calculate(String text) {
        if (text == null || text.isBlank()) {
            return new ReadabilityScore(100.0, "Easy", 0);
        }

        String[] words = text.trim().split("\\s+");
        String[] sentences = text.split("[.!?]+");

        int wordCount = Math.max(1, words.length);
        int sentenceCount = Math.max(1, sentences.length);
        int syllableCount = 0;

        for (String word : words) {
            syllableCount += countSyllables(word);
        }

        // Flesch Reading Ease Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
        double wordsPerSentence = (double) wordCount / sentenceCount;
        double syllablesPerWord = (double) syllableCount / wordCount;
        double ease = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
        ease = Math.max(0.0, Math.min(100.0, Math.round(ease * 10.0) / 10.0));

        String gradeLevel = ease >= 80 ? "Easy (5th-6th grade)" : ease >= 60 ? "Standard (8th-9th grade)" : "Advanced (College level)";
        int readingTimeSec = Math.max(1, (wordCount * 60) / 200); // 200 WPM average

        return new ReadabilityScore(ease, gradeLevel, readingTimeSec);
    }

    private int countSyllables(String word) {
        word = word.toLowerCase().replaceAll("[^a-z]", "");
        if (word.length() <= 3) return 1;
        String cleaned = word.replaceAll("e$", "");
        String[] matches = cleaned.split("[^aeiouy]+");
        int count = 0;
        for (String match : matches) {
            if (!match.isEmpty()) count++;
        }
        return Math.max(1, count);
    }
}
