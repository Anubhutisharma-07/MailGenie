# 📊 Observability, Distributed Tracing & Centralized Logging Guide

This document outlines the observability pipeline integrated into the **MailGenie** backend.

---

## 1. Prometheus Metrics Collection

MailGenie exposes real-time telemetry and SLIs/SLOs via Spring Actuator:

- **Metrics Endpoint:** `GET /actuator/prometheus`
- **Health Check Endpoint:** `GET /actuator/health`

### Key Business Metrics Tracked

| Metric Name | Type | Description |
| :--- | :--- | :--- |
| `mailgenie.email.generation.success` | Counter | Total successfully generated emails |
| `mailgenie.email.generation.failure` | Counter | Total failed generation requests |
| `mailgenie.email.generation.duration` | Timer | Latency distribution of LLM calls |
| `mailgenie.cache.hits` | Counter | Redis template / LLM response cache hits |
| `mailgenie.cache.misses` | Counter | Redis cache misses |

---

## 2. Distributed Tracing with `X-Trace-Id`

Every incoming HTTP and WebSocket request is tagged with an `X-Trace-Id` by `TraceFilter`. 
The trace ID is bound to Logback MDC and stamped onto every log line:

```text
2026-08-23 14:35:10.123 [http-nio-8080-exec-1] INFO  com.email.writer.EmailGeneratorService - [traceId=a1b2c3d4e5f6] - Generating reply with GROQ provider
```

---

## 3. Scraping via Prometheus Server

Add the scrape configuration to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'mailgenie-backend'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['backend:8080']
```
