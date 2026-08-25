package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * Enterprise entity defining dynamic rate limits and token allocations
 * for different tier levels (e.g., FREE, PRO, ENTERPRISE).
 */
@Entity
@Table(name = "quota_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotaRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tierName; // FREE, PRO, ENTERPRISE
    
    @Column(nullable = false)
    private Long dailyGenerationLimit; // max API calls per day
    
    @Column(nullable = false)
    private Long maxTokensPerMonth; // total tokens allowed
    
    @Column(nullable = false)
    private Boolean enforceHardLimits; // If true, throws 429 Too Many Requests

    @Column(nullable = false)
    private Long bandwidthThrottleKbps; // Throttling simulation
}
