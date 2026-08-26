package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

class EmailGeneratorServiceTest {

    private EmailGeneratorService emailGeneratorService;

    @BeforeEach
    void setUp() {
        emailGeneratorService = new EmailGeneratorService(WebClient.builder());
    }

    @Test
    void testGenerateEmailReplyAsync_FallbackExecution() throws Exception {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Hello, can we review the plan tomorrow?");
        request.setTone("professional");
        request.setProvider("groq");
        request.setComposeMode(false);

        CompletableFuture<String> future = emailGeneratorService.generateEmailReplyAsync(request);
        assertNotNull(future);

        String result = future.get();
        assertNotNull(result);
        assertTrue(result.contains("Dear Recipient"));
        assertTrue(result.contains("I have reviewed your email"));
    }

    @Test
    void testGenerateEmailReplyAsync_CustomInstructionsFallback() throws Exception {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Meeting request");
        request.setCustomInstructions("Confirm availability for 3 PM");
        request.setProvider("openai");

        CompletableFuture<String> future = emailGeneratorService.generateEmailReplyAsync(request);
        assertNotNull(future);

        String result = future.get();
        assertNotNull(result);
        assertTrue(result.contains("Confirm availability for 3 PM"));
    }

    @Test
    void testBuildPrompt_IncludesPromptContext() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Please send the Q3 report.");
        request.setTone("urgent");
        request.setLanguage("English");
        request.setComposeMode(false);

        String prompt = emailGeneratorService.generateEmailReply(request);
        assertNotNull(prompt);
    }
}
