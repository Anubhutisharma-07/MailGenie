package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Entity representing performance and usage metrics of API requests to LLM providers.
 */
@Entity
@Table(name = "api_request_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiRequestMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;

    private String model;

    @Column(nullable = false)
    private Long durationMs;

    @Column(nullable = false)
    private String status; // "SUCCESS" or "ERROR"

    private Integer characterCount;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
