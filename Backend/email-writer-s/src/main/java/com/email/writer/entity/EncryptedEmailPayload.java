package com.email.writer.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * JPA Entity storing client-encrypted zero-knowledge payloads.
 * Server has zero visibility into plaintext content.
 */
@Entity
@Table(name = "encrypted_email_payloads")
public class EncryptedEmailPayload {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Lob
    @Column(nullable = false)
    private String ciphertext;

    @Column(nullable = false, length = 64)
    private String iv;

    @Column(nullable = false, length = 64)
    private String salt;

    @Column(nullable = false)
    private String payloadType; // DRAFT, TEMPLATE, PROMPT_HISTORY

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public EncryptedEmailPayload() {}

    public EncryptedEmailPayload(String userId, String ciphertext, String iv, String salt, String payloadType) {
        this.userId = userId;
        this.ciphertext = ciphertext;
        this.iv = iv;
        this.salt = salt;
        this.payloadType = payloadType;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCiphertext() { return ciphertext; }
    public void setCiphertext(String ciphertext) { this.ciphertext = ciphertext; }
    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }
    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }
    public String getPayloadType() { return payloadType; }
    public void setPayloadType(String payloadType) { this.payloadType = payloadType; }
    public Instant getCreatedAt() { return createdAt; }
}
