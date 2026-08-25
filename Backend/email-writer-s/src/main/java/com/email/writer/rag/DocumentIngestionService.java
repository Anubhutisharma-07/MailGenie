package com.email.writer.rag;

import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service responsible for document chunking and vector embedding generation.
 */
@Service
public class DocumentIngestionService {

    private final VectorStoreService vectorStore;

    public DocumentIngestionService(VectorStoreService vectorStore) {
        this.vectorStore = vectorStore;
    }

    public int ingestDocument(String documentId, String content, String category) {
        List<String> chunks = chunkText(content, 200, 50);
        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);
            String chunkId = documentId + "#chunk-" + i;
            float[] simulatedEmbedding = generateEmbedding(chunk);
            vectorStore.upsert(chunkId, chunk, simulatedEmbedding, Map.of(
                "category", category,
                "parentDocId", documentId,
                "chunkIndex", i
            ));
        }
        return chunks.size();
    }

    private List<String> chunkText(String text, int maxWords, int overlapWords) {
        String[] words = text.split("\\s+");
        List<String> chunks = new ArrayList<>();
        int i = 0;
        while (i < words.length) {
            int end = Math.min(words.length, i + maxWords);
            StringBuilder chunk = new StringBuilder();
            for (int j = i; j < end; j++) {
                chunk.append(words[j]).append(" ");
            }
            chunks.add(chunk.toString().trim());
            if (end == words.length) break;
            i += (maxWords - overlapWords);
        }
        return chunks;
    }

    public float[] generateEmbedding(String text) {
        // Deterministic pseudo-embedding for testing vector math
        float[] vector = new float[128];
        Random rand = new Random(text.hashCode());
        for (int i = 0; i < vector.length; i++) {
            vector[i] = rand.nextFloat() * 2 - 1;
        }
        return vector;
    }
}
