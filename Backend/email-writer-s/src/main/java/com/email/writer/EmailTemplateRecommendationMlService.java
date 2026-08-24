package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailTemplateRecommendationMlService {

    public List<EmailTemplateRecommendationResult> recommendTemplates(String prompt, String targetRole) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String lowerPrompt = prompt.toLowerCase();
        List<EmailTemplateRecommendationResult> results = new ArrayList<>();

        if (lowerPrompt.contains("meeting") || lowerPrompt.contains("sync") || lowerPrompt.contains("schedule")) {
            results.add(new EmailTemplateRecommendationResult(
                "MEETING_REQUEST",
                0.95,
                "Request for Quick Sync: {{Topic}}",
                "Hi {{RecipientName}},\n\nI hope this email finds you well. I would like to request a brief 20-minute sync to discuss {{Topic}}.\n\nPlease let me know if {{SuggestedTime}} works for you.\n\nBest regards,\n{{SenderName}}",
                Arrays.asList("RecipientName", "Topic", "SuggestedTime", "SenderName")
            ));
        }

        if (lowerPrompt.contains("follow up") || lowerPrompt.contains("reminder") || lowerPrompt.contains("status")) {
            results.add(new EmailTemplateRecommendationResult(
                "FOLLOW_UP",
                0.91,
                "Following Up: {{ProjectName}} Update",
                "Hi {{RecipientName}},\n\nFollowing up on our previous conversation regarding {{ProjectName}}. Could you please provide an update on the current status?\n\nThanks,\n{{SenderName}}",
                Arrays.asList("RecipientName", "ProjectName", "SenderName")
            ));
        }

        if (lowerPrompt.contains("interview") || lowerPrompt.contains("job") || lowerPrompt.contains("application")) {
            results.add(new EmailTemplateRecommendationResult(
                "JOB_APPLICATION",
                0.88,
                "Application for {{JobTitle}} Position - {{CandidateName}}",
                "Dear Hiring Team,\n\nI am writing to express my strong interest in the {{JobTitle}} role at {{CompanyName}}. Attached is my resume for your review.\n\nSincerely,\n{{CandidateName}}",
                Arrays.asList("JobTitle", "CompanyName", "CandidateName")
            ));
        }

        if (results.isEmpty()) {
            results.add(new EmailTemplateRecommendationResult(
                "GENERAL_PROFESSIONAL",
                0.75,
                "Update Regarding {{Subject}}",
                "Hi {{RecipientName}},\n\nI am reaching out regarding {{Subject}}. {{Details}}\n\nBest,\n{{SenderName}}",
                Arrays.asList("RecipientName", "Subject", "Details", "SenderName")
            ));
        }

        return results;
    }
}
