package com.email.writer.service.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * Adapter implementation for OpenAI GPT models.
 */
@Service
public class OpenAiLlmStrategy implements LlmProviderStrategy {

    private final WebClient webClient;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openAiApiUrl;

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    public OpenAiLlmStrategy(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Flux<String> generateEmailStream(String prompt, String tone) {
        String systemPrompt = "You are an AI email assistant drafting a " + tone + " email.";
        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", prompt)
            ),
            "stream", true
        );

        return webClient.post()
                .uri(openAiApiUrl)
                .header("Authorization", "Bearer " + openAiApiKey)
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
        return "OPENAI";
    }
}
