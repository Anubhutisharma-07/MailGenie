package com.email.writer;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EmailRetentionPolicyLifecycleManager {

    public boolean isRecordExpired(LocalDateTime archivedAt, int retentionDays) {
        if (archivedAt == null) return false;
        LocalDateTime expirationDate = archivedAt.plusDays(retentionDays);
        return LocalDateTime.now().isAfter(expirationDate);
    }
}
