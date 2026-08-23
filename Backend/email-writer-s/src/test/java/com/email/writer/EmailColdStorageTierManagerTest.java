package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailColdStorageTierManagerTest {

    @Test
    public void testColdStorageMigration() {
        EmailColdStorageTierManager manager = new EmailColdStorageTierManager();
        Map<String, Object> result = manager.moveToColdStorage("ARC-123");
        assertEquals("GLACIER_DEEP_ARCHIVE", result.get("storageClass"));
    }
}
