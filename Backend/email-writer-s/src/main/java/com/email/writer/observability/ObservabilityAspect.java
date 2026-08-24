package com.email.writer.observability;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect intercepting email generation methods to measure latencies and log execution traces.
 */
@Aspect
@Component
public class ObservabilityAspect {

    private static final Logger log = LoggerFactory.getLogger(ObservabilityAspect.class);
    private final MetricsService metricsService;

    public ObservabilityAspect(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Around("execution(* com.email.writer.EmailGeneratorService.generateEmailReply(..)) || " +
            "execution(* com.email.writer.service.llm.LlmProviderStrategy.generateEmail(..))")
    public Object profileLlmExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();
        log.info("Starting execution for LLM operation: {}", methodName);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            metricsService.recordSuccess();
            metricsService.recordDuration(duration);
            log.info("Completed LLM operation: {} in {}ms", methodName, duration);
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - start;
            metricsService.recordFailure();
            metricsService.recordDuration(duration);
            log.error("Failed LLM operation: {} after {}ms with error: {}", methodName, duration, ex.getMessage());
            throw ex;
        }
    }
}
