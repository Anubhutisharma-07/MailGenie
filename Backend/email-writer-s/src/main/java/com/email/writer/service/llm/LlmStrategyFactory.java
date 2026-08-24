package com.email.writer.service.llm;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Factory and registry managing runtime dynamic resolution of LLM strategies.
 */
@Component
public class LlmStrategyFactory {

    private final Map<String, LlmProviderStrategy> strategyRegistry = new ConcurrentHashMap<>();
    private final String defaultProvider = "GROQ";

    public LlmStrategyFactory(List<LlmProviderStrategy> strategies) {
        for (LlmProviderStrategy strategy : strategies) {
            strategyRegistry.put(strategy.getProviderName().toUpperCase(), strategy);
        }
    }

    /**
     * Resolves the corresponding LLM provider strategy or falls back to default.
     * @param providerName Provider key (e.g. GROQ, GEMINI, OPENAI)
     * @return Strategy implementation
     */
    public LlmProviderStrategy getStrategy(String providerName) {
        if (providerName == null || providerName.trim().isEmpty()) {
            return strategyRegistry.get(defaultProvider);
        }
        return strategyRegistry.getOrDefault(providerName.toUpperCase(), strategyRegistry.get(defaultProvider));
    }

    /**
     * Registers a new custom LLM strategy dynamically at runtime.
     * @param strategy The strategy implementation
     */
    public void registerStrategy(LlmProviderStrategy strategy) {
        strategyRegistry.put(strategy.getProviderName().toUpperCase(), strategy);
    }
}
