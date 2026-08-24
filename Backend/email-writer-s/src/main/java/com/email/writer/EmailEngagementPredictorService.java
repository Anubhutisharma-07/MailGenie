package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailEngagementPredictorService {

    public Map<String, Object> predictEngagement(String subject, String body) {
        Map<String, Object> prediction = new HashMap<>();
        if (body == null || body.trim().isEmpty()) {
            prediction.put("predictedOpenRate", "0%");
            prediction.put("predictedResponseRate", "0%");
            return prediction;
        }

        int wordCount = body.split("\\s+").length;
        double openRate = 45.0;
        double responseRate = 22.0;

        if (subject != null && subject.contains("?")) openRate += 10.0;
        if (wordCount >= 50 && wordCount <= 125) responseRate += 8.0;

        prediction.put("predictedOpenRate", Math.round(openRate) + "%");
        prediction.put("predictedResponseRate", Math.round(responseRate) + "%");
        return prediction;
    }
}
