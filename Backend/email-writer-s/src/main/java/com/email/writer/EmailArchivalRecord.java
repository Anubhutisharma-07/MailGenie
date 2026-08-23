package com.email.writer;

import java.time.LocalDateTime;

public class EmailArchivalRecord {
    private String archiveId;
    private String originalEmailId;
    private String compressedContent;
    private String checksum;
    private LocalDateTime archivedAt;
    private int retentionDays;

    public EmailArchivalRecord() {}

    public EmailArchivalRecord(String archiveId, String originalEmailId, String compressedContent, String checksum, LocalDateTime archivedAt, int retentionDays) {
        this.archiveId = archiveId;
        this.originalEmailId = originalEmailId;
        this.compressedContent = compressedContent;
        this.checksum = checksum;
        this.archivedAt = archivedAt;
        this.retentionDays = retentionDays;
    }

    public String getArchiveId() { return archiveId; }
    public void setArchiveId(String archiveId) { this.archiveId = archiveId; }

    public String getOriginalEmailId() { return originalEmailId; }
    public void setOriginalEmailId(String originalEmailId) { this.originalEmailId = originalEmailId; }

    public String getCompressedContent() { return compressedContent; }
    public void setCompressedContent(String compressedContent) { this.compressedContent = compressedContent; }

    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }

    public LocalDateTime getArchivedAt() { return archivedAt; }
    public void setArchivedAt(LocalDateTime archivedAt) { this.archivedAt = archivedAt; }

    public int getRetentionDays() { return retentionDays; }
    public void setRetentionDays(int retentionDays) { this.retentionDays = retentionDays; }
}
