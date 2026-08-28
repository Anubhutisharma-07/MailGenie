package com.email.writer.controller;

import com.email.writer.service.analysis.ReadabilityCalculator;
import com.email.writer.service.analysis.SentimentAnalysisService;
import com.email.writer.service.sanitizer.PiiRedactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller providing email pre-flight PII sanitization and sentiment analysis.
 */
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class EmailAnalysisController {

    private final PiiRedactionService piiService;
    private final SentimentAnalysisService sentimentService;
    private final ReadabilityCalculator readabilityService;

    public EmailAnalysisController(PiiRedactionService piiService,
                                   SentimentAnalysisService sentimentService,
                                   ReadabilityCalculator readabilityService) {
        this.piiService = piiService;
        this.sentimentService = sentimentService;
        this.readabilityService = readabilityService;
    }

    @PostMapping("/inspect")
    public ResponseEntity<Map<String, Object>> inspectEmail(@RequestBody Map<String, String> request) {
        String text = request.getOrDefault("content", "");

        PiiRedactionService.RedactionResult piiResult = piiService.sanitize(text);
        SentimentAnalysisService.SentimentReport sentiment = sentimentService.analyze(text);
        ReadabilityCalculator.ReadabilityScore readability = readabilityService.calculate(text);

        return ResponseEntity.ok(Map.of(
            "piiSanitizedText", piiResult.sanitizedText(),
            "piiCount", piiResult.piiCount(),
            "detectedPiiTypes", piiResult.detectedTypes(),
            "sentiment", sentiment,
            "readability", readability
        ));
    }
}
