package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailGdprRightToForgetPolicyEngineTest {

    @Test
    public void testGdprPurge() {
        EmailGdprRightToForgetPolicyEngine engine = new EmailGdprRightToForgetPolicyEngine();
        Map<String, Object> result = engine.executeDataPurge("user-404");
        assertEquals("PURGED_SUCCESSFULLY", result.get("status"));
    }
}
