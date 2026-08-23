package com.email.writer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email/security/vault")
@CrossOrigin(origins = "*")
public class EmailSecurityEncryptionVaultController {

    @Autowired
    private EmailSecurityEncryptionVaultService vaultService;

    @PostMapping("/encrypt")
    public ResponseEntity<EncryptedEmailPayload> encryptPayload(@RequestBody Map<String, String> request) {
        String content = request.getOrDefault("content", "");
        EncryptedEmailPayload encrypted = vaultService.encryptEmail(content);
        return ResponseEntity.ok(encrypted);
    }

    @PostMapping("/decrypt")
    public ResponseEntity<Map<String, String>> decryptPayload(@RequestBody EncryptedEmailPayload payload) {
        String decrypted = vaultService.decryptEmail(payload);
        return ResponseEntity.ok(Map.of("decryptedContent", decrypted));
    }
}
