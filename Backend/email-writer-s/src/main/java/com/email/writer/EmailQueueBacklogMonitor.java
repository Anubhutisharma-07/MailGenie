package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailQueueBacklogMonitor {

    public Map<String, Object> getQueueMetrics(int queueDepth, int activeWorkers) {
        Map<String, Object> res = new HashMap<>();
        res.put("queueDepth", queueDepth);
        res.put("activeWorkers", activeWorkers);
        res.put("isBacklogSaturated", queueDepth > 500);
        return res;
    }
}
