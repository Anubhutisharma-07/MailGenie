package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailTraceCorrelationTracker {

    public String generateCorrelationTraceId() {
        return "TRACE-MG-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    public Map<String, String> attachTraceHeader(String traceId, String spanId) {
        Map<String, String> headers = new HashMap<>();
        headers.put("X-MailGenie-Trace-Id", traceId);
        headers.put("X-MailGenie-Span-Id", spanId != null ? spanId : UUID.randomUUID().toString().substring(0, 8));
        return headers;
    }
}
