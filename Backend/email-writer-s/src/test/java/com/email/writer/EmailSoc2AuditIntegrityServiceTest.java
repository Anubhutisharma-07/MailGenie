package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSoc2AuditIntegrityServiceTest {

    @Test
    public void testSoc2ComplianceCheck() {
        EmailSoc2AuditIntegrityService service = new EmailSoc2AuditIntegrityService();
        Map<String, Object> res = service.verifySoc2Compliance(true, true);
        assertTrue((Boolean) res.get("isSoc2Compliant"));
    }
}
