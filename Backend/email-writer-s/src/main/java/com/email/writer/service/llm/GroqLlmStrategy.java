package com.email.writer.service.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * Adapter implementation for Groq high-speed LLM inference.
 */
@Service
public class GroqLlmStrategy implements LlmProviderStrategy {

    private final WebClient webClient;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    public GroqLlmStrategy(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Flux<String> generateEmailStream(String prompt, String tone) {
        String systemPrompt = "You are a helpful AI email assistant. Generate a " + tone + " email reply.";
        Map<String, Object> body = Map.of(
            "model", "llama-3.1-8b-instant",
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", prompt)
            ),
            "stream", true
        );

        return webClient.post()
                .uri(groqApiUrl)
                .header("Authorization", "Bearer " + groqApiKey)
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
        return "GROQ";
    }
}
