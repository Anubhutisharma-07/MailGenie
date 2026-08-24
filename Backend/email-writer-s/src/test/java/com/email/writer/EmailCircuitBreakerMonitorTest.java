package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailCircuitBreakerMonitorTest {

    @Test
    public void testCircuitBreakerOpening() {
        EmailCircuitBreakerMonitor cb = new EmailCircuitBreakerMonitor();
        for (int i = 0; i < 5; i++) {
            cb.registerCallResult(false);
        }
        assertEquals("OPEN", cb.getState());
    }
}
