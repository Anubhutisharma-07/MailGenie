package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailPlaceholderAutoFillerTest {

    @Test
    public void testPopulatePlaceholders() {
        EmailPlaceholderAutoFiller filler = new EmailPlaceholderAutoFiller();
        Map<String, String> values = new HashMap<>();
        values.put("RecipientName", "Alice");
        values.put("Topic", "Q3 Budget Review");

        String template = "Hi {{RecipientName}}, let's discuss {{Topic}}.";
        String result = filler.populatePlaceholders(template, values);

        assertEquals("Hi Alice, let's discuss Q3 Budget Review.", result);
    }
}
