package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailKeyRotationManager {

    private final Map<String, Long> keyRotationTimes = new HashMap<>();

    public String rotateKey(String oldKeyId) {
        String newKeyId = "KEY-" + UUID.randomUUID().toString().substring(0, 8);
        keyRotationTimes.put(newKeyId, System.currentTimeMillis());
        return newKeyId;
    }

    public boolean isKeyExpired(String keyId) {
        Long created = keyRotationTimes.get(keyId);
        if (created == null) return false;
        long age = System.currentTimeMillis() - created;
        return age > (30L * 24 * 60 * 60 * 1000); // 30 days
    }
}
