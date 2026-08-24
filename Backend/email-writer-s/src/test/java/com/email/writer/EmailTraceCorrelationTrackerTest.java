package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailTraceCorrelationTrackerTest {

    @Test
    public void testTraceGeneration() {
        EmailTraceCorrelationTracker tracker = new EmailTraceCorrelationTracker();
        String traceId = tracker.generateCorrelationTraceId();
        assertTrue(traceId.startsWith("TRACE-MG-"));

        Map<String, String> headers = tracker.attachTraceHeader(traceId, "SPAN-101");
        assertEquals(traceId, headers.get("X-MailGenie-Trace-Id"));
        assertEquals("SPAN-101", headers.get("X-MailGenie-Span-Id"));
    }
}
