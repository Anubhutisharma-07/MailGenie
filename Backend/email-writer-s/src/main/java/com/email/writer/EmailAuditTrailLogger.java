package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailAuditTrailLogger {

    private final List<Map<String, Object>> auditLogs = new ArrayList<>();

    public void logAudit(String userId, String action, String details) {
        Map<String, Object> log = new HashMap<>();
        log.put("auditId", UUID.randomUUID().toString());
        log.put("userId", userId);
        log.put("action", action);
        log.put("details", details);
        log.put("timestamp", System.currentTimeMillis());
        auditLogs.add(log);
    }

    public List<Map<String, Object>> getAuditLogs() {
        return new ArrayList<>(auditLogs);
    }
}
