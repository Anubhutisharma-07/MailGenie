package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailCallToActionExtractorTest {

    @Test
    public void testCTAExtraction() {
        EmailCallToActionExtractor extractor = new EmailCallToActionExtractor();
        Map<String, Object> result = extractor.extractCTA("Please review and confirm the contract by tomorrow.");
        assertTrue((Boolean) result.get("hasClearCTA"));
    }
}
