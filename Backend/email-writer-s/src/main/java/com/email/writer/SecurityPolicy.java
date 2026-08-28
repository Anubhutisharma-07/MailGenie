package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Enterprise entity for defining strict AI content generation policies
 * such as blocked keyword subsets (e.g. SSN, credit cards) and tone
 * constraints.
 */
@Entity
@Table(name = "security_policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String policyName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prohibitedKeywords; // Comma-separated blocks

    @Column(nullable = false)
    private Boolean enforceDataLossPrevention; // True if it strips PII

    @Column(nullable = false)
    private Boolean requireAuditLog;

    @Column(nullable = false)
    private String strictnessLevel; // LOW, MODERATE, HIGH

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Column(nullable = false)
    private String author;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastModified = LocalDateTime.now();
        if (author == null) {
            author = "Security_Admin";
        }
    }
}
