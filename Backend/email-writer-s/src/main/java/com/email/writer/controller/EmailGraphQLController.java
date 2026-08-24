package com.email.writer.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * GraphQL Controller resolving queries and mutations for MailGenie.
 */
@Controller
public class EmailGraphQLController {

    @QueryMapping
    public List<Map<String, Object>> getTemplates(@Argument String category) {
        return List.of(
            Map.of(
                "id", UUID.randomUUID().toString(),
                "title", "Professional Meeting Follow-up",
                "content", "Thank you for taking the time to meet today...",
                "tone", "Professional",
                "category", "Business",
                "isDefault", true,
                "createdAt", Instant.now().toString()
            ),
            Map.of(
                "id", UUID.randomUUID().toString(),
                "title", "Casual Catch-up",
                "content", "Hey! Hope you are doing well...",
                "tone", "Casual",
                "category", "Personal",
                "isDefault", true,
                "createdAt", Instant.now().toString()
            )
        );
    }

    @QueryMapping
    public List<Map<String, Object>> searchTemplates(@Argument String query) {
        return getTemplates(null).stream()
                .filter(t -> ((String) t.get("title")).toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    @MutationMapping
    public Map<String, Object> generateEmail(@Argument Map<String, Object> input) {
        String emailContent = (String) input.get("emailContent");
        String tone = (String) input.get("tone");
        String provider = (String) input.getOrDefault("provider", "GROQ");

        String simulatedReply = "Dear recipient,\n\nThank you for your message regarding: " 
                + emailContent + "\n\nBest regards,\nMailGenie AI";

        return Map.of(
            "reply", simulatedReply,
            "provider", provider,
            "tokensUsed", 120,
            "executionTimeMs", 450
        );
    }
}
