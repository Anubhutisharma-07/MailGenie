package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailSecurityMaskingEngine {

    public String maskSensitiveData(String emailContent) {
        if (emailContent == null) return "";
        // Mask credit cards
        String masked = emailContent.replaceAll("\\b(?:\\d[ -]*?){13,16}\\b", "****-****-****-****");
        // Mask SSN
        masked = masked.replaceAll("\\b\\d{3}-\\d{2}-\\d{4}\\b", "***-**-****");
        return masked;
    }
}
