package com.email.writer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email/tone-sentiment")
@CrossOrigin(origins = "*")
public class EmailToneSentimentController {

    @Autowired
    private EmailToneSentimentService toneSentimentService;

    @PostMapping("/analyze")
    public ResponseEntity<EmailToneAnalysis> analyzeTone(@RequestBody Map<String, String> payload) {
        String content = payload.getOrDefault("emailContent", "");
        EmailToneAnalysis result = toneSentimentService.analyzeEmail(content);
        return ResponseEntity.ok(result);
    }
}
