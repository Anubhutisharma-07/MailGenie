package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailSubjectLineOptimizerTest {

    @Test
    public void testOptimalSubjectLine() {
        EmailSubjectLineOptimizer optimizer = new EmailSubjectLineOptimizer();
        Map<String, Object> res = optimizer.optimizeSubjectLine("Are you available for a quick sync tomorrow?");
        assertTrue((Integer) res.get("subjectScore") >= 80);
    }
}
