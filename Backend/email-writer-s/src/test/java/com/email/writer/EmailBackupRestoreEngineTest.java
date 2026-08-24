package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailBackupRestoreEngineTest {

    @Test
    public void testRestoreEngine() {
        EmailBackupRestoreEngine engine = new EmailBackupRestoreEngine();
        Map<String, Object> res = engine.restoreFromSnapshot("SNAP-777");
        assertEquals("RESTORED_SUCCESSFULLY", res.get("status"));
    }
}
