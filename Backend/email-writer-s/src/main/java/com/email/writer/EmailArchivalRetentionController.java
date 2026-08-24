package com.email.writer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email/archival")
@CrossOrigin(origins = "*")
public class EmailArchivalRetentionController {

    @Autowired
    private EmailArchivalRetentionService archivalService;

    @PostMapping("/archive")
    public ResponseEntity<EmailArchivalRecord> archivePayload(@RequestBody Map<String, Object> payload) {
        String emailId = (String) payload.getOrDefault("emailId", "EML-" + System.currentTimeMillis());
        String content = (String) payload.getOrDefault("content", "");
        int retentionDays = ((Number) payload.getOrDefault("retentionDays", 365)).intValue();

        EmailArchivalRecord record = archivalService.archiveEmailContent(emailId, content, retentionDays);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/records")
    public ResponseEntity<List<EmailArchivalRecord>> listRecords() {
        return ResponseEntity.ok(archivalService.getArchivedRecords());
    }
}
