package com.email.writer;

import java.util.List;

public class EmailTemplateRecommendationResult {
    private String category;
    private double relevanceScore;
    private String recommendedSubject;
    private String recommendedBodyTemplate;
    private List<String> placeholders;

    public EmailTemplateRecommendationResult() {}

    public EmailTemplateRecommendationResult(String category, double relevanceScore, String recommendedSubject,
                                              String recommendedBodyTemplate, List<String> placeholders) {
        this.category = category;
        this.relevanceScore = relevanceScore;
        this.recommendedSubject = recommendedSubject;
        this.recommendedBodyTemplate = recommendedBodyTemplate;
        this.placeholders = placeholders;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getRecommendedSubject() { return recommendedSubject; }
    public void setRecommendedSubject(String recommendedSubject) { this.recommendedSubject = recommendedSubject; }

    public String getRecommendedBodyTemplate() { return recommendedBodyTemplate; }
    public void setRecommendedBodyTemplate(String recommendedBodyTemplate) { this.recommendedBodyTemplate = recommendedBodyTemplate; }

    public List<String> getPlaceholders() { return placeholders; }
    public void setPlaceholders(List<String> placeholders) { this.placeholders = placeholders; }
}
