package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSpamComplianceCheckerTest {

    @Test
    public void testCleanEmailLowSpamRisk() {
        EmailSpamComplianceChecker checker = new EmailSpamComplianceChecker();
        Map<String, Object> result = checker.checkSpamScore("Hello John, Please review the meeting notes.");
        assertEquals(0.0, result.get("spamScore"));
        assertFalse((Boolean) result.get("isHighRiskSpam"));
    }

    @Test
    public void testHighRiskSpamTriggers() {
        EmailSpamComplianceChecker checker = new EmailSpamComplianceChecker();
        Map<String, Object> result = checker.checkSpamScore("ACT NOW for 100% free cash bonus!!! Click here guaranteed!!!");
        assertTrue((Double) result.get("spamScore") >= 40.0);
        assertTrue((Boolean) result.get("isHighRiskSpam"));
    }
}
