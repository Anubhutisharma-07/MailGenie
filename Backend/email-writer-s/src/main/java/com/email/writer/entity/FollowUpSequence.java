package com.email.writer.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Entity tracking multi-stage scheduled follow-up sequences.
 */
@Entity
@Table(name = "follow_up_sequences")
public class FollowUpSequence {

    public enum Status {
        SCHEDULED, PENDING_REPLY, EXECUTING, COMPLETED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String originalSubject;

    @Lob
    @Column(nullable = false)
    private String originalBody;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SCHEDULED;

    @Column(nullable = false)
    private int delayDays = 3;

    @Column(nullable = false)
    private Instant scheduledExecutionTime;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public FollowUpSequence() {}

    public FollowUpSequence(String recipientEmail, String originalSubject, String originalBody, int delayDays, Instant scheduledExecutionTime) {
        this.recipientEmail = recipientEmail;
        this.originalSubject = originalSubject;
        this.originalBody = originalBody;
        this.delayDays = delayDays;
        this.scheduledExecutionTime = scheduledExecutionTime;
    }

    public String getId() { return id; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getOriginalSubject() { return originalSubject; }
    public void setOriginalSubject(String originalSubject) { this.originalSubject = originalSubject; }
    public String getOriginalBody() { return originalBody; }
    public void setOriginalBody(String originalBody) { this.originalBody = originalBody; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public int getDelayDays() { return delayDays; }
    public void setDelayDays(int delayDays) { this.delayDays = delayDays; }
    public Instant getScheduledExecutionTime() { return scheduledExecutionTime; }
    public void setScheduledExecutionTime(Instant scheduledExecutionTime) { this.scheduledExecutionTime = scheduledExecutionTime; }
    public Instant getCreatedAt() { return createdAt; }
}
