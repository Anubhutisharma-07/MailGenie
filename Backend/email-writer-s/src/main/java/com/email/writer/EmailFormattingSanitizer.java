package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailFormattingSanitizer {

    public String sanitizeAndFormat(String input) {
        if (input == null) return "";
        String clean = input.trim();
        clean = clean.replaceAll("\\s+", " "); // normalize multiple spaces
        clean = clean.replaceAll("\n{3,}", "\n\n"); // normalize multi-newlines
        return clean;
    }
}
