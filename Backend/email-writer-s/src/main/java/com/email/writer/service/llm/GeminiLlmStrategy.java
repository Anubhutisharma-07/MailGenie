package com.email.writer.service.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * Adapter implementation for Google Gemini AI.
 */
@Service
public class GeminiLlmStrategy implements LlmProviderStrategy {

    private final WebClient webClient;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}")
    private String geminiApiUrl;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public GeminiLlmStrategy(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Flux<String> generateEmailStream(String prompt, String tone) {
        String formattedPrompt = "Generate a " + tone + " email reply for: " + prompt;
        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", formattedPrompt)))
            )
        );

        return webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class);
    }

    @Override
    public String generateEmail(String prompt, String tone) {
        return generateEmailStream(prompt, tone).reduce("", (acc, curr) -> acc + curr).block();
    }

    @Override
    public String getProviderName() {
        return "GEMINI";
    }
}
