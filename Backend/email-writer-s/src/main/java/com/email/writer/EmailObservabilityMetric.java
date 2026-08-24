package com.email.writer;

import java.time.LocalDateTime;

public class EmailObservabilityMetric {
    private String metricId;
    private String endpoint;
    private long latencyMs;
    private int statusCode;
    private boolean isSuccess;
    private String clientUserAgent;
    private LocalDateTime timestamp;

    public EmailObservabilityMetric() {}

    public EmailObservabilityMetric(String metricId, String endpoint, long latencyMs, int statusCode,
                                     boolean isSuccess, String clientUserAgent, LocalDateTime timestamp) {
        this.metricId = metricId;
        this.endpoint = endpoint;
        this.latencyMs = latencyMs;
        this.statusCode = statusCode;
        this.isSuccess = isSuccess;
        this.clientUserAgent = clientUserAgent;
        this.timestamp = timestamp;
    }

    public String getMetricId() { return metricId; }
    public void setMetricId(String metricId) { this.metricId = metricId; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(long latencyMs) { this.latencyMs = latencyMs; }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public boolean isSuccess() { return isSuccess; }
    public void setSuccess(boolean success) { isSuccess = success; }

    public String getClientUserAgent() { return clientUserAgent; }
    public void setClientUserAgent(String clientUserAgent) { this.clientUserAgent = clientUserAgent; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
