package com.email.writer.service.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

/**
 * Adapter implementation for Local Ollama inference instances.
 */
@Service
public class OllamaLlmStrategy implements LlmProviderStrategy {

    private final WebClient webClient;

    @Value("${ollama.api.url:http://localhost:11434/api/generate}")
    private String ollamaApiUrl;

    @Value("${ollama.model:llama3}")
    private String ollamaModel;

    public OllamaLlmStrategy(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Flux<String> generateEmailStream(String prompt, String tone) {
        String fullPrompt = "System: Write a " + tone + " email reply.\nUser: " + prompt;
        Map<String, Object> body = Map.of(
            "model", ollamaModel,
            "prompt", fullPrompt,
            "stream", true
        );

        return webClient.post()
                .uri(ollamaApiUrl)
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
        return "OLLAMA";
    }
}
