package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailCorsOriginPolicyEnforcerTest {

    @Test
    public void testAllowedOrigins() {
        EmailCorsOriginPolicyEnforcer enforcer = new EmailCorsOriginPolicyEnforcer();
        assertTrue(enforcer.isOriginAllowed("https://app.mailgenie.com"));
        assertFalse(enforcer.isOriginAllowed("https://malicious.com"));
    }
}
