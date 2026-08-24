package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailRateLimitThrottleEngineTest {

    @Test
    public void testRateLimitation() {
        EmailRateLimitThrottleEngine engine = new EmailRateLimitThrottleEngine();
        assertFalse(engine.isRateLimited("client-123"));
    }
}
