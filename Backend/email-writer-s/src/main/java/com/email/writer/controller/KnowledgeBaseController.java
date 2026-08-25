package com.email.writer.controller;

import com.email.writer.rag.DocumentIngestionService;
import com.email.writer.rag.VectorStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Controller for managing knowledge base ingestion for RAG context retrieval.
 */
@RestController
@RequestMapping("/api/rag")
@CrossOrigin(origins = "*")
public class KnowledgeBaseController {

    private final DocumentIngestionService ingestionService;
    private final VectorStoreService vectorStore;

    public KnowledgeBaseController(DocumentIngestionService ingestionService, VectorStoreService vectorStore) {
        this.ingestionService = ingestionService;
        this.vectorStore = vectorStore;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, Object>> ingestDocument(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String category = request.getOrDefault("category", "GENERAL");
        String docId = request.getOrDefault("id", UUID.randomUUID().toString());

        int chunksIngested = ingestionService.ingestDocument(docId, content, category);

        return ResponseEntity.ok(Map.of(
            "docId", docId,
            "chunksIngested", chunksIngested,
            "totalVectorsIndexed", vectorStore.size()
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalVectors", vectorStore.size(),
            "status", "ACTIVE"
        ));
    }
}
