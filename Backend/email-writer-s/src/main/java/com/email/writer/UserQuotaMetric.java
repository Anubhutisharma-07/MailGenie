package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Audit table for tracking individual user consumption against their assigned
 * quota.
 */
@Entity
@Table(name = "user_quota_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserQuotaMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String assignedTier;

    @Column(nullable = false)
    private Long generationsToday;

    @Column(nullable = false)
    private Long tokensUsedThisMonth;

    @Column(nullable = false)
    private LocalDateTime lastResetDate;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (lastResetDate == null) {
            lastResetDate = LocalDateTime.now();
        }
    }
}
