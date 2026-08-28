package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Audit table for webhook delivery health, HTTP responses, and latency metrics.
 */
@Entity
@Table(name = "webhook_delivery_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookDeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long subscriptionId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String payloadSample; 

    @Column(nullable = false)
    private String deliveryStatus; // DELIVERED, FAILED, RETRYING

    @Column(nullable = true)
    private Integer httpStatusCode;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String responseMessage;
    
    @Column(nullable = false)
    private Long latencyMs;

    @Column(nullable = false)
    private LocalDateTime executedAt;

    @PrePersist
    protected void onExecute() {
        executedAt = LocalDateTime.now();
    }
}
