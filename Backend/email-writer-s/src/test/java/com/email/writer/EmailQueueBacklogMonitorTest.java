package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailQueueBacklogMonitorTest {

    @Test
    public void testQueueMetrics() {
        EmailQueueBacklogMonitor monitor = new EmailQueueBacklogMonitor();
        Map<String, Object> metrics = monitor.getQueueMetrics(600, 10);
        assertTrue((Boolean) metrics.get("isBacklogSaturated"));
    }
}
