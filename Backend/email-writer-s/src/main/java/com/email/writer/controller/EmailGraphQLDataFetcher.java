package com.email.writer.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-memory state and data fetchers for GraphQL custom templates and history queries.
 */
@Component
public class EmailGraphQLDataFetcher {

    private final List<Map<String, Object>> templateStore = new CopyOnWriteArrayList<>(List.of(
        Map.of(
            "id", "tmpl-1",
            "title", "Executive Pitch Follow-up",
            "content", "Thank you for the productive discussion regarding our partnership roadmap...",
            "tone", "Professional",
            "category", "Business",
            "isDefault", true
        ),
        Map.of(
            "id", "tmpl-2",
            "title", "Quick Status Update",
            "content", "Just checking in with a quick status report on our sprint goals...",
            "tone", "Concise",
            "category", "Engineering",
            "isDefault", true
        )
    ));

    @QueryMapping
    public List<Map<String, Object>> getEmailHistory(@Argument Integer page, @Argument Integer size) {
        return List.of(
            Map.of(
                "id", UUID.randomUUID().toString(),
                "originalContent", "Can we push the meeting back 30 minutes?",
                "generatedReply", "Hi there, pushing the meeting back 30 minutes works perfectly.",
                "tone", "Casual",
                "provider", "GROQ",
                "createdAt", "2026-08-23T14:00:00Z"
            )
        );
    }

    @MutationMapping
    public Map<String, Object> createTemplate(@Argument Map<String, Object> input) {
        Map<String, Object> newTemplate = Map.of(
            "id", UUID.randomUUID().toString(),
            "title", input.get("title"),
            "content", input.get("content"),
            "tone", input.get("tone"),
            "category", input.getOrDefault("category", "General"),
            "isDefault", false
        );
        templateStore.add(newTemplate);
        return newTemplate;
    }

    @MutationMapping
    public Boolean deleteTemplate(@Argument String id) {
        return templateStore.removeIf(t -> id.equals(t.get("id")));
    }
}
