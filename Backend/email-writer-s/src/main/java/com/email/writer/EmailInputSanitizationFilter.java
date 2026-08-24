package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailInputSanitizationFilter {

    public String sanitizeHtmlXss(String rawInput) {
        if (rawInput == null) return "";
        String clean = rawInput.replaceAll("<script.*?>.*?</script>", "");
        clean = clean.replaceAll("<javascript.*?>.*?</javascript>", "");
        clean = clean.replaceAll("onload=.*?", "");
        return clean.trim();
    }
}
