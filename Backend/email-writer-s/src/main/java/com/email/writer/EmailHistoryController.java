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
        // Strip leading/trailing quotes if sent as raw JSON text
        String cleanComment = comment;
        if (comment != null && comment.startsWith("\"") && comment.endsWith("\"") && comment.length() > 1) {
            cleanComment = comment.substring(1, comment.length() - 1);
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
