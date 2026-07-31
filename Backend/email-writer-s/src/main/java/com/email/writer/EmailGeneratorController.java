package com.email.writer;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;
    private final EmailHistoryService emailHistoryService;
    private final ApiRequestMetricService apiRequestMetricService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        long startTime = System.currentTimeMillis();
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        long duration = System.currentTimeMillis() - startTime;

        String resolvedProvider = emailRequest.getProvider() != null ? emailRequest.getProvider() : "groq";
        String resolvedLanguage = emailRequest.getLanguage() != null ? emailRequest.getLanguage() : "English";
        String resolvedModel = emailRequest.getModel() != null && !emailRequest.getModel().trim().isEmpty() 
                ? emailRequest.getModel() : "default";

        // Determine status
        boolean isSuccess = response != null && !response.startsWith("Error:") && 
                            !response.contains("API error") && 
                            !response.startsWith("Unexpected error");
        String status = isSuccess ? "SUCCESS" : "ERROR";
        int charCount = (isSuccess && response != null) ? response.length() : 0;

        // Save metric record
        try {
            ApiRequestMetric metric = ApiRequestMetric.builder()
                    .provider(resolvedProvider)
                    .model(resolvedModel)
                    .durationMs(duration)
                    .status(status)
                    .characterCount(charCount)
                    .build();
            apiRequestMetricService.saveMetric(metric);
        } catch (Exception e) {
            System.err.println("Failed to log API request metrics: " + e.getMessage());
        }
        
        // Auto-save generated email to history if successful
        if (isSuccess) {
            EmailHistory history = EmailHistory.builder()
                    .originalContent(emailRequest.getEmailContent())
                    .tone(emailRequest.getTone())
                    .generatedReply(response)
                    .provider(resolvedProvider)
                    .language(resolvedLanguage)
                    .build();
            emailHistoryService.saveHistory(history);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<java.util.Map<String, Boolean>> getProviderConfig() {
        return ResponseEntity.ok(emailGeneratorService.getProviderConfigStatus());
    }
}