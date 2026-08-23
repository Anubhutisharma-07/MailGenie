package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailCorsOriginPolicyEnforcer {

    public boolean isOriginAllowed(String origin) {
        if (origin == null) return false;
        return origin.endsWith("mailgenie.com") || origin.equals("chrome-extension://mailgenie");
    }
}
