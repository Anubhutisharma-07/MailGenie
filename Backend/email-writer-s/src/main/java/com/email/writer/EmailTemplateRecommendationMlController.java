package com.email.writer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email/templates/recommendations")
@CrossOrigin(origins = "*")
public class EmailTemplateRecommendationMlController {

    @Autowired
    private EmailTemplateRecommendationMlService recommendationMlService;

    @PostMapping
    public ResponseEntity<List<EmailTemplateRecommendationResult>> getRecommendations(@RequestBody Map<String, String> payload) {
        String prompt = payload.getOrDefault("prompt", "");
        String role = payload.getOrDefault("targetRole", "PROFESSIONAL");
        List<EmailTemplateRecommendationResult> recommendations = recommendationMlService.recommendTemplates(prompt, role);
        return ResponseEntity.ok(recommendations);
    }
}
