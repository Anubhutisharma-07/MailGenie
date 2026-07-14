package com.email.writer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/openai/v1/chat/completions}")
    private String geminiApiUrl;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        String provider = emailRequest.getProvider() != null ? emailRequest.getProvider().toLowerCase() : "groq";
        
        String apiUrl;
        String apiKey;
        String defaultModel;

        switch (provider) {
            case "openai":
                apiUrl = openaiApiUrl;
                apiKey = openaiApiKey;
                defaultModel = "gpt-4o-mini";
                break;
            case "gemini":
                apiUrl = geminiApiUrl;
                apiKey = geminiApiKey;
                defaultModel = "gemini-2.5-flash";
                break;
            case "groq":
            default:
                apiUrl = groqApiUrl;
                apiKey = groqApiKey;
                defaultModel = "llama-3.3-70b-versatile";
                provider = "groq"; // normalize
                break;
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            // Fallback: search for first configured provider
            if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
                apiUrl = groqApiUrl;
                apiKey = groqApiKey;
                defaultModel = "llama-3.3-70b-versatile";
                provider = "groq";
            } else if (openaiApiKey != null && !openaiApiKey.trim().isEmpty()) {
                apiUrl = openaiApiUrl;
                apiKey = openaiApiKey;
                defaultModel = "gpt-4o-mini";
                provider = "openai";
            } else if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
                apiUrl = geminiApiUrl;
                apiKey = geminiApiKey;
                defaultModel = "gemini-2.5-flash";
                provider = "gemini";
            } else {
                return "Error: No API providers are configured. Please check application.properties.";
            }
        }

        String model = (emailRequest.getModel() != null && !emailRequest.getModel().trim().isEmpty()) 
                ? emailRequest.getModel() 
                : defaultModel;

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            String response = webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return extractResponseContent(response);
        } catch (WebClientResponseException e) {
            return provider.toUpperCase() + " API error [" + e.getStatusCode() + "]: " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Unexpected error calling " + provider.toUpperCase() + " API: " + e.getMessage();
        }
    }

    /**
     * Checks which LLM providers have keys configured.
     */
    public Map<String, Boolean> getProviderConfigStatus() {
        return Map.of(
                "groq", groqApiKey != null && !groqApiKey.trim().isEmpty(),
                "openai", openaiApiKey != null && !openaiApiKey.trim().isEmpty(),
                "gemini", geminiApiKey != null && !geminiApiKey.trim().isEmpty()
        );
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            return "Error processing API response: " + e.getMessage() + " | Raw response: " + response;
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate an appropriate email reply for the following email content. Do not generate a subject line. ");
        
        if (emailRequest.getTone() != null && !emailRequest.getTone().trim().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }
        
        if (emailRequest.getLanguage() != null && !emailRequest.getLanguage().trim().isEmpty()) {
            prompt.append("Write the response strictly in ").append(emailRequest.getLanguage()).append(". ");
        }
        
        prompt.append("\nOriginal email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}