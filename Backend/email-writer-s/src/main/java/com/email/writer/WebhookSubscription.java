package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Entity representing an integration routing endpoint for MailGenie Events.
 */
@Entity
@Table(name = "webhook_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String endpointUrl;

    @Column(nullable = false)
    private String eventType; // EX: EMAIL_GENERATED, DLP_TRIGGERED, PIPELINE_FAILED

    @Column(nullable = false)
    private String secretKey; // For HMAC signature verification

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private Integer retryCount; // Max retry count for failed deliveries

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (createdBy == null) {
            createdBy = "System_Integration_Admin";
        }
        if (isActive == null) {
            isActive = true;
        }
        if (retryCount == null) {
            retryCount = 3;
        }
    }
}
