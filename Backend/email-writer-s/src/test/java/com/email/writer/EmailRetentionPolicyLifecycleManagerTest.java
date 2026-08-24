package com.email.writer;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class EmailRetentionPolicyLifecycleManagerTest {

    @Test
    public void testExpirationLogic() {
        EmailRetentionPolicyLifecycleManager manager = new EmailRetentionPolicyLifecycleManager();
        LocalDateTime past = LocalDateTime.now().minusDays(10);
        assertFalse(manager.isRecordExpired(past, 30));

        LocalDateTime longPast = LocalDateTime.now().minusDays(40);
        assertTrue(manager.isRecordExpired(longPast, 30));
    }
}
