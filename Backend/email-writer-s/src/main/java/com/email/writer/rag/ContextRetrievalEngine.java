package com.email.writer.rag;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Orchestrator retrieving top-K semantic context passages and augmenting LLM prompts.
 */
@Service
public class ContextRetrievalEngine {

    private final VectorStoreService vectorStore;
    private final DocumentIngestionService ingestionService;

    public ContextRetrievalEngine(VectorStoreService vectorStore, DocumentIngestionService ingestionService) {
        this.vectorStore = vectorStore;
        this.ingestionService = ingestionService;
    }

    public String buildAugmentedPrompt(String originalPrompt, String emailContext, int maxPassages) {
        float[] queryEmbedding = ingestionService.generateEmbedding(emailContext);
        List<VectorStoreService.VectorEntry> relevantPassages = vectorStore.findSimilar(queryEmbedding, maxPassages);

        if (relevantPassages.isEmpty()) {
            return originalPrompt;
        }

        String contextBlock = relevantPassages.stream()
                .map(p -> "- " + p.content())
                .collect(Collectors.joining("\n"));

        return """
               [Context Documents & Style Reference]
               %s

               [User Instruction]
               %s

               [Incoming Email]
               %s
               """.formatted(contextBlock, originalPrompt, emailContext);
    }
}
