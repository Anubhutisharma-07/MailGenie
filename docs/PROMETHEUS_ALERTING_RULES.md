# 🚨 Prometheus Alerting Rules for MailGenie

This document defines standard Prometheus alerting rules for monitoring high error rates, latency degradation, and LLM provider outages.

```yaml
groups:
  - name: mailgenie-service-alerts
    rules:
      - alert: HighEmailGenerationErrorRate
        expr: |
          rate(mailgenie_email_generation_failure_total[5m]) 
          / 
          (rate(mailgenie_email_generation_success_total[5m]) + rate(mailgenie_email_generation_failure_total[5m])) 
          > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "MailGenie generation error rate is above 5%"
          description: "Over 5% of AI email generation requests failed in the last 5 minutes."

      - alert: LLMLatencyDegradation
        expr: histogram_quantile(0.95, sum(rate(mailgenie_email_generation_duration_seconds_bucket[5m])) by (le)) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 generation latency is above 10 seconds"
          description: "Upstream LLM provider response times have degraded significantly."
```
