package com.email.writer.observability;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Service orchestrating application-level Prometheus metrics.
 */
@Service
public class MetricsService {

    private final Counter emailGenerationSuccessCounter;
    private final Counter emailGenerationFailureCounter;
    private final Timer emailGenerationTimer;
    private final Counter cacheHitCounter;
    private final Counter cacheMissCounter;

    public MetricsService(MeterRegistry registry) {
        this.emailGenerationSuccessCounter = Counter.builder("mailgenie.email.generation.success")
                .description("Total successful email generation requests")
                .register(registry);

        this.emailGenerationFailureCounter = Counter.builder("mailgenie.email.generation.failure")
                .description("Total failed email generation requests")
                .register(registry);

        this.emailGenerationTimer = Timer.builder("mailgenie.email.generation.duration")
                .description("Time taken to process and generate email replies")
                .register(registry);

        this.cacheHitCounter = Counter.builder("mailgenie.cache.hits")
                .description("Total cache hits for email generation requests")
                .register(registry);

        this.cacheMissCounter = Counter.builder("mailgenie.cache.misses")
                .description("Total cache misses for email generation requests")
                .register(registry);
    }

    public void recordSuccess() {
        emailGenerationSuccessCounter.increment();
    }

    public void recordFailure() {
        emailGenerationFailureCounter.increment();
    }

    public void recordDuration(long durationMs) {
        emailGenerationTimer.record(durationMs, TimeUnit.MILLISECONDS);
    }

    public void recordCacheHit() {
        cacheHitCounter.increment();
    }

    public void recordCacheMiss() {
        cacheMissCounter.increment();
    }
}
