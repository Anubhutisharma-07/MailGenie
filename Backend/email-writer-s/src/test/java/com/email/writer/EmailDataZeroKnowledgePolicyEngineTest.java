package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailDataZeroKnowledgePolicyEngineTest {

    @Test
    public void testZeroKnowledgeRetention() {
        EmailDataZeroKnowledgePolicyEngine policy = new EmailDataZeroKnowledgePolicyEngine();
        assertTrue(policy.validateZeroRetentionPolicy(false));
    }
}
