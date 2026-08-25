package com.email.writer.controller;

import com.email.writer.entity.EncryptedEmailPayload;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Controller handling zero-knowledge encrypted synchronizations.
 */
@RestController
@RequestMapping("/api/encrypted")
@CrossOrigin(origins = "*")
public class EncryptedSyncController {

    private final Map<String, List<EncryptedEmailPayload>> encryptedStore = new ConcurrentHashMap<>();

    @PostMapping("/sync")
    public ResponseEntity<EncryptedEmailPayload> saveEncryptedPayload(
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId,
            @RequestBody EncryptedEmailPayload payload) {
        payload.setUserId(userId);
        encryptedStore.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(payload);
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/items")
    public ResponseEntity<List<EncryptedEmailPayload>> getEncryptedPayloads(
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId,
            @RequestParam(required = false) String payloadType) {
        List<EncryptedEmailPayload> userItems = encryptedStore.getOrDefault(userId, List.of());
        if (payloadType != null) {
            userItems = userItems.stream().filter(i -> payloadType.equalsIgnoreCase(i.getPayloadType())).toList();
        }
        return ResponseEntity.ok(userItems);
    }
}
