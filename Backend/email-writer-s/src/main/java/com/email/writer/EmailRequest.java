package com.email.writer;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
    private String provider; // e.g., "groq", "openai", "gemini", "claude"
    private String model;    // e.g., specific model name
    private String language; // e.g., "English", "Spanish", "French"
    private String apiKey;   // Optional API key passed from frontend
    private String customInstructions; // Optional user custom prompt or template instructions
    private java.util.Map<String, String> templateVariables; // Dynamic variables for template interpolation
    private boolean composeMode; // true if writing a new email, false/default if generating a reply
}
