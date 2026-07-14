package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing endpoints for Email Generation History CRUD.
 */
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailHistoryController {

    private final EmailHistoryService service;

    /**
     * Create/Save a new history record manually.
     */
    @PostMapping
    public ResponseEntity<EmailHistory> createHistory(@RequestBody EmailHistory history) {
        EmailHistory saved = service.saveHistory(history);
        return ResponseEntity.ok(saved);
    }

    /**
     * Read all history records sorted by creation date descending.
     */
    @GetMapping
    public ResponseEntity<List<EmailHistory>> getAllHistory() {
        List<EmailHistory> list = service.getAllHistory();
        return ResponseEntity.ok(list);
    }

    /**
     * Read a specific history record by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmailHistory> getHistoryById(@PathVariable Long id) {
        return service.getHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update the user comment/note on a history record.
     */
    @PutMapping("/{id}/comment")
    public ResponseEntity<EmailHistory> updateComment(@PathVariable Long id, @RequestBody String comment) {
        String cleanComment = comment;
        if (comment != null) {
            // Strip leading/trailing quotes if sent as raw JSON text
            if (comment.startsWith("\"") && comment.endsWith("\"") && comment.length() > 1) {
                cleanComment = comment.substring(1, comment.length() - 1);
            }
            // Check if it's sent as a JSON object, e.g. {"comment":"..."}
            String trimmed = comment.trim();
            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                try {
                    com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(trimmed);
                    if (node.has("comment")) {
                        cleanComment = node.get("comment").asText();
                    } else if (node.has("userComment")) {
                        cleanComment = node.get("userComment").asText();
                    }
                } catch (Exception e) {
                    // Fallback to raw string if parsing fails
                }
            }
        }
        return service.updateComment(id, cleanComment)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a history record by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        if (service.deleteHistory(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
