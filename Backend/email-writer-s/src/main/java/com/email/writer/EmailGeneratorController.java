package com.email.writer;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;
    private final EmailHistoryService emailHistoryService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        
        // Auto-save generated email to history if it doesn't indicate an error
        if (response != null && !response.startsWith("Error:") && 
            !response.contains("API error") && 
            !response.startsWith("Unexpected error")) {
            
            String resolvedProvider = emailRequest.getProvider() != null ? emailRequest.getProvider() : "groq";
            String resolvedLanguage = emailRequest.getLanguage() != null ? emailRequest.getLanguage() : "English";

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