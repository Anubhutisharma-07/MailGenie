package com.email.writer.service.llm;

import reactor.core.publisher.Flux;

/**
 * Strategy interface defining contracts for diverse LLM providers.
 */
public interface LlmProviderStrategy {
    
    /**
     * Generates a reactive stream of email reply text chunks.
     * @param prompt User instruction / email context
     * @param tone Tone of reply (e.g. professional, friendly)
     * @return Reactive Flux stream of token chunks
     */
    Flux<String> generateEmailStream(String prompt, String tone);

    /**
     * Synchronously generates the complete email reply.
     * @param prompt User instruction / email context
     * @param tone Tone of reply
     * @return Generated reply string
     */
    String generateEmail(String prompt, String tone);

    /**
     * Returns provider unique key (e.g. GROQ, GEMINI, OPENAI, OLLAMA).
     */
    String getProviderName();
}
