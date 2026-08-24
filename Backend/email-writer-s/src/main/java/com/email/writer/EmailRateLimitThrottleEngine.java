package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailRateLimitThrottleEngine {

    private final Map<String, Integer> requestCounts = new HashMap<>();

    public boolean isRateLimited(String clientId) {
        int current = requestCounts.getOrDefault(clientId, 0);
        if (current >= 100) { // Limit 100 requests per window
            return true;
        }
        requestCounts.put(clientId, current + 1);
        return false;
    }
}
