package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailBackupSnapshotManagerTest {

    @Test
    public void testSnapshotCreation() {
        EmailBackupSnapshotManager manager = new EmailBackupSnapshotManager();
        Map<String, Object> snap = manager.createSnapshot(150);
        assertEquals("SUCCESS", snap.get("status"));
        assertEquals(150, snap.get("totalRecordsArchived"));
    }
}
