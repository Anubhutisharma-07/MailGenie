package com.email.writer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Entity class representing the history of generated emails and related comments/notes.
 */
@Entity
@Table(name = "email_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalContent;

    private String tone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String generatedReply;

    private String provider;

    private String language;

    @Column(columnDefinition = "TEXT")
    private String userComment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
