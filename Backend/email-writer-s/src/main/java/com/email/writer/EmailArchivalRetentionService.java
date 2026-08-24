package com.email.writer;

import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.zip.GZIPOutputStream;

@Service
public class EmailArchivalRetentionService {

    private final List<EmailArchivalRecord> archiveStore = new ArrayList<>();

    public EmailArchivalRecord archiveEmailContent(String emailId, String content, int retentionDays) {
        try {
            ByteArrayOutputStream obj = new ByteArrayOutputStream();
            GZIPOutputStream gzip = new GZIPOutputStream(obj);
            gzip.write(content.getBytes(StandardCharsets.UTF_8));
            gzip.flush();
            gzip.close();

            String compressed = Base64.getEncoder().encodeToString(obj.toByteArray());

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(content.getBytes(StandardCharsets.UTF_8));
            String checksum = Base64.getEncoder().encodeToString(digest);

            EmailArchivalRecord record = new EmailArchivalRecord(
                UUID.randomUUID().toString(),
                emailId,
                compressed,
                checksum,
                LocalDateTime.now(),
                retentionDays
            );

            archiveStore.add(record);
            return record;
        } catch (Exception e) {
            throw new RuntimeException("Archival failed", e);
        }
    }

    public List<EmailArchivalRecord> getArchivedRecords() {
        return new ArrayList<>(archiveStore);
    }
}
