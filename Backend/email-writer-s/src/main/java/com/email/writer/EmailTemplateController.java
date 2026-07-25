package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing endpoints for Email Templates CRUD.
 */
@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailTemplateController {

    private final EmailTemplateService service;

    /**
     * Create/Save a new template.
     */
    @PostMapping
    public ResponseEntity<EmailTemplate> createTemplate(@RequestBody EmailTemplate template) {
        EmailTemplate saved = service.saveTemplate(template);
        return ResponseEntity.ok(saved);
    }

    /**
     * Retrieve all saved templates.
     */
    @GetMapping
    public ResponseEntity<List<EmailTemplate>> getAllTemplates() {
        List<EmailTemplate> list = service.getAllTemplates();
        return ResponseEntity.ok(list);
    }

    /**
     * Delete a template by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        if (service.deleteTemplate(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
