package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailKeyRotationManagerTest {

    @Test
    public void testKeyRotation() {
        EmailKeyRotationManager manager = new EmailKeyRotationManager();
        String newKey = manager.rotateKey("KEY-OLD");
        assertNotNull(newKey);
        assertTrue(newKey.startsWith("KEY-"));
        assertFalse(manager.isKeyExpired(newKey));
    }
}
