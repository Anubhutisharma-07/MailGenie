package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailPlaceholderAutoFiller {

    public String populatePlaceholders(String templateText, Map<String, String> values) {
        if (templateText == null || templateText.trim().isEmpty()) {
            return "";
        }
        if (values == null || values.isEmpty()) {
            return templateText;
        }

        String populated = templateText;
        for (Map.Entry<String, String> entry : values.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String val = entry.getValue() != null ? entry.getValue() : "";
            populated = populated.replace(placeholder, val);
        }
        return populated;
    }
}
