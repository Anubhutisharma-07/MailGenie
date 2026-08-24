package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailCategoryClassifierEngineTest {

    @Test
    public void testSalesCategoryClassification() {
        EmailCategoryClassifierEngine classifier = new EmailCategoryClassifierEngine();
        Map<String, Object> result = classifier.classifyCategory("Requesting a demo to discuss pricing and solution value.");
        assertEquals("SALES_OUTREACH", result.get("detectedCategory"));
        assertTrue((Double) result.get("confidenceScore") >= 0.80);
    }
}
