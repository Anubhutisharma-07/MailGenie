package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @GetMapping("/subscriptions")
    public ResponseEntity<List<WebhookSubscription>> getSubscriptions() {
        return ResponseEntity.ok(webhookService.getAllSubscriptions());
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<WebhookSubscription> createSubscription(@RequestBody WebhookSubscription sub) {
        return ResponseEntity.ok(webhookService.registerSubscription(sub));
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        webhookService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/logs")
    public ResponseEntity<List<WebhookDeliveryLog>> getLogs() {
        return ResponseEntity.ok(webhookService.getDeliveryLogs());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(webhookService.getWebhookStats());
    }

    @PostMapping("/dispatch/simulate")
    public ResponseEntity<Map<String, Object>> simulateDispatch(@RequestBody Map<String, String> payload) {
        String eventType = payload.getOrDefault("eventType", "EMAIL_GENERATED");
        String content = payload.getOrDefault("content", "{}");
        return ResponseEntity.ok(webhookService.dispatchEvent(eventType, content));
    }
}
