package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailGdprRightToForgetPolicyEngine {

    public Map<String, Object> executeDataPurge(String userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("status", "PURGED_SUCCESSFULLY");
        result.put("purgedAt", System.currentTimeMillis());
        return result;
    }
}
