package com.email.writer.rag;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory Vector Store indexing text embeddings for semantic similarity search.
 */
@Service
public class VectorStoreService {

    public record VectorEntry(String id, String content, float[] embedding, Map<String, Object> metadata) {}

    private final Map<String, VectorEntry> vectorIndex = new ConcurrentHashMap<>();

    public void upsert(String id, String content, float[] embedding, Map<String, Object> metadata) {
        vectorIndex.put(id, new VectorEntry(id, content, embedding, metadata));
    }

    public List<VectorEntry> findSimilar(float[] queryEmbedding, int topK) {
        return vectorIndex.values().stream()
                .map(entry -> new AbstractMap.SimpleEntry<>(entry, cosineSimilarity(queryEmbedding, entry.embedding())))
                .sorted((a, b) -> Float.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .map(AbstractMap.SimpleEntry::getKey)
                .toList();
    }

    private float cosineSimilarity(float[] vecA, float[] vecB) {
        if (vecA == null || vecB == null || vecA.length != vecB.length) return 0.0f;
        float dotProduct = 0.0f;
        float normA = 0.0f;
        float normB = 0.0f;
        for (int i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA == 0 || normB == 0) return 0.0f;
        return (float) (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)));
    }

    public int size() {
        return vectorIndex.size();
    }

    public void clear() {
        vectorIndex.clear();
    }
}
