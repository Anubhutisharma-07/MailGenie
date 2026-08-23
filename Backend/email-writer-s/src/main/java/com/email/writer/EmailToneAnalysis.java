package com.email.writer;

import java.time.LocalDateTime;

public class EmailToneAnalysis {
    private String id;
    private String emailContent;
    private String detectedTone; // PROFESSIONAL, URGENT, APOLOGETIC, PERSUASIVE, CASUAL
    private double sentimentScore; // -1.0 (Very Negative) to +1.0 (Very Positive)
    private double formalityScore; // 0.0 to 1.0
    private double urgencyScore; // 0.0 to 1.0
    private int wordCount;
    private int estimatedReadTimeSeconds;
    private LocalDateTime analyzedAt;

    public EmailToneAnalysis() {}

    public EmailToneAnalysis(String id, String emailContent, String detectedTone, double sentimentScore,
                             double formalityScore, double urgencyScore, int wordCount,
                             int estimatedReadTimeSeconds, LocalDateTime analyzedAt) {
        this.id = id;
        this.emailContent = emailContent;
        this.detectedTone = detectedTone;
        this.sentimentScore = sentimentScore;
        this.formalityScore = formalityScore;
        this.urgencyScore = urgencyScore;
        this.wordCount = wordCount;
        this.estimatedReadTimeSeconds = estimatedReadTimeSeconds;
        this.analyzedAt = analyzedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmailContent() { return emailContent; }
    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }

    public String getDetectedTone() { return detectedTone; }
    public void setDetectedTone(String detectedTone) { this.detectedTone = detectedTone; }

    public double getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(double sentimentScore) { this.sentimentScore = sentimentScore; }

    public double getFormalityScore() { return formalityScore; }
    public void setFormalityScore(double formalityScore) { this.formalityScore = formalityScore; }

    public double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(double urgencyScore) { this.urgencyScore = urgencyScore; }

    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }

    public int getEstimatedReadTimeSeconds() { return estimatedReadTimeSeconds; }
    public void setEstimatedReadTimeSeconds(int estimatedReadTimeSeconds) { this.estimatedReadTimeSeconds = estimatedReadTimeSeconds; }

    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
}
