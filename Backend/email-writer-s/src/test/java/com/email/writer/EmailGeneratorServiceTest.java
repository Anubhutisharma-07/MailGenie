package com.email.writer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import static org.junit.jupiter.api.Assertions.*;

class EmailGeneratorServiceTest {

    private EmailGeneratorService emailGeneratorService;

    @BeforeEach
    void setUp() {
        emailGeneratorService = new EmailGeneratorService(WebClient.builder());
    }

    @Test
    void testBuildPrompt_IncludesSubjectContextWhenProvided() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Are you available for a quick sync tomorrow?");
        request.setSubject("Q3 Architecture Review");
        request.setTone("professional");
        request.setLanguage("English");
        request.setComposeMode(false);

        String prompt = emailGeneratorService.buildPrompt(request);

        assertNotNull(prompt);
        assertTrue(prompt.contains("Email Subject / Topic: Q3 Architecture Review"));
        assertTrue(prompt.contains("Are you available for a quick sync tomorrow?"));
        assertTrue(prompt.contains("Use a professional tone."));
        assertTrue(prompt.contains("Write the response strictly in English."));
        assertTrue(prompt.contains("Generate an appropriate email reply for the following email content."));
    }

    @Test
    void testBuildPrompt_OmitsSubjectWhenNullOrEmpty() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Please review the document.");
        request.setTone("casual");
        request.setLanguage("English");
        request.setComposeMode(false);

        String prompt = emailGeneratorService.buildPrompt(request);

        assertNotNull(prompt);
        assertFalse(prompt.contains("Email Subject / Topic:"));
        assertTrue(prompt.contains("Please review the document."));
    }

    @Test
    void testBuildPrompt_ComposeModeWithSubjectAndCustomInstructions() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Introduce our new enterprise email writing platform to client.");
        request.setSubject("Product Launch: MailGenie Enterprise");
        request.setCustomInstructions("Mention 30-day free trial");
        request.setTone("enthusiastic");
        request.setLanguage("English");
        request.setComposeMode(true);

        String prompt = emailGeneratorService.buildPrompt(request);

        assertNotNull(prompt);
        assertTrue(prompt.contains("Write a complete email based on the following instructions."));
        assertTrue(prompt.contains("Email Subject / Topic: Product Launch: MailGenie Enterprise"));
        assertTrue(prompt.contains("Specific User Instructions / Context: Mention 30-day free trial"));
        assertTrue(prompt.contains("Use a enthusiastic tone."));
    }
}
