package com.email.writer;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
    private String provider; // e.g., "groq", "openai", "gemini"
    private String model;    // e.g., specific model name
    private String language; // e.g., "English", "Spanish", "French"
    private String apiKey;   // Optional API key passed from frontend
    private boolean composeMode; // true if writing a new email, false/default if generating a reply
}

