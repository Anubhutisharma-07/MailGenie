package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db/migrations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MigrationController {

    private final MigrationManagerService migrationService;

    @GetMapping
    public ResponseEntity<List<MigrationLog>> getHistory() {
        return ResponseEntity.ok(migrationService.getMigrationHistory());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHealthStats() {
        return ResponseEntity.ok(migrationService.getMigrationHealthStats());
    }

    @PostMapping("/execute")
    public ResponseEntity<MigrationLog> executeMigration(@RequestBody Map<String, String> payload) {
        String versionId = payload.get("versionId");
        String description = payload.get("description");
        String scriptName = payload.get("scriptName");

        if (versionId == null || scriptName == null) {
            return ResponseEntity.badRequest().build();
        }

        MigrationLog deployed = migrationService.executeMigration(versionId, description, scriptName);
        if ("ERROR".equals(deployed.getStatus())) {
            return ResponseEntity.status(500).body(deployed);
        }
        return ResponseEntity.ok(deployed);
    }

    @DeleteMapping("/rollback/{versionId}")
    public ResponseEntity<Void> rollbackFailedMigration(@PathVariable String versionId) {
        boolean removed = migrationService.rollbackFailedMigration(versionId);
        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
