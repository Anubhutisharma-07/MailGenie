package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailColdStorageTierManager {

    public Map<String, Object> moveToColdStorage(String archiveId) {
        Map<String, Object> result = new HashMap<>();
        result.put("archiveId", archiveId);
        result.put("storageClass", "GLACIER_DEEP_ARCHIVE");
        result.put("migratedAt", System.currentTimeMillis());
        return result;
    }
}
