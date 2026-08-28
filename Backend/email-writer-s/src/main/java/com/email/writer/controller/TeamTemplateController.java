package com.email.writer.controller;

import com.email.writer.security.RbacPermissionEvaluator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Controller managing team-shared email templates with RBAC enforcement.
 */
@RestController
@RequestMapping("/api/team-templates")
@CrossOrigin(origins = "*")
public class TeamTemplateController {

    private final RbacPermissionEvaluator permissionEvaluator;
    private final List<Map<String, Object>> teamTemplates = new CopyOnWriteArrayList<>();

    public TeamTemplateController(RbacPermissionEvaluator permissionEvaluator) {
        this.permissionEvaluator = permissionEvaluator;
    }

    @PostMapping("/{orgId}")
    public ResponseEntity<?> createTeamTemplate(
            @PathVariable String orgId,
            @RequestHeader(value = "X-User-Id", defaultValue = "user-1") String userId,
            @RequestBody Map<String, String> request) {

        if (!permissionEvaluator.hasPermission(userId, orgId, "PUBLISH_GLOBAL_TEMPLATE")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Insufficient permissions to publish team template"));
        }

        Map<String, Object> template = Map.of(
            "id", UUID.randomUUID().toString(),
            "orgId", orgId,
            "title", request.get("title"),
            "content", request.get("content"),
            "tone", request.get("tone"),
            "createdBy", userId
        );
        teamTemplates.add(template);
        return ResponseEntity.ok(template);
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<List<Map<String, Object>>> getTeamTemplates(@PathVariable String orgId) {
        List<Map<String, Object>> orgTemplates = teamTemplates.stream()
                .filter(t -> orgId.equals(t.get("orgId")))
                .toList();
        return ResponseEntity.ok(orgTemplates);
    }
}
