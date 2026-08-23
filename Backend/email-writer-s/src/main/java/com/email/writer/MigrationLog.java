package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Entity tracking enterprise database migration operations and version states.
 */
@Entity
@Table(name = "migration_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MigrationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String versionId; // e.g., V1_0_1

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String scriptName;

    @Column(nullable = false)
    private Long executionTimeMs;

    @Column(nullable = false)
    private String status; // PENDING, SUCCESS, ERROR

    @Column(columnDefinition = "TEXT")
    private String errorDetails;

    @Column(nullable = false)
    private LocalDateTime installedOn;

    @Column(nullable = false)
    private String installedBy;

    @PrePersist
    protected void onCreate() {
        if (installedOn == null) {
            installedOn = LocalDateTime.now();
        }
        if (installedBy == null) {
            installedBy = "System_Auto";
        }
    }
}
