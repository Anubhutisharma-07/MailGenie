package com.email.writer;

import java.time.LocalDateTime;

public class EncryptedEmailPayload {
    private String vaultId;
    private String cipherText;
    private String initializationVector;
    private String keyId;
    private LocalDateTime encryptedAt;

    public EncryptedEmailPayload() {}

    public EncryptedEmailPayload(String vaultId, String cipherText, String initializationVector, String keyId, LocalDateTime encryptedAt) {
        this.vaultId = vaultId;
        this.cipherText = cipherText;
        this.initializationVector = initializationVector;
        this.keyId = keyId;
        this.encryptedAt = encryptedAt;
    }

    public String getVaultId() { return vaultId; }
    public void setVaultId(String vaultId) { this.vaultId = vaultId; }

    public String getCipherText() { return cipherText; }
    public void setCipherText(String cipherText) { this.cipherText = cipherText; }

    public String getInitializationVector() { return initializationVector; }
    public void setInitializationVector(String initializationVector) { this.initializationVector = initializationVector; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public LocalDateTime getEncryptedAt() { return encryptedAt; }
    public void setEncryptedAt(LocalDateTime encryptedAt) { this.encryptedAt = encryptedAt; }
}
