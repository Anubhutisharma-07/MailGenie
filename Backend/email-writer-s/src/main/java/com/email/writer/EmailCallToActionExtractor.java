package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailCallToActionExtractor {

    private static final Set<String> CTA_VERBS = new HashSet<>(Arrays.asList(
        "schedule", "confirm", "reply", "click", "download", "review", "approve", "sign",
        "verify", "register", "submit", "join", "call", "meet"
    ));

    public Map<String, Object> extractCTA(String content) {
        Map<String, Object> result = new HashMap<>();
        if (content == null || content.trim().isEmpty()) {
            result.put("hasClearCTA", false);
            result.put("detectedActionVerbs", Collections.emptyList());
            return result;
        }

        String lower = content.toLowerCase();
        List<String> foundVerbs = new ArrayList<>();
        for (String verb : CTA_VERBS) {
            if (lower.contains(verb)) {
                foundVerbs.add(verb);
            }
        }

        boolean hasCTA = !foundVerbs.isEmpty();
        result.put("hasClearCTA", hasCTA);
        result.put("detectedActionVerbs", foundVerbs);
        result.put("ctaRecommendation", hasCTA
            ? "Clear action verb detected."
            : "No explicit Call To Action (CTA) detected. Add a clear action step like 'Please reply' or 'Schedule a call'."
        );
        return result;
    }
}
