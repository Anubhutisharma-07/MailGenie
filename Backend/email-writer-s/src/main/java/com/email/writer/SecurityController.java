package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SecurityController {

    private final SecurityHubService securityHubService;

    @GetMapping("/policies")
    public ResponseEntity<List<SecurityPolicy>> getPolicies() {
        return ResponseEntity.ok(securityHubService.getAllPolicies());
    }

    @PostMapping("/policies")
    public ResponseEntity<SecurityPolicy> savePolicy(@RequestBody SecurityPolicy policy) {
        return ResponseEntity.ok(securityHubService.createOrUpdatePolicy(policy));
    }

    @DeleteMapping("/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        if (securityHubService.deletePolicy(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/dlp/scan")
    public ResponseEntity<Map<String, Object>> scanPayload(@RequestBody Map<String, String> payload) {
        String emailContext = payload.getOrDefault("content", "");
        return ResponseEntity.ok(securityHubService.executeDlpScan(emailContext));
    }
}
