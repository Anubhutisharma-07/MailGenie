package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailReadabilityAnalyzerTest {

    @Test
    public void testReadabilityCalculation() {
        EmailReadabilityAnalyzer analyzer = new EmailReadabilityAnalyzer();
        Map<String, Object> result = analyzer.analyzeReadability("The cat sat on the mat. It was a good day.");

        assertNotNull(result);
        assertTrue((Double) result.get("fleschKincaidScore") > 70.0);
        assertEquals(2, result.get("sentenceCount"));
    }
}
